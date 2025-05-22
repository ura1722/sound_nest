import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Playlist } from "@/types";
import { useState } from "react";

interface AddToPlaylistDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  songTitle: string;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string) => Promise<void>;
}

export function AddToPlaylistDialog({
  isOpen,
  onOpenChange,
  songTitle,
  playlists,
  onAddToPlaylist,
}: AddToPlaylistDialogProps) {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

  const handleAdd = async () => {
    await onAddToPlaylist(selectedPlaylistId);
    setSelectedPlaylistId("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-zinc-400 mb-4">
            Add <span className="font-medium text-white">{songTitle}</span> to:
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
            onClick={() => onOpenChange(false)}
            className="border-zinc-700 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAdd}
            disabled={!selectedPlaylistId}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            Add to Playlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
