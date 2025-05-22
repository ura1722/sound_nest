import mongoose from "mongoose"

const playlistSchema = new mongoose.Schema({
    playlistTitle: {
        type: String,
        required: true,
    },
    playlistImgUrl: {
        type: String,
        default: "https://res.cloudinary.com/dugumm2jf/image/upload/v1747757213/qcxv8maboaw52v3bsfzx.png"
    },
    playlistSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
    }],
}, { timestamps: true });

export const Playlist = mongoose.model("Playlist", playlistSchema);
