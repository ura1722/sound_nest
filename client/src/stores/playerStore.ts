import { create } from "zustand";
import { Song } from "@/types";

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
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
			playedSongs: isShuffle ? [song._id] : [],
		});
	},

	togglePlay: () => {
		const willStartPlaying = !get().isPlaying;
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
		
		const { queue, currentIndex, isShuffle, playedSongs } = get();

		if (isShuffle) {
			
			console.log(playedSongs)
			const unplayedSongs = queue.filter(
				(s) => !playedSongs.includes(s._id)
			);

			if (unplayedSongs.length === 0) {
				set({ isPlaying: false });
				return;
			}

			const nextSong = unplayedSongs[Math.floor(Math.random() * unplayedSongs.length)];
			set({
				currentSong: nextSong,
				isPlaying: true,
				playedSongs: [...playedSongs, nextSong._id],
			});
		} else {
			const nextIndex = currentIndex + 1;
			const nextSong = queue[nextIndex];

			if (nextSong) {
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

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
		} else {
	
			set({ isPlaying: false });

			
		}
	},
	resetPlayed: () => set({ playedSongs: [] }),
}));
