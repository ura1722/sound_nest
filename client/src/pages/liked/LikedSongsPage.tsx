import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { musicStore } from "@/stores/musicStore";
import { playerStore } from "@/stores/playerStore";
import { Song } from "@/types";
import { CirclePause, Heart, HeartOff, Clock, Play, Pause } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function LikedSongsPage() {
  const navigate = useNavigate();
  const { 
    likedSongs, 
    fetchLikedSongs, 
    toggleLikeSong, 
    isLoading,
    
  } = musicStore();
  
  const { 
    currentSong, 
    isPlaying, 
    setCurrentSong, 
    playAlbum, 
    togglePlay 
  } = playerStore();

  
  const likedSongsData = 
    likedSongs
  ;

  useEffect(() => {
    fetchLikedSongs();
  }, [fetchLikedSongs]);

  const handlePlayAll = () => {
    if (likedSongsData.length === 0) return;
    
    const isCurrentPlaying = likedSongsData.some(song => 
      song._id === currentSong?._id
    );
    
    if (isCurrentPlaying) {
      togglePlay();
    } else {
      playAlbum(likedSongsData, 0);
    }
  };

  const handlePlaySong = (song: Song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  const handleToggleLike = async (songId: string) => {
    try {
      await toggleLikeSong(songId);
      
      fetchLikedSongs();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          
          <div className="relative z-10">
            
            <div className="flex p-6 gap-6 pb-8 items-end">
              <div className="w-[240px] h-[240px] bg-gradient-to-br from-purple-600 to-pink-500 shadow-xl rounded flex items-center justify-center">
                <Heart className="w-24 h-24 text-white" />
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Список відтворення</p>
                <h1 className="text-7xl font-bold my-4">Вподобані</h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">Ваші улюблені</span>
                  <span>• {likedSongsData.length} songs</span>
                </div>
              </div>
            </div>

            
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAll}
                size="icon"
                className="w-14 h-14 rounded-full bg-orange-400 hover:bg-orange-300 hover:scale-105 transition-all"
                disabled={likedSongsData.length === 0}
              >
                {isPlaying && likedSongsData.some(song => song._id === currentSong?._id) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
            </div>

            
            <div className="bg-black/20 backdrop-blur-sm">
              
              <div className="grid grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Назва</div>
                <div>Альбом</div>
                
                <div className="flex items-center justify-end">
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              
              <div className="px-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
                  </div>
                ) : likedSongsData.length === 0 ? (
                  <div className="text-center py-12 text-zinc-400">
                    Нема вподобань
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    {likedSongsData.map((song, index) => {
                      const isCurrent = currentSong?._id === song._id;
                      const isPlayingCurrent = isCurrent && isPlaying;

                      return (
                        <div
                          key={song._id}
                          className="grid grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                        >
                          
                          <div 
                            className="flex items-center justify-center"
                            onClick={() => handlePlaySong(song)}
                          >
                            {isPlayingCurrent ? (
                              <>
                                <div className="text-orange-400 group-hover:hidden">♫</div>
                                <CirclePause className="h-6 w-6 text-orange-400 hidden group-hover:block absolute" />
                              </>
                            ) : (
                              <>
                                <span className="group-hover:hidden">{index + 1}</span>
                                <Play className="h-4 w-4 hidden group-hover:block" />
                              </>
                            )}
                          </div>

                          
                          <div 
                            className="flex items-center gap-3"
                            onClick={() => handlePlaySong(song)}
                          >
                            <img 
                              src={song.songImgUrl} 
                              alt={song.songTitle} 
                              className="size-10 rounded" 
                            />
                            <div>
                              <div className={`font-medium ${isCurrent ? "text-orange-400" : "text-white"}`}>
                                {song.songTitle}
                              </div>
                              <div>{song.songAuthor?.name || 'Unknown artist'}</div>
                            </div>
                          </div>

                          <div 
                            className="flex items-center"
                            onClick={() => song.albumId && navigate(`/albums/${song.albumId._id}`)}
                          >
                            {song.albumId ? (
                              <Link 
                                to={`/albums/${song.albumId._id}`} 
                                className="hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {song.albumId.albumTitle}
                              </Link>
                            ) : (
                              <Link 
                                to={`/authors/${song.songAuthor?._id}`} 
                                className="hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Сингл
                              </Link>
                            )}
                          </div>

                          

                          
                          <div className="flex items-center justify-end gap-4">
                            <span>{formatDuration(song.songDuration)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-red-500 hover:bg-white/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleLike(song._id);
                              }}
                            >
                              <HeartOff className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
