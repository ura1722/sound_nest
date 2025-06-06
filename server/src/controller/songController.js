import { Song } from "../models/songModel.js";
import { User } from "../models/userModel.js";
import { buildMatrix } from "../servises/buildMatrix.js";
import recommend from "collaborative-filter";
import mongoose from "mongoose";

export const getSongs = async (req, res, next) => {
	try {
		
		const songs = await Song.find().populate({
            path: 'songAuthor',
            select: 'name' // Вибираємо тільки поле name з документу Author
        });
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getDiscoverSongs = async (req, res, next) => {
  try {
    
    const currentUser = await User.findOne({ clerkId: req.auth.userId });
    
    if (!currentUser) {
      
      const randomSongs = await Song.aggregate([
        { $sample: { size: 6 } },
        {
          $lookup: {
            from: "authors",
            localField: "songAuthor",
            foreignField: "_id",
            as: "authorData"
          }
        },
        { $unwind: "$authorData" },
        {
          $project: {
            _id: 1,
            songTitle: 1,
            songImgUrl: 1,
            songAudioUrl: 1,
            songAuthor: {
              _id: "$authorData._id",
              name: "$authorData.name"
            }
          }
        }
      ]);
      return res.json(randomSongs);
    }

    const { likeMatrix, songIndexMap, allSongs } = await buildMatrix();
    const userId = currentUser._id;
    const allUsers = await User.find().lean();
    const userIndex = allUsers.findIndex(u => u._id.toString() === userId.toString());
    
    if (userIndex === -1) return res.json([]);

    const recommendedIndices = recommend.cFilter(likeMatrix, userIndex).slice(0, 10);
    
    const recommendedSongIds = recommendedIndices
      .map(index => {
        const songId = Object.keys(songIndexMap).find(
          key => songIndexMap[key] === index
        );
        return songId;
      })
      .filter(Boolean);

    const recommendedSongs = await Song.find({
      _id: { $in: recommendedSongIds }
    })
    .populate({
      path: 'songAuthor',
      select: '_id name' 
    })
    .lean();

    const formattedSongs = recommendedSongs.map(song => {
      
      if (song.songAuthor && song.songAuthor._id) {
        return {
          ...song,
          songAuthor: {
            _id: song.songAuthor._id,
            name: song.songAuthor.name
          }
        };
      }
      const { songAuthor, ...rest } = song;
      return rest;
    });
    res.json(formattedSongs);
  } catch (error) {
    next(error);
  }
};
export const getFriendsRecentlyPlayed = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ clerkId: req.auth.userId })
      .populate({
        path: 'friends',
        select: 'userName recentlyPlayed',
        match: { recentlyPlayed: { $exists: true, $ne: [] } }
      });

    if (!currentUser) {
      return res.json([]);
    }

    // Collect all recently played songs from friends
    let allFriendSongs = [];
    
    for (const friend of currentUser.friends) {
      if (friend.recentlyPlayed?.length > 0) {
        allFriendSongs.push(...friend.recentlyPlayed.map(played => ({
          songId: played.song,
          friendName: friend.userName
        })));
      }
    }

    if (allFriendSongs.length === 0) {
      return res.json([]);
    }

    // Shuffle and select up to 4 songs
    const selectedSongs = allFriendSongs
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map(s => s.songId);

    // Get full song data
    let result = await Song.find({
      _id: { $in: selectedSongs }
    })
    .populate('songAuthor', 'name')
    .lean();

    
    if (result.length < 4) {
      const needed = 4 - result.length;
      const randomSongs = await Song.aggregate([
        { $match: { _id: { $nin: result.map(s => s._id) } } },
        { $sample: { size: needed } },
        {
          $lookup: {
            from: "authors",
            localField: "songAuthor",
            foreignField: "_id",
            as: "songAuthor"
          }
        },
        { $unwind: "$songAuthor" },
        {
          $project: {
            _id: 1,
            songTitle: 1,
            albumId: 1,
            songImgUrl: 1,
            songAudioUrl: 1,
            songAuthor: {
              name: 1
            }
          }
        }
      ]);

      result = [...result, ...randomSongs];
    }

    
    const formattedResult = result.slice(0, 4).map(song => ({
      _id: song._id,
      songTitle: song.songTitle,
      songImgUrl: song.songImgUrl,
      albumId: song.albumId,
      songAudioUrl: song.songAudioUrl,
      songAuthor: song.songAuthor
    }));

    res.json(formattedResult);
  } catch (error) {
    next(error);
  }
};
export const addToRecentlyPlayed = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const userId = req.auth.userId;

    // 1. Знаходимо користувача
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Перевіряємо, чи пісня вже є в історії
    const existingSongIndex = user.recentlyPlayed.findIndex(
      item => item.song.toString() === songId
    );

    if (existingSongIndex !== -1) {
      // 3. Якщо пісня вже є - оновлюємо час відтворення
      user.recentlyPlayed[existingSongIndex].playedAt = new Date();
      await user.save();
    } else {
      // 4. Якщо пісні немає - додаємо новий запис
      await User.findOneAndUpdate(
        { clerkId: userId },
        {
          $push: {
            recentlyPlayed: {
              $each: [{ song: songId, playedAt: new Date() }],
              $slice: -20
            }
          }
        }
      );
    }

    res.status(200).json({ message: "Recently played updated" });
  } catch (error) {
    next(error);
  }
};

export const getRecentlyPlayed = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const user = await User.findOne({ clerkId: userId })
      .select('recentlyPlayed')
      .populate({
        path: 'recentlyPlayed.song',
        populate: {
          path: 'songAuthor',
          select: 'name'
        }
      });

    if (!user) {
      return res.json({});
    }

    
    const recentlyPlayed = user.recentlyPlayed
      .sort((a, b) => b.playedAt - a.playedAt)
      .map(item => ({
        ...item.song.toObject(),
        playedAt: item.playedAt
      }));

    res.json(recentlyPlayed);
  } catch (error) {
    next(error);
  }
};
export const getRecommendedSongs = async (req, res, next) => {
  try {
    // Get current user with preferences
    const currentUser = await User.findOne({ clerkId: req.auth.userId })
      .select('preferences')
      .lean();

    if (!currentUser) {
      
      const randomSongs = await Song.aggregate([
        { $sample: { size: 4 } },
        {
          $lookup: {
            from: "authors",
            localField: "songAuthor",
            foreignField: "_id",
            as: "authorData"
          }
        },
        { $unwind: "$authorData" },
        {
          $project: {
            _id: 1,
            songTitle: 1,
            songImgUrl: 1,
            albumId: 1,
            songAudioUrl: 1,
            songAuthor: {
              _id: "$authorData._id",
              name: "$authorData.name"
            }
          }
        }
      ]);
      return res.json(randomSongs);
    }

    // Get top 3 preferred genres (highest scores)
    const topGenres = Object.entries(currentUser.preferences.genres)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    
    const topDecades = Object.entries(currentUser.preferences.decades)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([decade]) => decade);

    
    const topMoods = Object.entries(currentUser.preferences.moods)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([mood]) => mood);

   
    const recommendedSongs = await Song.aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "songAuthor",
          foreignField: "_id",
          as: "authorData"
        }
      },
      { $unwind: "$authorData" },
      {
        $match: {
          $or: [
            { "authorData.genres": { $in: topGenres } },
            { "authorData.decades": { $in: topDecades } },
            { "authorData.moods": { $in: topMoods } }
          ]
        }
      },
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          songTitle: 1,
          songImgUrl: 1,
          albumId: 1,
          songAudioUrl: 1,
          songAuthor: {
            _id: "$authorData._id",
            name: "$authorData.name"
          }
        }
      }
    ]);

    res.json(recommendedSongs);
  } catch (error) {
    next(error);
  }
};

export const getFeatureSongs = async (req, res, next) => {
  try {
    
    const currentUser = await User.findOne({ clerkId: req.auth.userId })
      .select('preferences')
      .lean();

    if (!currentUser) {
      
      const randomSongs = await Song.aggregate([
        { $sample: { size: 4 } },
        {
          $lookup: {
            from: "authors",
            localField: "songAuthor",
            foreignField: "_id",
            as: "authorData"
          }
        },
        { $unwind: "$authorData" },
        {
          $project: {
            _id: 1,
            songTitle: 1,
            albumId: 1,
            songImgUrl: 1,
            songAudioUrl: 1,
            songAuthor: {
              _id: "$authorData._id",
              name: "$authorData.name"
            }
          }
        }
      ]);
      return res.json(randomSongs);
    }

    
    const preferredArtistIds = Object.keys(currentUser.preferences.artists)
      .filter(artistId => currentUser.preferences.artists[artistId] > 0);

    
    let trendingSongs = [];
    if (preferredArtistIds.length > 0) {
      trendingSongs = await Song.aggregate([
        {
          $match: {
            songAuthor: { $in: preferredArtistIds.map(id => new mongoose.Types.ObjectId(id)) }
          }
        },
        {
          $lookup: {
            from: "authors",
            localField: "songAuthor",
            foreignField: "_id",
            as: "authorData"
          }
        },
        { $unwind: "$authorData" },
        { $sample: { size: 4 } },
        {
          $project: {
            _id: 1,
            songTitle: 1,
            albumId: 1,
            songImgUrl: 1,
            songAudioUrl: 1,
            songAuthor: {
              _id: "$authorData._id",
              name: "$authorData.name"
            }
          }
        }
      ]);
    }

    res.json(trendingSongs);
  } catch (error) {
    next(error);
  }
};
