import { Song } from "../models/songModel.js";
import { User } from "../models/userModel.js";
import { buildMatrix } from "../servises/buildMatrix.js";
import recommend from "collaborative-filter";

export const getSongs = async (req, res, next) => {
	try {
		
		const songs = await Song.find().sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		const { likeMatrix, songIndexMap, allSongs } = await buildMatrix();
		const currentUser = await User.findOne({ clerkId: req.auth.userId });
		if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const userId = currentUser._id;
  // Знаходимо індекс поточного користувача
  const allUsers = await User.find().lean();
  const userIndex = allUsers.findIndex(u => u._id.toString() === userId.toString());
  
  if (userIndex === -1) return [];

  // Отримуємо рекомендації (top-10)
  const recommendedIndices = recommend.cFilter(likeMatrix, userIndex).slice(0, 10);
  
  // Трансформуємо індекси у пісні
	const recommendedSongs = recommendedIndices
      .map(index => {
        const songId = Object.keys(songIndexMap).find(
          key => songIndexMap[key] === index
        );
        return allSongs.find(s => s._id.toString() === songId);
      })
      .filter(Boolean); // Видаляємо undefined (якщо пісня не знайдена)

    res.json(recommendedSongs); // Повертаємо масив пісень, а не індексів
	} catch (error) {
		next(error);
	}
};

export const getRecommendedSongs = async (req, res, next) => {
	try {
		
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					songTitle: 1,
					songAuthor: 1,
					songImgUrl: 1,
					songAudioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getTrendingSongs = async (req, res, next) => {
	try {
		
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					songTitle: 1,
					songAuthor: 1,
					songImgUrl: 1,
					songAudioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};
