import { Song } from "../models/songModel.js";
import { User } from "../models/userModel.js";

export async function buildMatrix() {
  const users = await User.find().populate('likedSongs');
  const allSongs = await Song.find().lean();
  
  // Створюємо мапу song._id -> індекс
  const songIndexMap = {};
  allSongs.forEach((song, index) => {
    songIndexMap[song._id.toString()] = index;
  });

  // Матриця: 1 = лайк, 0 = немає взаємодії
  const likeMatrix = users.map(user => {
    const userVector = new Array(allSongs.length).fill(0);
    user.likedSongs.forEach(song => {
      const songIdx = songIndexMap[song._id.toString()];
      userVector[songIdx] = 1;
    });
    return userVector;
  });

  return { likeMatrix, songIndexMap, allSongs };
}
