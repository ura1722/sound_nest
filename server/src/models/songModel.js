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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    genres: {
        type: [String],
        default: [],
        required: true
    },
    moods: {
        type: [String], 
        default: [],
        required: true
    },
    songAudioUrl: {
        type: String,
        required: true
    },
    decade: {
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
