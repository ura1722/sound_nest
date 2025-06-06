import PlayButton from "@/components/PlayButton";

import { musicStore } from "@/stores/musicStore";
import { playerStore } from "@/stores/playerStore";

import { Song } from "@/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import { Heart } from "lucide-react";
import DiscoverGridTemplate from "@/components/templates/DiscoverGridTemplate";
import { AddToPlaylistDialog } from "@/components/AddToPlaylistDialog";
import { playlistStore } from "@/stores/playlistStore";
import { useNavigate } from "react-router-dom";
import { useAuthGoogle } from "@/hooks/useAuth";

function DiscoverGrid() {
  const { isLoading, discoverSongs, error, likedSongs, toggleLikeSong } = musicStore();
  const { currentSong } = playerStore();
  const { playlists, addSongToPlaylist } = playlistStore();
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const navigate = useNavigate();
  const { signInGoogle } = useAuthGoogle();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
  musicStore.getState().fetchLikedSongs();
}, []);

  
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
  const handleSongClick = (song: Song) => {
    if (song.albumId) {
      navigate(`/albums/${song.albumId}`);
    } else if (song.songAuthor?._id) {
      navigate(`/authors/${song.songAuthor._id}`);
    }
  };

  if (isLoading) return <DiscoverGridTemplate />;
  if (error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>;

  return (
    <>  <h1 className='text-xl sm:text-2xl font-bold mb-5'>Вам може сподобатися</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        {discoverSongs.map((song: Song) => {
          const isCurrentSong = currentSong?._id === song._id;
          const isLiked = likedSongs.some(likedSong => likedSong._id === song._id);
          
          return (
            
            
            <div key={song._id} className="relative group">
              
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
                    hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
                    onClick={() => handleSongClick(song)}
                  >
                    <img
                      src={song.songImgUrl}
                      alt={song.songTitle}
                      className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
                    />
                    <div className='flex-1 p-4'>
                      <p className={`font-medium truncate ${isCurrentSong ? "text-orange-400" : "text-white"}`}>
                        {song.songTitle}
                      </p>
                      <p className='text-sm text-zinc-400 truncate'>{song.songAuthor?.name}</p>
                    </div>
                    <PlayButton song={song} />
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-60 bg-zinc-900 border-zinc-700">
                  <ContextMenuItem 
                    onClick={() => handleLikeSong(song)}
                    className="hover:bg-zinc-800 cursor-pointer"
                  >
                    {isLiked ? "Видалити з улюблених" : "Додати до улюблених"}
                  </ContextMenuItem>
                  <ContextMenuItem 
                    onClick={() => {
                      setSelectedSong(song);
                      setIsDialogOpen(true);
                    }}
                    className="hover:bg-zinc-800 cursor-pointer"
                  >
                    Додати до списку відтворення
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
              
              
              <button
                onClick={() => handleLikeSong(song)}
                className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${isLiked ? 'text-red-500' : 'text-white/50 hover:text-white'}`}
              >
                <Heart
                  size={20} 
                  fill={isLiked ? 'currentColor' : 'none'} 
                />
              </button>
            </div>
            
          );
        })}
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

export default DiscoverGrid;
