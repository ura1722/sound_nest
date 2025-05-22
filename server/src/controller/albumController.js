import { Album } from "../models/albumModel.js";

export const getAlbums = async (req, res, next) => {
	try {
		const albums = await Album.find().populate({
            path: 'albumAuthor',
            select: 'name' // Вибираємо тільки поле name з документу Author
        });
		res.status(200).json(albums);
	} catch (error) {
		next(error);
	}
};

export const getAlbumById = async (req, res, next) => {
	try {
		const { id } = req.params;

		const album = await Album.findById(id).populate({
        path: 'albumAuthor',
        select: '_id name'  // Обираємо тільки _id та name для автора
      })
      .populate({
        path: 'albumSongs',
        populate: {
          path: 'songAuthor',
          select: '_id name'  // Обираємо тільки _id та name для автора пісні
        }
      });

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		res.status(200).json(album);
	} catch (error) {
		next(error);
	}
};
