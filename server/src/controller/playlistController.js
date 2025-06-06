import cloudinary from "../lib/cloudinary.js";
import { Playlist } from '../models/playlistModel.js';
import { User } from '../models/userModel.js';

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
};


export const createPlaylist = async (req, res) => {
    try {
        const { playlistTitle } = req.body;
        
        const user = await User.findOne({ clerkId: req.auth.userId });
        
        let playlistImgUrl;
        
        // Перевіряємо, чи було завантажено зображення
        if (req.files && req.files.imageFile) {
            const { imageFile } = req.files;
            playlistImgUrl = await uploadToCloudinary(imageFile);
        }

        const playlist = new Playlist({
            playlistTitle,
            playlistImgUrl,
        });

        await playlist.save();
        
        
        await User.findByIdAndUpdate(user._id, {
            $push: { playlists: playlist._id }
        });

        res.status(201).json(playlist);
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(400).json({ 
            message: 'Error creating playlist', 
            error: error.message 
        });
    }
};

// Update playlist cover image
export const updatePlaylistCover = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const playlistImgUrl = await uploadToCloudinary(req.file);
        
        const playlist = await Playlist.findByIdAndUpdate(
            id,
            { playlistImgUrl },
            { new: true }
        );

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.json(playlist);
    } catch (error) {
        console.error("Error updating playlist cover:", error);
        res.status(500).json({ 
            message: 'Error updating playlist cover', 
            error: error.message 
        });
    }
};

// Get all playlists for a user
export const getUserPlaylists = async (req, res) => {
    try {
        const currentUser = await User.findOne({ clerkId: req.auth.userId });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const userId = currentUser._id;
        
        const user = await User.findById(userId).populate({
            path: 'playlists',
            populate: {
                path: 'playlistSongs',
                model: 'Song'
            }
        });
        
        res.json(user.playlists);
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        res.status(500).json({ 
            message: 'Error fetching playlists', 
            error: error.message 
        });
    }
};

// Get a single playlist by ID
export const getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id)
            .populate({
                path: 'playlistSongs',
                populate: [
                    {
                        path: 'songAuthor',
                        select: '_id name', // Автор пісні у форматі {_id, name}
                        model: 'Author'
                    },
                    {
                        path: 'albumId',
                        select: '_id albumTitle', // Альбом у форматі {_id, albumTitle}
                        model: 'Album',
                        populate: {
                            path: 'albumAuthor',
                            select: '_id name', // Автор альбому у форматі {_id, name}
                            model: 'Author'
                        }
                    }
                ]
            });

        

        res.json(playlist);
    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(500).json({ 
            message: 'Error fetching playlist', 
            error: error.message 
        });
    }
};

// Add song to playlist
export const addSongToPlaylist = async (req, res) => {
    try {
        const { songId } = req.body;
        
        const playlist = await Playlist.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { playlistSongs: songId } },
            { new: true }
        ).populate('playlistSongs');
        
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        
        res.json(playlist);
    } catch (error) {
        console.error("Error adding song to playlist:", error);
        res.status(400).json({ 
            message: 'Error adding song to playlist', 
            error: error.message 
        });
    }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (req, res) => {
    try {
        const { songId } = req.body;
        
        const playlist = await Playlist.findByIdAndUpdate(
            req.params.id,
            { $pull: { playlistSongs: songId } },
            { new: true }
        ).populate('playlistSongs');
        
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        
        res.json(playlist);
    } catch (error) {
        console.error("Error removing song from playlist:", error);
        res.status(400).json({ 
            message: 'Error removing song from playlist', 
            error: error.message 
        });
    }
};

// Delete playlist
export const deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findByIdAndDelete(req.params.id);
        
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        
        const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
        await User.findByIdAndUpdate(user._id, {
            $pull: { playlists: playlist._id }
        });

        res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        console.error("Error deleting playlist:", error);
        res.status(500).json({ 
            message: 'Error deleting playlist', 
            error: error.message 
        });
    }
};

export default {
    createPlaylist,
    updatePlaylistCover,
    getUserPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist
};
