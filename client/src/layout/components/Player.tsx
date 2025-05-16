import { playerStore } from "@/stores/playerStore";
import { useEffect, useRef } from "react";

function Player() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const isPlayingRef = useRef(false);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying, playNext } = playerStore();

	// Track real playback state
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.onplaying = () => (isPlayingRef.current = true);
		audio.onpause = () => (isPlayingRef.current = false);
	}, []);

	// Handle song end
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => {
			playNext();
		};

		audio.addEventListener("ended", handleEnded);
		return () => audio.removeEventListener("ended", handleEnded);
	}, [playNext]);

	// Handle song change
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentSong) return;

		const isSongChanged = prevSongRef.current !== currentSong.songAudioUrl;
		if (isSongChanged) {
			audio.pause(); 
			audio.src = currentSong.songAudioUrl;
			audio.currentTime = 0;
			prevSongRef.current = currentSong.songAudioUrl;

			const handleCanPlay = () => {
				if (isPlaying) {
					audio.play().catch((err) => {
						console.warn("Playback error:", err);
					});
				}
				audio.removeEventListener("canplay", handleCanPlay);
			};

			audio.addEventListener("canplay", handleCanPlay);
		}
	}, [currentSong, isPlaying]);

	// Handle external toggle
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying && audio.paused) {
			audio.play().catch((err) => {
				console.warn("Playback error:", err);
			});
		} else if (!isPlaying && !audio.paused) {
			audio.pause();
		}
	}, [isPlaying]);

	return <audio ref={audioRef} />;
}

export default Player;
