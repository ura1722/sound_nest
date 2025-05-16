import { Album } from "../models/albumModel.js";
import { Song } from "../models/songModel.js";
import { User } from "../models/userModel.js";


export const getStatistics = async (req, res, next) => {
	try {
		const [totalSongs, totalAlbums, totalUsers, uniqueAuthors] = await Promise.all([
			Song.countDocuments(),
			Album.countDocuments(),
			User.countDocuments(),

			Song.aggregate([
				{
					$unionWith: {
						coll: "albums",
						pipeline: [],
					},
				},
				{
					$group: {
						_id: "$songAuthor",
					},
				},
				{
					$count: "count",
				},
			]),
		]);

		res.status(200).json({
			totalAlbums,
			totalSongs,
			totalUsers,
			totalAuthors: uniqueAuthors[0]?.count || 0,
		});
	} catch (error) {
		next(error);
	}
};
