import AddFriendButton from "@/components/AddFriendButton"
import Playlist from "@/components/templates/Playlist"
import { Button, buttonVariants } from "@/components/ui/button"
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { axiosInstance } from "@/lib/axios"
import { cn } from "@/lib/utils"
import { playlistStore } from "@/stores/playlistStore"




import { Heart, HomeIcon, Library, Plus, Search, User2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

function SidebarMenu() {
    
	const { playlists, fetchPlaylists, isLoading } = playlistStore();

	useEffect(() => {
		fetchPlaylists();
	}, [fetchPlaylists]);

	const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPlaylist, setNewPlaylist] = useState({
    playlistTitle: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleCreatePlaylist = async () => {
    setIsLoadingPlaylist(true);

    try {
      const formData = new FormData();
      formData.append("playlistTitle", newPlaylist.playlistTitle);
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await axiosInstance.post("/playlists", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewPlaylist({ playlistTitle: "" });
      setImageFile(null);
      setPlaylistDialogOpen(false);
      toast.success("Playlist created successfully");
      // You might want to refresh playlists here if you have them in your store
    } catch (error: any) {
      toast.error("Failed to create playlist: " + error.message);
    } finally {
      setIsLoadingPlaylist(false);
    }
  };
  return (
    <div className='h-full flex flex-col gap-2'>
			{/* Navigation menu */}

			<div className='rounded-lg bg-zinc-900 p-4'>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Home</span>
					</Link>
          <Link
            to="/search"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <Search className='mr-2 size-5' />
            <span className='hidden md:inline'>Search</span>
          </Link>
          <Link
            to="/liked"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <Heart className='mr-2 size-5' />
            <span className='hidden md:inline'>Liked</span>
          </Link>
          <Link
            to="/chat"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <User2 className='mr-2 size-5' />
            <span className='hidden md:inline'>Chat</span>
          </Link>
          <AddFriendButton />
					<Dialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen}>
            <DialogTrigger asChild>
              <button
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                <Plus className='mr-2 size-5' />
                <span className='hidden md:inline'>Create Playlist</span>
              </button>
            </DialogTrigger>
            <DialogContent className='bg-zinc-900 border-zinc-700'>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
                <DialogDescription>
                  Give your playlist a name and optional cover image
                </DialogDescription>
              </DialogHeader>
              <div className='space-y-4 py-4'>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept='image/*'
                  className='hidden'
				  
                />
                <div
                  className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className='text-center'>
                    <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                      <Plus className='h-6 w-6 text-zinc-400' />
                    </div>
                    <div className='text-sm text-zinc-400 mb-2'>
                      {imageFile ? imageFile.name : "Upload playlist cover (optional)"}
                    </div>
                    <Button variant='outline' size='sm' className='text-xs'>
                      Choose File
                    </Button>
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Playlist Name</label>
                  <Input
                    value={newPlaylist.playlistTitle}
                    onChange={(e) => setNewPlaylist({ playlistTitle: e.target.value })}
                    className='bg-zinc-800 border-zinc-700'
                    placeholder='Enter playlist name'
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant='outline' 
                  onClick={() => setPlaylistDialogOpen(false)} 
                  disabled={isLoadingPlaylist}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePlaylist}
                  className='bg-violet-500 hover:bg-violet-600'
                  disabled={isLoadingPlaylist || !newPlaylist.playlistTitle}
                >
                  {isLoadingPlaylist ? "Creating..." : "Create Playlist"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
					
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span className='hidden md:inline'>Playlists</span>
					</div>
				</div>
                
                <ScrollArea className='h-[calc(100vh-300px)]'>
					<div className='space-y-2'>
						{isLoading ? (
							<Playlist />
						) : (
							playlists.map((playlist) => (
								<Link
									to={`/playlists/${playlist._id}`}
									key={playlist._id}
									className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
								>
									<img
										src={playlist.playlistImgUrl}
										alt='Playlist img'
										className='size-12 rounded-md flex-shrink-0 object-cover'
									/>

									<div className='flex-1 min-w-0 hidden md:block'>
										<p className='font-medium truncate'>{playlist.playlistTitle}</p>
										
									</div>
								</Link>
							))
						)}
					</div>
				</ScrollArea>
				
			</div>
		</div>
  )
}

export default SidebarMenu
