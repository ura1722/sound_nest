import {Router} from "express"
import { getSongs, getFeaturedSongs, getRecommendedSongs, getTrendingSongs } from "../controller/songController.js"
import { ifAdmin, protectRoute } from "../middleware/authMiddlware.js"

const router = Router()

router.get('/', protectRoute, ifAdmin, getSongs)
router.get('/featured', getFeaturedSongs)
router.get('/recommended', getRecommendedSongs)
router.get('/trending', getTrendingSongs)

export default router
