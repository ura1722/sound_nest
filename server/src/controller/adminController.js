import { Album } from "../models/albumModel.js";
import { Song } from "../models/songModel.js";
import cloudinary from "../lib/cloudinary.js";

const uploadCloudinary = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
		});
		return result.secure_url;
	} catch (error) {
		console.log("Error in uploadCloudinary", error);
		throw new Error("Error uploading to cloudinary");
	}
};

export const adminCheck = async (req, res, next) => {
	res.status(200).json({ isAdmin: true });
};

export const createSong = async (req, res, next) =>{

    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({message:"Upload files"})
        }
        const { songTitle, songAuthor, albumId, songDuration } = req.body;
        const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

        const songAudioUrl = await uploadCloudinary(audioFile);
		const songImgUrl = await uploadCloudinary(imageFile);
        
        const song = new Song({
			songTitle,
			songAuthor,
			songAudioUrl,
			songImgUrl,
			songDuration,
			albumId: albumId || null,
		});
        await song.save()

        if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { albumSongs: song._id },
			});
		}
        res.status(201).json(albumId);
    } catch (error) {
        console.log("Error while creating song", error);
		next(error);
    }
}
export const deleteSong = async (req, res, next) =>{

    try {
		const { id } = req.params;

		const song = await Song.findById(id);

		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { albumSongs: song._id },
			});
		}

		await Song.findByIdAndDelete(id);

		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		console.log("Error while deleting song", error);
		next(error);
	}
}

export const createAlbum = async (req, res, next) =>{
	try {
		const { albumTitle, albumAuthor, albumRelease } = req.body;
		const { imageFile } = req.files;

		const albumImgUrl = await uploadCloudinary(imageFile);

		const album = new Album({
			albumTitle,
			albumAuthor,
			albumImgUrl,
			albumRelease,
		});

		await album.save();

		res.status(201).json({ message: "Album created successfully", album });
	} catch (error) {
		console.log("Error while creating album", error);
		next(error);
	}
    
}
export const deleteAlbum = async (req, res, next) =>{
	try {

		const { id } = req.params;
		
		await Song.deleteMany({ albumId: id });
		await Album.findByIdAndDelete(id);

		res.status(200).json({ message: "Album deleted successfully" });

	} catch (error) {
		console.log("Error while deleting album", error);
		next(error);
	}
    
}
