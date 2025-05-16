import {Router} from "express"
import { getStatistics } from "../controller/statisticController.js"
import { ifAdmin, protectRoute } from "../middleware/authMiddlware.js"

const router = Router()

router.get('/', protectRoute, ifAdmin, getStatistics)

export default router
