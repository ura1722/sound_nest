import {Router} from "express"
import { getSongs, getDiscoverSongs, getRecommendedSongs, getFeatureSongs, addToRecentlyPlayed, getRecentlyPlayed, getFriendsRecentlyPlayed } from "../controller/songController.js"
import { ifAdmin, protectRoute } from "../middleware/authMiddlware.js"

const router = Router()

router.get('/', protectRoute, ifAdmin, getSongs)
router.get('/discover', getDiscoverSongs)
router.get('/recommended', getRecommendedSongs)
router.get('/featured', getFeatureSongs)
router.post('/:songId/listen', addToRecentlyPlayed);
router.get('/recently-played', getRecentlyPlayed);
router.get('/friends-recently-played', getFriendsRecentlyPlayed);

export default router
