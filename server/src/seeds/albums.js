import mongoose from "mongoose";
import { Song } from "../models/songModel.js";
import { Album } from "../models/albumModel.js";
import { config } from "dotenv";

config();

const seedDatabase = async () => {
	try {
		await mongoose.connect(process.env.DB_URI);

		// Clear existing data
		await Album.deleteMany({});
		await Song.deleteMany({});

		// First, create all songs
		const createdSongs = await Song.insertMany([
			{
				songTitle: "City Rain",
				songAuthor: "Urban Echo",
				songImgUrl: "/cover-images/7.jpg",
				songAudioUrl: "/songs/7.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 39, // 0:39
			},
			{
				songTitle: "Neon Lights",
				songAuthor: "Night Runners",
				songImgUrl: "/cover-images/5.jpg",
				songAudioUrl: "/songs/5.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 36, // 0:36
			},
			{
				songTitle: "Urban Jungle",
				songAuthor: "City Lights",
				songImgUrl: "/cover-images/15.jpg",
				songAudioUrl: "/songs/15.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 36, // 0:36
			},
			{
				songTitle: "Neon Dreams",
				songAuthor: "Cyber Pulse",
				songImgUrl: "/cover-images/13.jpg",
				songAudioUrl: "/songs/13.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 39, // 0:39
			},
			{
				songTitle: "Summer Daze",
				songAuthor: "Coastal Kids",
				songImgUrl: "/cover-images/4.jpg",
				songAudioUrl: "/songs/4.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 24, // 0:24
			},
			{
				songTitle: "Ocean Waves",
				songAuthor: "Coastal Drift",
				songImgUrl: "/cover-images/9.jpg",
				songAudioUrl: "/songs/9.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 28, // 0:28
			},
			{
				songTitle: "Crystal Rain",
				songAuthor: "Echo Valley",
				songImgUrl: "/cover-images/16.jpg",
				songAudioUrl: "/songs/16.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 39, // 0:39
			},
			{
				songTitle: "Starlight",
				songAuthor: "Luna Bay",
				songImgUrl: "/cover-images/10.jpg",
				songAudioUrl: "/songs/10.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 30, // 0:30
			},
			{
				songTitle: "Stay With Me",
				songAuthor: "Sarah Mitchell",
				songImgUrl: "/cover-images/1.jpg",
				songAudioUrl: "/songs/1.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 46, // 0:46
			},
			{
				songTitle: "Midnight Drive",
				songAuthor: "The Wanderers",
				songImgUrl: "/cover-images/2.jpg",
				songAudioUrl: "/songs/2.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 41, // 0:41
			},
			{
				songTitle: "Moonlight Dance",
				songAuthor: "Silver Shadows",
				songImgUrl: "/cover-images/14.jpg",
				songAudioUrl: "/songs/14.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 27, // 0:27
			},
			{
				songTitle: "Lost in Tokyo",
				songAuthor: "Electric Dreams",
				songImgUrl: "/cover-images/3.jpg",
				songAudioUrl: "/songs/3.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 24, // 0:24
			},
			{
				songTitle: "Neon Tokyo",
				songAuthor: "Future Pulse",
				songImgUrl: "/cover-images/17.jpg",
				songAudioUrl: "/songs/17.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 39, // 0:39
			},
			{
				songTitle: "Purple Sunset",
				songAuthor: "Dream Valley",
				songImgUrl: "/cover-images/12.jpg",
				songAudioUrl: "/songs/12.mp3",
				plays: Math.floor(Math.random() * 5000),
				songDuration: 17, // 0:17
			},
		]);

		// Create albums with references to song IDs
		const albums = [
			{
				albumTitle: "Urban Nights",
				albumAuthor: "Various songAuthors",
				albumImgUrl: "/albums/1.jpg",
				albumRelease: 2024,
				albumSongs: createdSongs.slice(0, 4).map((song) => song._id),
			},
			{
				albumTitle: "Coastal Dreaming",
				albumAuthor: "Various songAuthors",
				albumImgUrl: "/albums/2.jpg",
				albumRelease: 2024,
				albumSongs: createdSongs.slice(4, 8).map((song) => song._id),
			},
			{
				albumTitle: "Midnight Sessions",
				albumAuthor: "Various songAuthors",
				albumImgUrl: "/albums/3.jpg",
				albumRelease: 2024,
				albumSongs: createdSongs.slice(8, 11).map((song) => song._id),
			},
			{
				albumTitle: "Eastern Dreams",
				albumAuthor: "Various songAuthors",
				albumImgUrl: "/albums/4.jpg",
				albumRelease: 2024,
				albumSongs: createdSongs.slice(11, 14).map((song) => song._id),
			},
		];

		// Insert all albums
		const createdAlbums = await Album.insertMany(albums);

		// Update songs with their album references
		for (let i = 0; i < createdAlbums.length; i++) {
			const album = createdAlbums[i];
			const albumSongs = albums[i].songs;

			await Song.updateMany({ _id: { $in: albumSongs } }, { albumId: album._id });
		}

		console.log("Database seeded successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		mongoose.connection.close();
	}
};

seedDatabase();
