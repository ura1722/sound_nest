import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userImgUrl: {
        type: String,
        required: true
    },
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    }],
    likedSongs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Song' 
  }],
},{timestamps: true})

export const User = mongoose.model("User", userSchema)
