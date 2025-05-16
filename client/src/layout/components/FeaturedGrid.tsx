import PlayButton from "@/components/PlayButton";
import FeaturedGridTemplate from "@/components/templates/FeaturedGridTemplate";
import { musicStore } from "@/stores/musicStore";
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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { Heart } from "lucide-react";

function FeaturedGrid() {
  const { isLoading, featuredSongs, error, likedSongs, toggleLikeSong } = musicStore();
  const { currentSong } = playerStore();
  const { playlists, addSongToPlaylist } = userStore();
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
  musicStore.getState().fetchLikedSongs();
}, []);

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

  if (isLoading) return <FeaturedGridTemplate />;
  if (error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>;

  return (
    <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        {featuredSongs.map((song: Song) => {
          const isCurrentSong = currentSong?._id === song._id;
          const isLiked = likedSongs.includes(song._id);
          
          return (
            <div key={song._id} className="relative group">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
                    hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
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
                      <p className='text-sm text-zinc-400 truncate'>{song.songAuthor}</p>
                    </div>
                    <PlayButton song={song} />
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
	  <Toaster />
    </>
  );
}

export default FeaturedGrid;
