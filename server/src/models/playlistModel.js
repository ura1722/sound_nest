import mongoose from "mongoose"

const playlistSchema = new mongoose.Schema({
    playlistTitle: {
        type: String,
        required: true,
    },
    playlistImgUrl: {
        type: String,
        default: "default_playlist_cover.jpg"
    },
    playlistSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
    }],
}, { timestamps: true });

export const Playlist = mongoose.model("Playlist", playlistSchema);
