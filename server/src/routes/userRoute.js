import {Router} from "express"
import { protectRoute } from "../middleware/authMiddlware.js"
import { getLikedSongs, getUsers, toggleLikeSong } from "../controller/userController.js"

const router = Router()

router.get('/', protectRoute, getUsers)
router.put("/like", toggleLikeSong);
router.get("/liked-songs", getLikedSongs);


export default router
