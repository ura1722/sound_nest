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
    const { likeMatrix, songIndexMap, allSongs } = await buildMatrix();
    const currentUser = await User.findOne({ clerkId: req.auth.userId });
    
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = currentUser._id;
    const allUsers = await User.find().lean();
    const userIndex = allUsers.findIndex(u => u._id.toString() === userId.toString());
    
    if (userIndex === -1) return res.json([]);

    // Отримуємо рекомендації (top-10)
    const recommendedIndices = recommend.cFilter(likeMatrix, userIndex).slice(0, 10);
    
    // Отримуємо ID рекомендованих пісень
    const recommendedSongIds = recommendedIndices
      .map(index => {
        const songId = Object.keys(songIndexMap).find(
          key => songIndexMap[key] === index
        );
        return songId;
      })
      .filter(Boolean);

    // Отримуємо повну інформацію про пісні з популяцією авторів
    const recommendedSongs = await Song.find({
      _id: { $in: recommendedSongIds }
    })
    .populate({
      path: 'songAuthor',
      select: '_id name' // Беремо і ID і ім'я автора
    })
    .lean();

    // Форматуємо результат для фронтенду
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
      // Якщо автора немає, повертаємо undefined
      const { songAuthor, ...rest } = song;
      return rest;
    });

    res.json(formattedSongs);
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
      return res.status(404).json({ message: "User not found" });
    }

    // Get top 3 preferred genres (highest scores)
    const topGenres = Object.entries(currentUser.preferences.genres)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    // Get top 2 preferred decades
    const topDecades = Object.entries(currentUser.preferences.decades)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([decade]) => decade);

    // Get top 2 preferred moods
    const topMoods = Object.entries(currentUser.preferences.moods)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([mood]) => mood);

    // Get recommended songs based on preferences
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
    // Отримуємо поточного користувача з його вподобаннями
    const currentUser = await User.findOne({ clerkId: req.auth.userId })
      .select('preferences')
      .lean();

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Отримуємо ID авторів, які є у вподобаннях користувача
    const preferredArtistIds = Object.keys(currentUser.preferences.artists)
      .filter(artistId => currentUser.preferences.artists[artistId] > 0);

    // Якщо є улюблені автори - отримуємо їх пісні
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
