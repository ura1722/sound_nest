import mongoose from "mongoose"

const preferenceSchema = new mongoose.Schema({
  genres: {
    type: Map,
    of: Number,
    default: {
        "rock": 0.0,
        "pop": 0.0,
        "jazz": 0.0,
        "electronic": 0.0,
        "hiphop": 0.0,
        "classical": 0.0,
        "reggae": 0.0,
        "blues": 0.0,
        "country": 0.0,
        "metal": 0.0,
        "folk": 0.0,
        "rnb": 0.0,
        "latin": 0.0,
        "indie": 0.0,
        "punk": 0.0,
        "alternative": 0.0,
        "dance": 0.0,
        "house": 0.0,
        "techno": 0.0,
        "trance": 0.0,
        "kpop": 0.0,
        "soul": 0.0,
        "funk": 0.0,
        "disco": 0.0,
        "ambient": 0.0
}
  },
  artists: {
    type: Map,
    of: Number,
    default: {}
  },
  decades: {
    type: Map,
    of: Number,
    default: {
      "50s": 0.0,
      "60s": 0.0,
      "70s": 0.0,
      "80s": 0.0,
      "90s": 0.0,
      "00s": 0.0,
      "10s": 0.0,
      "20s": 0.0
    }
  },
  moods: {
    type: Map,
    of: Number,
    default: {
      "energetic": 0.0,
      "relaxed": 0.0,
      "happy": 0.0,
      "sad": 0.0,
      "romantic": 0.0,
      "angry": 0.0,
      "focused": 0.0,
      "nostalgic": 0.0
    }
  }
}, { _id: false });

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
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    likedSongs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Song' 
  }],
  preferences: {
    type: preferenceSchema,
    default: () => ({})
  },
},{timestamps: true})

export const User = mongoose.model("User", userSchema)



