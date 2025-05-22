import { Album } from "../models/albumModel.js";
import { Author } from "../models/authorModel.js";
import { Song } from "../models/songModel.js";
import { User } from "../models/userModel.js";


export const getStatistics = async (req, res, next) => {
	try {
		const [totalSongs, totalAlbums, totalUsers, totalAuthors] = await Promise.all([
			Song.countDocuments(),
			Album.countDocuments(),
			User.countDocuments(),
			Author.countDocuments(),
		]);

		res.status(200).json({
			totalAlbums,
			totalSongs,
			totalUsers,
			totalAuthors,
		});
	} catch (error) {
		next(error);
	}
};
