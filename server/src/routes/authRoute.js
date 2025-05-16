import {Router} from "express"

import { callbackAuth } from "../controller/authController.js"

const router = Router()

router.post('/callback', callbackAuth)

export default router
