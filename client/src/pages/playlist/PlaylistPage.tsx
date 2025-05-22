import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { musicStore } from "@/stores/musicStore";
import { playerStore } from "@/stores/playerStore";

import { CirclePause, Clock, MoreVertical, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { Song } from "@/types";
import { playlistStore } from "@/stores/playlistStore";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function PlaylistPage() {
  const { id } = useParams();
  const { isLoading } = musicStore();
  const { currentSong, isPlaying, playPlaylist, togglePlay } = playerStore();
  const { currentPlaylist, fetchPlaylistById, removeSongFromPlaylist } = playlistStore();

  useEffect(() => {
    if (id) fetchPlaylistById(id);
  }, [fetchPlaylistById, id]);

  if (isLoading) return null;

  const handlePlayPlaylist = () => {
    if (!currentPlaylist) return;

    const isCurrentPlaylistPlaying = currentPlaylist?.playlistSongs.some(
      (song: Song) => song._id === currentSong?._id
    );
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playPlaylist(currentPlaylist?.playlistSongs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentPlaylist) return;

    const selectedSong = currentPlaylist.playlistSongs[index];
    if (currentSong?._id === selectedSong._id) {
      togglePlay();
    } else {
      playPlaylist(currentPlaylist.playlistSongs, index);
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!id) return;
    try {
      await removeSongFromPlaylist(id, songId);
      toast.success("Song removed from playlist");
    } catch (error) {
        console.log(error);
      toast.error("Failed to remove song");
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
                src={currentPlaylist?.playlistImgUrl || "default_playlist_cover.jpg"}
                alt={currentPlaylist?.playlistTitle}
                className='w-[240px] h-[240px] shadow-xl rounded object-cover'
              />
              <div className='flex flex-col justify-end'>
                <p className='text-sm font-medium'>Playlist</p>
                <h1 className='text-7xl font-bold my-4'>{currentPlaylist?.playlistTitle}</h1>
                <div className='flex items-center gap-2 text-sm text-zinc-100'>
                  
                  <span>• {currentPlaylist?.playlistSongs.length} songs</span>
                </div>
              </div>
            </div>

            {/* play button */}
            <div className='px-6 pb-4 flex items-center gap-6'>
              <Button
                onClick={handlePlayPlaylist}
                size='icon'
                className='w-14 h-14 rounded-full bg-orange-400 hover:bg-orange-300 
                hover:scale-105 transition-all'
              >
                {isPlaying && 
                currentPlaylist?.playlistSongs.some((song: Song) => song._id === currentSong?._id) ? (
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
                <div>Title</div>
                <div>Album</div>
                <div className="flex items-center">
                  <Clock className='h-4 w-4' />
                </div>
                <div></div>
              </div>

              {/* songs list */}
              <div className='px-6'>
                <div className='space-y-2 py-4'>
                  {currentPlaylist?.playlistSongs.map((song: Song, index: number) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-4 py-2 text-sm 
                        text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                      >
                        <div 
                          className='flex items-center justify-center'
                          onClick={() => handlePlaySong(index)}
                        >
                          {isCurrentSong && isPlaying ? (
                            <>
                              <div className='text-orange-400 group-hover:hidden'>♫</div>
                              <CirclePause className='h-6 w-6 text-orange-400 hidden group-hover:block absolute' />
                            </>
                          ) : (
                            <>
                              <span className='group-hover:hidden'>{index + 1}</span>
                              <Play className='h-4 w-4 hidden group-hover:block' />
                            </>
                          )}
                        </div>

                        <div 
                          className='flex items-center gap-3'
                          onClick={() => handlePlaySong(index)}
                        >
                          <img 
                            src={song.songImgUrl} 
                            alt={song.songTitle} 
                            className='size-10 object-cover' 
                          />
                          <div>
                            <div className={`font-medium ${isCurrentSong ? "text-orange-400" : "text-white"}`}>
                              {song.songTitle}
                            </div>
                            <div>{song.songAuthor?.name}</div>
                          </div>
                        </div>
                        
                        <div 
        className='flex items-center'
        onClick={() => handlePlaySong(index)}
      >
        {song.albumId?.albumTitle || 'Single'}
      </div>
                        
                        <div 
                          className='flex items-center'
                          onClick={() => handlePlaySong(index)}
                        >
                          {formatDuration(song.songDuration)}
                        </div>
                        
                        <div className='flex items-center justify-end'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-zinc-700"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40 bg-zinc-900 border-zinc-700">
                              <DropdownMenuItem
                                className="hover:bg-zinc-800 cursor-pointer text-red-400"
                                onClick={() => handleRemoveSong(song._id)}
                              >
                                Remove from playlist
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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

export default PlaylistPage;
