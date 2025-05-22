import {Router} from "express"
import {adminCheck, createSong, deleteSong, createAlbum, deleteAlbum, createAuthor, deleteAuthor, updateAuthor} from "../controller/adminController.js"
import { ifAdmin, protectRoute } from "../middleware/authMiddlware.js"

const router = Router()

router.use(protectRoute, ifAdmin);

router.get('/check', adminCheck)

router.post('/songs', createSong)
router.delete("/songs/:id",  deleteSong);

router.post('/albums', createAlbum)
router.delete("/albums/:id", deleteAlbum);

router.post('/create-author', createAuthor)
router.delete("/author-delete/:id", deleteAuthor);

router.put("/authors-update/:id", updateAuthor);

export default router
