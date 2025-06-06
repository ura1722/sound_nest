import { AddToPlaylistDialog } from "@/components/AddToPlaylistDialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { musicStore } from "@/stores/musicStore";
import { playerStore } from "@/stores/playerStore";
import { playlistStore } from "@/stores/playlistStore";
import { CirclePause, Clock, EllipsisVertical, Heart, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Song } from "@/types";
import { useAuthGoogle } from "@/hooks/useAuth";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function AlbumPage() {
  const { id } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading, likedSongs, toggleLikeSong } = musicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = playerStore();
  const { signInGoogle } = useAuthGoogle();
  const { playlists, addSongToPlaylist } = playlistStore();
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (id) fetchAlbumById(id);
  }, [fetchAlbumById, id]);
  useEffect(() => {
  musicStore.getState().fetchLikedSongs();
}, []);
  if (isLoading) return null;

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.albumSongs.some((song) => song._id === currentSong?._id);
    if (isCurrentAlbumPlaying) togglePlay();
    else {
      playAlbum(currentAlbum?.albumSongs, 0);
    }
  };

  const handleLikeSong = async (song: Song) => {
    try {
      const wasLiked = likedSongs.some(likedSong => likedSong._id === song._id);
      await toggleLikeSong(song._id);
      toast.success(wasLiked ? "Song unliked" : "Song liked");
    } catch (error) {
      console.log(error);
      signInGoogle();
    }
  };
  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;
  
    const selectedSong = currentAlbum.albumSongs[index];
  
    if (currentSong?._id === selectedSong._id) {
      togglePlay();
    } else {
      playAlbum(currentAlbum.albumSongs, index);
    }
  };

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSong(song);
    setIsDialogOpen(true);
  };

  return (
    <>
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
                  <p className='text-sm font-medium'>Альбом</p>
                  <h1 className='text-7xl font-bold my-4'>{currentAlbum?.albumTitle}</h1>
                  <div className='flex items-center gap-2 text-sm text-zinc-100'>
                    <span className='font-medium text-white'>{currentAlbum?.albumAuthor?.name}</span>
                    <span>• {currentAlbum?.albumSongs.length} пісень</span>
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
                  className='grid grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-10 py-2 text-sm 
                  text-zinc-400 border-b border-white/5'
                >
                  <div>#</div>
                  <div>Назва</div>
                  <div>Дата релізу</div>
                  <div className="flex items-center">
                    <Clock className='h-4 w-4' />
                  </div>
                  <div></div>
                </div>

                {/* songs list */}
                <div className='px-6'>
                  <div className='space-y-2 py-4'>
                    {currentAlbum?.albumSongs.map((song, index) => {
                      const isCurrentSong = currentSong?._id === song._id;
                      const isLiked = likedSongs.some(likedSong => likedSong._id === song._id);
                      return (
                        <ContextMenu key={song._id}>
                          <ContextMenuTrigger asChild>
                            <div
                              onClick={() => handlePlaySong(index)}
                              className={`grid grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-4 py-2 text-sm 
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
                                  <div className={`font-medium ${isCurrentSong ? "text-orange-400" : "text-white"}`}>
                                    {song.songTitle}
                                  </div>
                                  <div>{song.songAuthor?.name}</div>
                                </div>
                              </div>
                              <div className='flex items-center'>{song.createdAt.split("T")[0]}</div>
                              <div className='flex items-center'>{formatDuration(song.songDuration)}</div>
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeSong(song);
                                  }}
                                  className={`p-1 rounded-full transition-colors ${isLiked ? 'text-red-500' : 'text-white/50 hover:text-white'}`}
                                >
                                  <Heart
                                    size={20} 
                                    fill={isLiked ? 'currentColor' : 'none'} 
                                  />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToPlaylist(song);
                                  }}
                                  className="text-zinc-400 hover:text-white transition-colors"
                                >
                                  <EllipsisVertical className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </ContextMenuTrigger>
                          <ContextMenuContent className="w-60 bg-zinc-900 border-zinc-700">
                            <ContextMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToPlaylist(song);
                              }}
                              className="hover:bg-zinc-800 cursor-pointer"
                            >
                              Додати до списку відтворення
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                        
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      <AddToPlaylistDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        songTitle={selectedSong?.songTitle || ""}
        playlists={playlists}
        onAddToPlaylist={async (playlistId) => {
          if (!selectedSong) return;
          try {
            await addSongToPlaylist(playlistId, selectedSong._id);
            toast.success("Song added to playlist");
            setIsDialogOpen(false);
          } catch (error) {
            console.log(error);
            toast.error("Failed to add song to playlist");
          }
        }}
      />
	  <Toaster />
    </>
  );
}

export default AlbumPage;
