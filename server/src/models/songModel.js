import mongoose from "mongoose"

const songSchema = new mongoose.Schema({
    songTitle: {
        type: String,
        required: true
    },
    songImgUrl: {
        type: String,
        required: true
    },
    songAuthor: {
        type: String,
        required: true
    },
    songAudioUrl: {
        type: String,
        required: true
    },
    songDuration: {
        type: Number,
        required: true
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: false,

    }
},{timestamps: true})

export const Song = mongoose.model("Song", songSchema)
