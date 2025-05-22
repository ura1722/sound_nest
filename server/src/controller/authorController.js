import { Album } from "../models/albumModel.js";
import { Author } from "../models/authorModel.js";
import { Song } from "../models/songModel.js";

export const getAuthors = async (req, res, next) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (error) {
        next(error);
    }
};

export const getAuthorById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const author = await Author.findById(id);
    
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Отримуємо альбоми автора
    const albums = await Album.find({ albumAuthor: id })
      .sort({ albumRelease: -1 });

    // Отримуємо всі пісні автора (які не входять в альбоми)
    const songs = await Song.find({ 
      songAuthor: id,
      albumId: null
    }).populate({
          path: 'songAuthor',
          select: '_id name'  // Обираємо тільки _id та name для автора пісні
        })

    res.json({
      ...author.toObject(),
      albums,
      songs
    });
    } catch (error) {
        next(error);
    }
};



