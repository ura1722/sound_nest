import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";

export const getUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const toggleLikeSong = async (req, res, next) => {
  try {
    const { songId } = req.body;
    const currentUserId = req.auth.userId;
    
    // Find the user by clerkId
    const user = await User.findOne({ clerkId: currentUserId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if song is already liked (using toString() for proper comparison)
    const isLiked = user.likedSongs.some(id => id.toString() === songId);

    // Update using atomic operation
    const updateOperation = isLiked 
      ? { $pull: { likedSongs: songId } }
      : { $addToSet: { likedSongs: songId } };

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateOperation,
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: isLiked ? "Song unliked successfully" : "Song liked successfully",
      likedSongs: updatedUser.likedSongs
    });

  } catch (error) {
    next(error);
  }
};
export const getLikedSongs = async (req, res, next) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json({
      likedSongs: user.likedSongs.map(id => id.toString())
    });
  } catch (error) {
    next(error);
  }
};
export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};
