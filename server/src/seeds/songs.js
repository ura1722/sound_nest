import mongoose from "mongoose";
import { Song } from "../models/songModel.js";
import { config } from "dotenv";

config();

const songs = [
    {
        songsongTitle: "Stay With Me",
        songAuthor: "Sarah Mitchell",
        songImgUrl: "/cover-images/1.jpg",
        songsongAudioUrl: "/songs/1.mp3",
        songsongDuration: 46, // 0:46
    },
    {
        songsongTitle: "Midnight Drive",
        songAuthor: "The Wanderers",
        songImgUrl: "/cover-images/2.jpg",
        songsongAudioUrl: "/songs/2.mp3",
        songsongDuration: 41, // 0:41
    },
    {
        songsongTitle: "Lost in Tokyo",
        songAuthor: "Electric Dreams",
        songImgUrl: "/cover-images/3.jpg",
        songsongAudioUrl: "/songs/3.mp3",
        songsongDuration: 24, // 0:24
    },
    {
        songsongTitle: "Summer Daze",
        songAuthor: "Coastal Kids",
        songImgUrl: "/cover-images/4.jpg",
        songsongAudioUrl: "/songs/4.mp3",
        songsongDuration: 24, // 0:24
    },
    {
        songsongTitle: "Neon Lights",
        songAuthor: "Night Runners",
        songImgUrl: "/cover-images/5.jpg",
        songsongAudioUrl: "/songs/5.mp3",
        songsongDuration: 36, // 0:36
    },
    {
        songsongTitle: "Mountain High",
        songAuthor: "The Wild Ones",
        songImgUrl: "/cover-images/6.jpg",
        songsongAudioUrl: "/songs/6.mp3",
        songsongDuration: 40, // 0:40
    },
    {
        songsongTitle: "City Rain",
        songAuthor: "Urban Echo",
        songImgUrl: "/cover-images/7.jpg",
        songsongAudioUrl: "/songs/7.mp3",
        songsongDuration: 39, // 0:39
    },
    {
        songsongTitle: "Desert Wind",
        songAuthor: "Sahara Sons",
        songImgUrl: "/cover-images/8.jpg",
        songsongAudioUrl: "/songs/8.mp3",
        songsongDuration: 28, // 0:28
    },
    {
        songsongTitle: "Ocean Waves",
        songAuthor: "Coastal Drift",
        songImgUrl: "/cover-images/9.jpg",
        songsongAudioUrl: "/songs/9.mp3",
        songsongDuration: 28, // 0:28
    },
    {
        songsongTitle: "Starlight",
        songAuthor: "Luna Bay",
        songImgUrl: "/cover-images/10.jpg",
        songsongAudioUrl: "/songs/10.mp3",
        songsongDuration: 30, // 0:30
    },
    {
        songsongTitle: "Winter Dreams",
        songAuthor: "Arctic Pulse",
        songImgUrl: "/cover-images/11.jpg",
        songsongAudioUrl: "/songs/11.mp3",
        songsongDuration: 29, // 0:29
    },
    {
        songsongTitle: "Purple Sunset",
        songAuthor: "Dream Valley",
        songImgUrl: "/cover-images/12.jpg",
        songsongAudioUrl: "/songs/12.mp3",
        songsongDuration: 17, // 0:17
    },
    {
        songsongTitle: "Neon Dreams",
        songAuthor: "Cyber Pulse",
        songImgUrl: "/cover-images/13.jpg",
        songsongAudioUrl: "/songs/13.mp3",
        songsongDuration: 39, // 0:39
    },
    {
        songsongTitle: "Moonlight Dance",
        songAuthor: "Silver Shadows",
        songImgUrl: "/cover-images/14.jpg",
        songsongAudioUrl: "/songs/14.mp3",
        songsongDuration: 27, // 0:27
    },
    {
        songsongTitle: "Urban Jungle",
        songAuthor: "City Lights",
        songImgUrl: "/cover-images/15.jpg",
        songsongAudioUrl: "/songs/15.mp3",
        songsongDuration: 36, // 0:36
    },
    {
        songsongTitle: "Crystal Rain",
        songAuthor: "Echo Valley",
        songImgUrl: "/cover-images/16.jpg",
        songsongAudioUrl: "/songs/16.mp3",
        songsongDuration: 39, // 0:39
    },
    {
        songsongTitle: "Neon Tokyo",
        songAuthor: "Future Pulse",
        songImgUrl: "/cover-images/17.jpg",
        songsongAudioUrl: "/songs/17.mp3",
        songsongDuration: 39, // 0:39
    },
    {
        songsongTitle: "Midnight Blues",
        songAuthor: "Jazz Cats",
        songImgUrl: "/cover-images/18.jpg",
        songsongAudioUrl: "/songs/18.mp3",
        songsongDuration: 29, // 0:29
    },
];

const seedSongs = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);

        // Clear existing songs
        await Song.deleteMany({});

        // Insert new songs
        await Song.insertMany(songs);

        console.log("Songs seeded successfully!");
    } catch (error) {
        console.error("Error seeding songs:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedSongs();
