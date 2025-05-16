import { playerStore } from "@/stores/playerStore";
import { Song } from "@/types";
import { Button } from "./ui/button";
import { Pause, Play } from "lucide-react";

function PlayButton({song}: {song: Song}) {
    const { currentSong, isPlaying, setCurrentSong, togglePlay } = playerStore();
	const isCurrentSong = currentSong?._id === song._id;

	const handlePlay = () => {
		if (isCurrentSong) togglePlay();
		else setCurrentSong(song);
	};

	return (
		<Button
			size={"icon"}
			onClick={handlePlay}
			className={`absolute bottom-3 right-2 bg-orange-400 hover:bg-orange-300 hover:scale-105 transition-all rounded-full
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
					isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				}`}
		>
			{isCurrentSong && isPlaying ? (
				<Pause className='size-5 text-black' />
			) : (
				<Play className='size-5 text-black' />
			)}
		</Button>
	);
}

export default PlayButton
