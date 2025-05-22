import express from "express"
import dotenv from "dotenv"
import path from "path"
import fileupload from "express-fileupload"
import { clerkMiddleware } from '@clerk/express'
import userRoutes from "./routes/userRoute.js"
import adminRoutes from "./routes/adminRoute.js"
import authRoutes from "./routes/authRoute.js"
import authorsRoutes from "./routes/authorsRoute.js"
import songsRoutes from "./routes/songsRoute.js"
import statisticRoutes from "./routes/statisticRoute.js"
import albumsRoutes from "./routes/albumsRoute.js"
import searchRoutes from "./routes/searchRoutes.js"
import playlistRoutes from "./routes/playlistRoute.js"
import { initializeSocket } from "./lib/socket.js";
import { createServer } from "http"
import cors from "cors"
import fs from "fs"
import cron from "node-cron";

import { connDB } from "./lib/db.js"

dotenv.config()

const app = express()
const __dirname = path.resolve()

const PORT = process.env.PORT

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors(
    {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
))

app.use(express.json())
app.use(clerkMiddleware())
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits:{
        fieldSize: 10 * 1024 * 1024
    }
}))

const tempDir = path.join(process.cwd(), "temp");
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/statistic", statisticRoutes)
app.use("/api/songs", songsRoutes)
app.use("/api/albums", albumsRoutes)
app.use("/api/playlists", playlistRoutes)
app.use("/api/authors", authorsRoutes)
app.use("/api/search", searchRoutes)

if (process.env.MODE === "production") {
	app.use(express.static(path.join(__dirname, "../client/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
	});
}

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
})

httpServer.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
    connDB()
})
