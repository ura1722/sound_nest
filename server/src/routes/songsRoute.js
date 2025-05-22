import {Router} from "express"
import { getSongs, getDiscoverSongs, getRecommendedSongs, getFeatureSongs } from "../controller/songController.js"
import { ifAdmin, protectRoute } from "../middleware/authMiddlware.js"

const router = Router()

router.get('/', protectRoute, ifAdmin, getSongs)
router.get('/discover', getDiscoverSongs)
router.get('/recommended', getRecommendedSongs)
router.get('/featured', getFeatureSongs)

export default router
