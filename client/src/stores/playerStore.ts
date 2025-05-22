import { create } from "zustand";
import { Song } from "@/types";
import { axiosInstance } from "@/lib/axios";
import { chatStore } from "./chatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	isShuffle: boolean;
	queue: Song[];
	playedSongs: string[];
	currentIndex: number;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	playPlaylist: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	toggleShuffle: () => void;
	playNext: () => void;
	playPrevious: () => void;
	resetPlayed: () => void;
}

export const playerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	isShuffle: false,
	queue: [],
	playedSongs: [],
	currentIndex: -1,

	initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];
		const { isShuffle } = get();

		const socket = chatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `${song.songTitle} by ${song.songAuthor?.name}`,
			});
		}

	set({
		queue: songs,
		currentSong: song,
		currentIndex: startIndex,
		isPlaying: true,
		
		playedSongs: isShuffle ? [song._id] : [],
	});
	},
	playPlaylist: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];
		const { isShuffle } = get();

		const socket = chatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `${song.songTitle} by ${song.songAuthor?.name}`,
			});
		}

	set({
		queue: songs,
		currentSong: song,
		currentIndex: startIndex,
		isPlaying: true,
		
		playedSongs: isShuffle ? [song._id] : [],
	});
	},

	setCurrentSong: (song: Song | null) => {
		if (!song) return;

		const songIndex = get().queue.findIndex((s) => s._id === song._id);
		const { isShuffle } = get();

		const socket = chatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `${song.songTitle} by ${song.songAuthor?.name}`,
			});
		}
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
			playedSongs: isShuffle ? [song._id] : [],
		});
	},

	togglePlay: () => {
		const currentSong = get().currentSong;
		const willStartPlaying = !get().isPlaying;

		const socket = chatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity:
					willStartPlaying && currentSong ? `${currentSong.songTitle} by ${currentSong.songAuthor?.name}` : "Idle",
			});
		}
		set({
			isPlaying: willStartPlaying,
		});
	},
	toggleShuffle: () => {
	const { isShuffle, currentSong } = get();
		
	set({
		isShuffle: !isShuffle,
		playedSongs:  currentSong ? [currentSong._id] : [],
	});
},
	
	playNext: () => {
		
		const { queue, currentIndex, isShuffle, playedSongs, currentSong } = get();

		if (currentSong) {
    		const audio = document.querySelector("audio");
    		if (audio) {
      			const playedPercentage = (audio.currentTime / audio.duration) * 100;
      			updateSongPlaybackStats(currentSong._id, playedPercentage < 80);
				
    		}
  		}

		if (isShuffle) {
			
			console.log(playedSongs)
			const unplayedSongs = queue.filter(
				(s) => !playedSongs.includes(s._id)
			);

			if (unplayedSongs.length === 0) {
				const socket = chatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Idle`,
				});
			}
				set({ isPlaying: false });
				return;
			}

			const nextSong = unplayedSongs[Math.floor(Math.random() * unplayedSongs.length)];
			set({
				currentSong: nextSong,
				isPlaying: true,
				playedSongs: [...playedSongs, nextSong._id],
			});
		const socket = chatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `${nextSong.songTitle} by ${nextSong.songAuthor?.name}`,
			});
		}
		} else {
			const nextIndex = currentIndex + 1;
			const nextSong = queue[nextIndex];

			
			if (nextSong) {
				const socket = chatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `${nextSong.songTitle} by ${nextSong.songAuthor?.name}`,
			});
		}
				set({ 
					currentSong: nextSong, 
					isPlaying: true,
					currentIndex: nextIndex, });
			}
		}
	},
	playPrevious: () => {
		const { currentIndex, queue } = get();
		const prevIndex = currentIndex - 1;

		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];
			const socket = chatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `${prevSong.songTitle} by ${prevSong.songAuthor?.name}`,
			});
		}
			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
		} else {
	
			set({ isPlaying: false });
			const socket = chatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Idle`,
				});
			}

			
		}
	},
	resetPlayed: () => set({ playedSongs: [] }),
}));

export const updateSongPlaybackStats =  async (songId: string, skipped: boolean) => {
  try {
    const response = await axiosInstance.post("/users/playback", {
      songId,
      skipped
    });
    console.log("Playback stats updated:", response.data);
  } catch (error) {
    console.error("Error updating playback stats:", error);
  }
}
