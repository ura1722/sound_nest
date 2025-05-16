import mongoose from "mongoose"

const albumSchema = new mongoose.Schema({
    albumTitle: {
        type: String,
        required: true
    },
    albumImgUrl: {
        type: String,
        required: true
    },
    albumAuthor: {
        type: String,
        required: true
    },
    albumRelease: {
        type: Number,
        required: true
    },
    
    albumSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',

    }],
},{timestamps: true})

export const Album = mongoose.model("Album", albumSchema)
