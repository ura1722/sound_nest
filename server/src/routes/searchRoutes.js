import {Router} from "express"


import { protectRoute } from "../middleware/authMiddlware.js"
import { getSearchResults } from "../controller/searchController.js";

const router = Router();

router.get('/', protectRoute, getSearchResults);


export default router
