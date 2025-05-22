import PlayButton from "@/components/PlayButton";
import SectionGridTemplate from "@/components/templates/SectionGridTemplate";
import { Button } from "@/components/ui/button";
import { playerStore } from "@/stores/playerStore";

import { Song } from "@/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { useState } from "react";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { musicStore } from "@/stores/musicStore";
import { AddToPlaylistDialog } from "@/components/AddToPlaylistDialog";
import { playlistStore } from "@/stores/playlistStore";

type GridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

function SectionGrid({ songs, title, isLoading }: GridProps) {
  const { currentSong } = playerStore();
  const  { likedSongs, toggleLikeSong } = musicStore();
  const { playlists, addSongToPlaylist } = playlistStore();
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);



  const handleLikeSong = async (song: Song) => {
    try {
      const wasLiked = likedSongs.some(likedSong => likedSong._id === song._id);
      await toggleLikeSong(song._id);
      toast.success(wasLiked ? "Song unliked" : "Song liked");
    } catch (error) {
      console.log(error);
      toast.error("Failed to toggle like status");
    }
  };

  if (isLoading) return <SectionGridTemplate />;

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>
        <Button variant='link' className='text-sm text-zinc-400 hover:text-white'>
          Show all
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {songs.map((song) => {
          const isCurrentSong = currentSong?._id === song._id;
          const isLiked = likedSongs.some(likedSong => likedSong._id === song._id);
          
          return (
            <div key={song._id} className="relative group">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'>
                    <div className='relative mb-4'>
                      <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                        <img
                          src={song.songImgUrl}
                          alt={song.songTitle}
                          className='w-full h-full object-cover transition-transform duration-300 
                          group-hover:scale-105'
                        />
                      </div>
                      <PlayButton song={song} />
                    </div>
                    <h3 className={`font-medium mb-2 truncate ${isCurrentSong ? "text-orange-400" : "text-white"}`}>
                      {song.songTitle}
                    </h3>
                    <p className='text-sm text-zinc-400 truncate'>{song.songAuthor?.name}</p>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-40 bg-zinc-900 border-zinc-700">
                  <ContextMenuItem 
                    onClick={() => handleLikeSong(song)}
                    className="hover:bg-zinc-800 cursor-pointer"
                  >
                    {isLiked ? "Unlike song" : "Like song"}
                  </ContextMenuItem>
                  <ContextMenuItem 
                    onClick={() => {
                      setSelectedSong(song);
                      setIsDialogOpen(true);
                    }}
                    className="hover:bg-zinc-800 cursor-pointer"
                  >
                    Add to playlist
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
              
              {/* Heart icon for liked songs */}
              <button
                onClick={() => handleLikeSong(song)}
                className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${isLiked ? 'text-red-500' : 'text-white/50 hover:text-white'}`}
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

      {/* Add to Playlist Dialog */}
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
    </div>
  );
}

export default SectionGrid;
