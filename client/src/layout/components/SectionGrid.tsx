import PlayButton from "@/components/PlayButton";
import SectionGridTemplate from "@/components/templates/SectionGridTemplate";
import { Button } from "@/components/ui/button";
import { playerStore } from "@/stores/playerStore";
import { userStore } from "@/stores/userStore";
import { Song } from "@/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { musicStore } from "@/stores/musicStore";

type GridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

function SectionGrid({ songs, title, isLoading }: GridProps) {
  const { currentSong } = playerStore();
  const  { likedSongs, toggleLikeSong } = musicStore();
  const { playlists, addSongToPlaylist } = userStore();
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddToPlaylist = async () => {
    if (!selectedSong || !selectedPlaylistId) return;
    
    try {
      await addSongToPlaylist(selectedPlaylistId, selectedSong._id);
      toast.success("Song added to playlist");
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add song to playlist");
    }
  };

  const handleLikeSong = async (song: Song) => {
    try {
      const wasLiked = likedSongs.includes(song._id);
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
          const isLiked = likedSongs.includes(song._id);
          
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
                    <p className='text-sm text-zinc-400 truncate'>{song.songAuthor}</p>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-zinc-400 mb-4">
              Add <span className="font-medium text-white">{selectedSong?.songTitle}</span> to:
            </p>
            
            {playlists?.length ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {playlists.map(playlist => (
                  <div 
                    key={playlist._id}
                    className={`p-3 rounded-md cursor-pointer ${selectedPlaylistId === playlist._id ? 'bg-zinc-700' : 'hover:bg-zinc-800'}`}
                    onClick={() => setSelectedPlaylistId(playlist._id)}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={playlist.playlistImgUrl} 
                        alt={playlist.playlistTitle}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{playlist.playlistTitle}</p>
                        <p className="text-xs text-zinc-400">
                          {playlist.playlistSongs.length} songs
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400 text-center py-4">
                You don't have any playlists yet.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddToPlaylist}
              disabled={!selectedPlaylistId}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              Add to Playlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SectionGrid;
