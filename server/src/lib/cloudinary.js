import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARI_API_CLOUD_NAME,
    api_key: process.env.CLOUDINARI_API,
    api_secret: process.env.CLOUDINARI_API_SECRET, 
    secure: true
})

export default cloudinary
