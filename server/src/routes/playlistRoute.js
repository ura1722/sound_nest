import {Router} from "express"

import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist
} from '../controller/playlistController.js';
import { protectRoute } from "../middleware/authMiddlware.js"

const router = Router();

router.post('/', protectRoute, createPlaylist);
router.get('/user-playlists', protectRoute, getUserPlaylists);
router.get('/:id', protectRoute, getPlaylistById);
router.post('/:id/add-song', protectRoute, addSongToPlaylist);
router.post('/:id/remove-song', protectRoute, removeSongFromPlaylist);
router.delete('/:id', protectRoute, deletePlaylist);

export default router
