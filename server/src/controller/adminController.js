import { Album } from "../models/albumModel.js";
import { Song } from "../models/songModel.js";
import cloudinary from "../lib/cloudinary.js";
import { Author } from "../models/authorModel.js";

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
        const { songTitle, songAuthor, albumId, songDuration, genres, moods, decade } = req.body;
        const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

        const songAudioUrl = await uploadCloudinary(audioFile);
		const songImgUrl = await uploadCloudinary(imageFile);
		let genresArray = genres
		let moodsArray = moods
		try{
			genresArray = Array.isArray(genres) 
      ? genres 
      : JSON.parse(genres || '[]');
		}catch{
			 genresArray = genres
		}
		
		try{
	 moodsArray = Array.isArray(moods) 
	  ? moods 
	  : JSON.parse(moods || '[]');
		}catch{
			moodsArray = moods
		}
        
        const song = new Song({
			songTitle,
			songAuthor,
			genres: genresArray,
      		moods: moodsArray,
			songAudioUrl,
			decade: decade,
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
		const { albumTitle, albumAuthor, albumRelease, genres, moods, decade } = req.body;
		const { imageFile } = req.files;

		const albumImgUrl = await uploadCloudinary(imageFile);

		let genresArray = genres
		let moodsArray = moods
		try{
			genresArray = Array.isArray(genres) 
      ? genres 
      : JSON.parse(genres || '[]');
		}catch{
			 genresArray = genres
		}
		
		try{
	 moodsArray = Array.isArray(moods) 
	  ? moods 
	  : JSON.parse(moods || '[]');
		}catch{
			moodsArray = moods
		}

		const album = new Album({
			albumTitle,
			albumAuthor,
			albumImgUrl,
			genres: genresArray,
      		moods: moodsArray,
			decade: decade,
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
export const createAuthor = async (req, res, next) => {
    try {
        const { name, genres, moods, decades } = req.body;
    
    const { imageFile } = req.files;

	const imageUrl = await uploadCloudinary(imageFile);

		let genresArray = genres
		let moodsArray = moods
		let decadesArray =	decades
		try{
			genresArray = Array.isArray(genres) 
      ? genres 
      : JSON.parse(genres || '[]');
		}catch{
			 genresArray = genres
		}
		
		try{
	 moodsArray = Array.isArray(moods) 
	  ? moods 
	  : JSON.parse(moods || '[]');
		}catch{
			moodsArray = moods
		}

		try{
	decadesArray = Array.isArray(decades) 
	  ? decades 
	  : JSON.parse(decades || '[]');}catch{
		  decadesArray = decades
	  }

    const newAuthor = new Author({
      name,
      imageUrl,
      genres: genresArray,
      moods: moodsArray,
      decades: decadesArray
    });

    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
    } catch (error) {
        next(error);
    }
};
export const updateAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, genres, moods, decades } = req.body;
        let imageUrl = null;

        if (req.files && req.files.imageFile) {
            imageUrl = await uploadCloudinary(req.files.imageFile);
        }

        let genresArray = genres;
        let moodsArray = moods;
        let decadesArray = decades;

        try {
            genresArray = Array.isArray(genres) ? genres : JSON.parse(genres || '[]');
        } catch {
            genresArray = genres;
        }

        try {
            moodsArray = Array.isArray(moods) ? moods : JSON.parse(moods || '[]');
        } catch {
            moodsArray = moods;
        }

        try {
            decadesArray = Array.isArray(decades) ? decades : JSON.parse(decades || '[]');
        } catch {
            decadesArray = decades;
        }

        const updateData = {
            name,
            genres: genresArray,
            moods: moodsArray,
            decades: decadesArray
        };

        if (imageUrl) {
            updateData.imageUrl = imageUrl;
        }

        const updatedAuthor = await Author.findByIdAndUpdate(
            id,
            updateData,
            { new: true } 
        );

        if (!updatedAuthor) {
            return res.status(404).json({ message: "Author not found" });
        }

        res.status(200).json({
            message: "Author updated successfully",
            author: updatedAuthor
        });
    } catch (error) {
        console.log("Error while updating author:", error);
        next(error);
    }
};
export const deleteAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;

    await Song.deleteMany({ songAuthor: id })

    await Album.deleteMany({ albumAuthor: id })

    await Author.findByIdAndDelete(id);

    res.json({ message: "Author deleted successfully" });
    } catch (error) {
        next(error);
    }
};
