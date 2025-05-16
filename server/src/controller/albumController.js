import { Album } from "../models/albumModel.js";

export const getAlbums = async (req, res, next) => {
	try {
		const albums = await Album.find();
		res.status(200).json(albums);
	} catch (error) {
		next(error);
	}
};

export const getAlbumById = async (req, res, next) => {
	try {
		const { id } = req.params;

		const album = await Album.findById(id).populate("albumSongs");

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		res.status(200).json(album);
	} catch (error) {
		next(error);
	}
};
