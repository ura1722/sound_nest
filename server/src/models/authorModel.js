import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  
  genres: {
    type: [String],
    default: [],
    required: true
  },
  moods: {
    type: [String], 
    default: []
  },
  decades: {
    type: [String],
    default: []
  }

}, { timestamps: true });

export const Author = mongoose.model("Author", authorSchema);
