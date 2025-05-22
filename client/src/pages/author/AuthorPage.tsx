import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { musicStore } from "@/stores/musicStore";
import { playerStore } from "@/stores/playerStore";
import { Album, Song } from "@/types";
import { CirclePause, Clock, Disc, Mic2, Pause, Play } from "lucide-react";

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function AuthorPage() {
  const { id } = useParams();
  const { fetchAuthorById, currentAuthor, isLoading } = musicStore();
  const { currentSong, isPlaying, togglePlay, setCurrentSong } = playerStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchAuthorById(id);
  }, [fetchAuthorById, id]);

  if (isLoading) return null;

  // Розділяємо пісні на сингли (без альбому) та пісні з альбомів
  const singles = currentAuthor?.songs?.filter((song: Song) => !song.albumId) || [];
  const albums = currentAuthor?.albums || [];

  

  const handlePlaySong = (song: any) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  const handleAlbum = (albumid: string) => {
    navigate(`/albums/${albumid}`);
    
  };

  return (
    <div className='h-full'>
      <ScrollArea className='h-full rounded-md'>
        {/* Main Content */}
        <div className='relative min-h-full'>
          {/* bg gradient */}
          <div
            className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none'
            aria-hidden='true'
          />

          {/* Content */}
          <div className='relative z-10'>
            <div className='flex p-6 gap-6 pb-8'>
              <img
                src={currentAuthor?.imageUrl}
                alt={currentAuthor?.name}
                className='w-[240px] h-[240px] shadow-xl rounded-full object-cover'
              />
              <div className='flex flex-col justify-end'>
                <p className='text-sm font-medium'>Artist</p>
                <h1 className='text-7xl font-bold my-4'>{currentAuthor?.name}</h1>
                <div className='flex items-center gap-2 text-sm text-zinc-100'>
                  <span>{albums.length} albums</span>
                  <span>• {currentAuthor?.songs?.length || 0} songs</span>
                </div>
              </div>
            </div>

            

            {/* Singles Section */}
            {singles.length > 0 && (
              <div className='bg-black/20 backdrop-blur-sm mb-6'>
                <div className='px-6 py-4'>
                  <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
                    <Mic2 className='h-6 w-6' /> Singles
                  </h2>
                  
                  {/* table header */}
                  <div className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 border-b border-white/5'>
                    <div>#</div>
                    <div>Title</div>
                    <div>Released Date</div>
                    <div className="flex items-center">
                      <Clock className='h-4 w-4' />
                    </div>
                  </div>

                  {/* songs list */}
                  <div className='space-y-2 py-4'>
                    {singles.map((song: Song, index: number) => {
                      const isCurrentSong = currentSong?._id === song._id;
                      return (
                        <div
                          key={song._id}
                          onClick={() => handlePlaySong(song)}
                          className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                            text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                        >
                          <div className='flex items-center justify-center'>
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

                          <div className='flex items-center gap-3'>
                            <img src={song.songImgUrl} alt={song.songTitle} className='size-10 rounded' />
                            <div>
                              <div className={`font-medium ${isCurrentSong ? "text-orange-400" : "text-white"}`}>
                                {song.songTitle}
                              </div>
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
            )}

            {/* Albums Section */}
            {albums.length > 0 && (
              <div className='bg-black/20 backdrop-blur-sm'>
                <div className='px-6 py-4'>
                  <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
                    <Disc className='h-6 w-6' /> Albums
                  </h2>

                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                    {albums.map((album: Album) => (
                      <div 
                        key={album._id} 
                        className='group cursor-pointer'
                        onClick={() => handleAlbum(album._id)}
                      >
                        <div className='relative'>
                          <img
                            src={album.albumImgUrl}
                            alt={album.albumTitle}
                            className='w-full aspect-square rounded shadow-lg group-hover:opacity-80 transition-opacity'
                          />
                          <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                            <Button
                              size='icon'
                              className='w-12 h-12 rounded-full bg-orange-400 hover:bg-orange-300'
                            >
                              {isPlaying && currentSong && album.albumSongs.some(s => s._id === currentSong._id) ? (
                                <Pause className='h-5 w-5 text-black' />
                              ) : (
                                <Play className='h-5 w-5 text-black' />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className='mt-2'>
                          <h3 className='font-medium truncate'>{album.albumTitle}</h3>
                          <p className='text-sm text-zinc-400'>{album.albumRelease}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default AuthorPage;
