import {Router} from "express"
import { protectRoute } from "../middleware/authMiddlware.js"
import { getLikedSongs, getUsers, toggleLikeSong, addAuthors, updatePlaybackStats, getMessages, getUserFriends, addFriend, removeFriend, getUser } from "../controller/userController.js"


const router = Router()

router.get('/', protectRoute, getUsers)
router.get('/me', protectRoute, getUser)
router.get('/friends', protectRoute, getUserFriends)
router.post('/add-friend', protectRoute, addFriend)
router.delete('/delete-friend/:id', protectRoute, removeFriend)
router.put("/like", protectRoute, toggleLikeSong);
router.get("/liked-songs", protectRoute, getLikedSongs);
router.post("/add-authors", protectRoute, addAuthors);
router.post("/playback", protectRoute, updatePlaybackStats);
router.get("/messages/:userId", protectRoute, getMessages);



export default router
