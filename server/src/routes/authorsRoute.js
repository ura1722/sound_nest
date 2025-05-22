import {Router} from "express"
import { getAuthorById, getAuthors } from "../controller/authorController.js";


const router = Router()

router.get("/", getAuthors);
router.get("/:id", getAuthorById);

export default router
