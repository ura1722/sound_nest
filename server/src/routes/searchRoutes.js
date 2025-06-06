import {Router} from "express"



import { getSearchResults } from "../controller/searchController.js";

const router = Router();

router.get('/', getSearchResults);


export default router
