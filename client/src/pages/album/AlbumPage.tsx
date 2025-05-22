import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { musicStore } from "@/stores/musicStore";
import { playerStore } from "@/stores/playerStore";
import { CirclePause, Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";


const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
};
function AlbumPage() {
    const { id } = useParams()
	const { fetchAlbumById, currentAlbum, isLoading } = musicStore()
	const { currentSong, isPlaying, playAlbum, togglePlay } = playerStore()

	useEffect(() => {
		if (id) fetchAlbumById(id)
	}, [fetchAlbumById, id])

	if (isLoading) return null

	const handlePlayAlbum = () => {
		if (!currentAlbum) return

		const isCurrentAlbumPlaying = currentAlbum?.albumSongs.some((song) => song._id === currentSong?._id)
		if (isCurrentAlbumPlaying) togglePlay()
		else {
			
			playAlbum(currentAlbum?.albumSongs, 0)
		}
	};

	const handlePlaySong = (index: number) => {
		if (!currentAlbum) return
	
		const selectedSong = currentAlbum.albumSongs[index]
	
		if (currentSong?._id === selectedSong._id) {
			togglePlay()
		} else {
			playAlbum(currentAlbum.albumSongs, index)
		}
	};

	return (
		<div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				{/* Main Content */}
				<div className='relative min-h-full'>
					{/* bg gradient */}
					<div
						className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none'
						aria-hidden='true'
					/>

					{/* Content */}
					<div className='relative z-10'>
						<div className='flex p-6 gap-6 pb-8'>
							<img
								src={currentAlbum?.albumImgUrl}
								alt={currentAlbum?.albumTitle}
								className='w-[240px] h-[240px] shadow-xl rounded'
							/>
							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium'>Album</p>
								<h1 className='text-7xl font-bold my-4'>{currentAlbum?.albumTitle}</h1>
								<div className='flex items-center gap-2 text-sm text-zinc-100'>
									<span className='font-medium text-white'>{currentAlbum?.albumAuthor?.name}</span>
									<span>• {currentAlbum?.albumSongs.length} songs</span>
									<span>• {currentAlbum?.albumRelease}</span>
								</div>
							</div>
						</div>

						{/* play button */}
						<div className='px-6 pb-4 flex items-center gap-6'>
							<Button
								onClick={handlePlayAlbum}
								size='icon'
								className='w-14 h-14 rounded-full bg-orange-400 hover:bg-orange-300 
                hover:scale-105 transition-all'
							>
								{isPlaying && currentAlbum?.albumSongs.some((song) => song._id === currentSong?._id) ? (
									<Pause className='h-7 w-7 text-black' />
								) : (
									<Play className='h-7 w-7 text-black' />
								)}
							</Button>
						</div>

						{/* Table Section */}
						<div className='bg-black/20 backdrop-blur-sm'>
							{/* table header */}
							<div
								className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5'
							>
								<div>#</div>
								<div>Title</div>
								<div>Released Date</div>
								<div className="flex items-center">
									<Clock className='h-4 w-4' />
								</div>
							</div>

							{/* songs list */}

							<div className='px-6'>
								<div className='space-y-2 py-4'>
									{currentAlbum?.albumSongs.map((song, index) => {
										const isCurrentSong = currentSong?._id === song._id;
										return (
											<div
												key={song._id}
												onClick={() => handlePlaySong(index)}
												className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                      `}
											>
												<div className='flex items-center justify-center'>
													{isCurrentSong && isPlaying ? (
														<>
														<div className='text-orange-400 group-hover:hidden'>♫</div>
												  
														<CirclePause className='h-6 w-6 text-orange-400 hidden group-hover:block absolute' />
													  </>
													) : (
														<span className='group-hover:hidden'>{index + 1}</span>
													)}
													{isCurrentSong && isPlaying ? (
														<></>
													): (
														<Play className='h-4 w-4 hidden group-hover:block' />
													)}
													
												</div>

												<div className='flex items-center gap-3'>
													<img src={song.songImgUrl} alt={song.songTitle} className='size-10' />

													<div>
														<div className={`font-medium ${isCurrentSong ? "text-orange-400" : "text-white"}`}>{song.songTitle}</div>
														<div>{song.songAuthor?.name}</div>
													</div>
												</div>
												<div className='flex items-center'>{song.createdAt.split("T")[0]}</div>
												<div className='flex items-center'>{formatDuration(song.songDuration)}</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}

export default AlbumPage
