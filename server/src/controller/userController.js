import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import { Author } from "../models/authorModel.js";
import { Song } from "../models/songModel.js";

export const getUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};
export const addFriend = async (req, res, next) => {
  try {
    const { friendId } = req.body;
    const currentUserId = req.auth.userId;

    // Перевіряємо, чи існують користувачі
    const [currentUser, friendUser] = await Promise.all([
      User.findOne({ clerkId: currentUserId }),
      User.findById(friendId)
    ]);

    if (!currentUser || !friendUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Перевіряємо, чи вони вже друзі
    if (currentUser.friends.includes(friendUser._id)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Додаємо друга
    currentUser.friends.push(friendUser._id);
    await currentUser.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    next(error);
  }
};

export const removeFriend = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.auth.userId;

    const user = await User.findOneAndUpdate(
      { clerkId: currentUserId },
      { $pull: { friends: id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const friend = await User.findById(id);

     await Message.deleteMany({
      $or: [
        { senderId: currentUserId, receiverId: friend.clerkId},
        { senderId: friend.clerkId, receiverId: currentUserId }
      ]
    });
    res.status(200).json({ friendId: id });
  } catch (error) {
    next(error);
  }
};
export const getUserFriends = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    
    // Знаходимо користувача з його друзями
    const user = await User.findOne({ clerkId: currentUserId })
      .populate({
        path: 'friends',
        select: '_id userName userImgUrl clerkId', // Обираємо тільки необхідні поля
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Форматуємо відповідь
    const formattedFriends = user.friends?.map(friend => ({
      _id: friend._id.toString(),
      userName: friend.userName,
      userImgUrl: friend.userImgUrl,
      clerkId: friend.clerkId
    })) || [];

    res.status(200).json(formattedFriends);
  } catch (error) {
    next(error);
  }
};
export const getUser = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    
    // Знаходимо користувача з його друзями
    const user = await User.findOne({ clerkId: currentUserId })
      

   
    res.status(200).json(user._id);
  } catch (error) {
    next(error);
  }
};

export const toggleLikeSong = async (req, res, next) => {
  try {
    const { songId } = req.body;
    const currentUserId = req.auth.userId;
    
    // Знаходимо користувача та пісню
    const user = await User.findOne({ clerkId: currentUserId });
    const song = await Song.findById(songId)
      .populate('songAuthor')
      .populate('albumId');
    
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!song) return res.status(404).json({ message: "Song not found" });

    // Перевіряємо чи вже лайкнута пісня
    const isLiked = user.likedSongs.some(id => id.toString() === songId);
    const valueChange = isLiked ? -1 : 1; // +1 для лайку, -1 для зняття лайку

    // Оновлюємо список лайкнутих пісень
    const updateOperation = isLiked 
      ? { $pull: { likedSongs: songId } }
      : { $addToSet: { likedSongs: songId } };

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateOperation,
      { new: true }
    );

    // Ініціалізуємо preferences якщо їх немає
    if (!updatedUser.preferences) {
      updatedUser.preferences = {
        genres: new Map(),
        artists: new Map(),
        decades: new Map(),
        moods: new Map()
      };
    }

    // Оновлюємо характеристики на основі пісні
    // Жанри
    song.genres.forEach(genre => {
      const currentValue = updatedUser.preferences.genres.get(genre) || 0;
      updatedUser.preferences.genres.set(genre, Math.max(0, currentValue + valueChange));
    });

    // Декада
    if (song.decade) {
      const currentValue = updatedUser.preferences.decades.get(song.decade) || 0;
      updatedUser.preferences.decades.set(song.decade, Math.max(0, currentValue + valueChange));
    }

    // Настрої
    song.moods.forEach(mood => {
      const currentValue = updatedUser.preferences.moods.get(mood) || 0;
      updatedUser.preferences.moods.set(mood, Math.max(0, currentValue + valueChange));
    });

    // Автор (якщо є)
    if (song.songAuthor) {
      const authorId = song.songAuthor._id.toString();
      const currentValue = updatedUser.preferences.artists.get(authorId) || 0;
      updatedUser.preferences.artists.set(authorId, Math.max(0, currentValue + valueChange));
    }

    await updatedUser.save();

    const formattedSongs = updatedUser.likedSongs.map(song => ({
      _id: song._id.toString(),
      songTitle: song.songTitle,
      songAuthor: song.songAuthor ? {
        _id: song.songAuthor._id.toString(),
        name: song.songAuthor.name
      } : undefined,
      albumId: song.albumId ? {
        _id: song.albumId._id.toString(),
        albumTitle: song.albumId.albumTitle
      } : undefined,
      genres: song.genres,
      moods: song.moods,
      decade: song.decade,
      songImgUrl: song.songImgUrl,
      songAudioUrl: song.songAudioUrl,
      songDuration: song.songDuration,
     
    }));
      
      
    
    res.status(200).json({
      message: isLiked ? "Song unliked successfully" : "Song liked successfully",
      likedSongs: formattedSongs
    });

  } catch (error) {
    next(error);
  }
};
export const updatePlaybackStats = async (req, res, next) => {
  try {
    const { songId, skipped } = req.body;
    const userId = req.auth.userId;

    // Знаходимо пісню
    const song = await Song.findById(songId)
      .populate('songAuthor')
      .populate('albumId');
    
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Знаходимо користувача
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ініціалізуємо preferences, якщо їх немає
    if (!user.preferences) {
      user.preferences = {
        genres: new Map(),
        artists: new Map(),
        decades: new Map(),
        moods: new Map()
      };
    }

    
    const valueChange = skipped ? -1 : 1;

    // Оновлюємо характеристики
    song.genres.forEach(genre => {
      const currentValue = user.preferences.genres.get(genre) || 0;
      user.preferences.genres.set(genre, Math.max(0, currentValue + valueChange));
    });

    if (song.decade) {
      const currentValue = user.preferences.decades.get(song.decade) || 0;
      user.preferences.decades.set(song.decade, Math.max(0, currentValue + valueChange));
    }

    song.moods.forEach(mood => {
      const currentValue = user.preferences.moods.get(mood) || 0;
      user.preferences.moods.set(mood, Math.max(0, currentValue + valueChange));
    });

    if (song.songAuthor) {
      const authorId = song.songAuthor._id.toString();
      const currentValue = user.preferences.artists.get(authorId) || 0;
      user.preferences.artists.set(authorId, Math.max(0, currentValue + valueChange));
    }

    await user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getLikedSongs = async (req, res, next) => {
  try {
    // Знаходимо користувача з пов'язаними піснями
    const user = await User.findOne({ clerkId: req.auth.userId })
      .populate({
        path: 'likedSongs',
        select: '_id songTitle songAuthor albumId genres moods decade songImgUrl songAudioUrl songDuration createdAt updatedAt',
        populate: [
          {
            path: 'songAuthor',
            select: '_id name',
            model: 'Author'
          },
          {
            path: 'albumId',
            select: '_id albumTitle',
            model: 'Album'
          }
        ]
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Форматуємо відповідь відповідно до інтерфейсу Song
    const formattedSongs = user.likedSongs.map(song => ({
      _id: song._id.toString(),
      songTitle: song.songTitle,
      ...(song.songAuthor && {
        songAuthor: {
          _id: song.songAuthor._id.toString(),
          name: song.songAuthor.name
        }
      }),
      ...(song.albumId && {
        albumId: {
          _id: song.albumId._id.toString(),
          albumTitle: song.albumId.albumTitle
        }
      }),
      genres: song.genres || [],
      moods: song.moods || [],
      decade: song.decade || '',
      songImgUrl: song.songImgUrl || '',
      songAudioUrl: song.songAudioUrl || '',
      songDuration: song.songDuration || 0,
      
    }));

    res.status(200).json(formattedSongs);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const addAuthors = async (req, res, next) => {
  try {
    const { authorIds } = req.body;

    // Отримуємо вибраних авторів
    const authors = await Author.find({ _id: { $in: authorIds } });
    
    // Отримуємо користувача
    const user = await User.findOne({ clerkId: req.auth.userId  });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ініціалізуємо preferences, якщо їх немає
    if (!user.preferences) {
      user.preferences = {
        genres: new Map(),
        artists: new Map(),
        decades: new Map(),
        moods: new Map()
      };
    }

    // Оновлюємо переваги на основі авторів
    for (const author of authors) {
      // Додаємо +5 до жанрів автора
      author.genres.forEach(genre => {
        const currentValue = user.preferences.genres.get(genre) || 0;
        user.preferences.genres.set(genre, currentValue + 5);
      });

      // Додаємо +5 до декад автора
      author.decades.forEach(decade => {
        const currentValue = user.preferences.decades.get(decade) || 0;
        user.preferences.decades.set(decade, currentValue + 5);
      });

      // Додаємо +5 до настроїв автора
      author.moods.forEach(mood => {
        const currentValue = user.preferences.moods.get(mood) || 0;
        user.preferences.moods.set(mood, currentValue + 5);
      });

      // Додаємо автора до обраних
      user.preferences.artists.set(author._id.toString(), 5);
    }

    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
