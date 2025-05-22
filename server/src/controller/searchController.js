import { Album } from "../models/albumModel.js";
import { Author } from "../models/authorModel.js";
import { Song } from "../models/songModel.js";

export const getSearchResults = async (req, res) => {
    try {
        const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters long' });
    }

    // Пошук пісень
    const songs = await Song.find({
      
         songTitle: { $regex: query, $options: 'i' } ,
        
      
    }).populate({
            path: 'songAuthor',
            select: '_id name'  // Обираємо тільки _id та name для автора пісні
    }).limit(5);

    // Пошук альбомів
    const albums = await Album.find({
      albumTitle: { $regex: query, $options: 'i' }
    }).populate({
            path: 'albumAuthor',
            select: '_id name'  // Обираємо тільки _id та name для автора пісні
    }).limit(5);

    // Пошук виконавців
    const artists = await Author.find({
      name: { $regex: query, $options: 'i' }
    }).limit(5);

    // Форматування результатів
    const results = [
      ...songs.map(song => ({
        id: song._id,
        type: 'song',
        title: song.songTitle,
        author: song.songAuthor.name || 'Unknown artist',
        authorId: song.songAuthor._id,
        albumId: song.albumId,
        imageUrl: song.songImgUrl 
      })),
      ...albums.map(album => ({
        id: album._id,
        type: 'album',
        title: album.albumTitle,
        author: album.albumAuthor.name || 'Various artists',
        imageUrl: album.albumImgUrl
      })),
      ...artists.map(artist => ({
        id: artist._id,
        type: 'artist',
        title: artist.name,
        imageUrl: artist.imageUrl
      }))
    ].sort((a, b) => a.title.localeCompare(b.title)); // Сортування за назвою

    res.json(results);
    } catch (error) {
        console.error("Error updating playlist cover:", error);
        res.status(500).json({ 
            message: 'Error updating playlist cover', 
            error: error.message 
        });
    }
};
