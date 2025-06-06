import AddFriendButton from "@/components/AddFriendButton"
import Playlist from "@/components/templates/Playlist"
import { Button, buttonVariants } from "@/components/ui/button"
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuthGoogle } from "@/hooks/useAuth"
import { axiosInstance } from "@/lib/axios"
import { cn } from "@/lib/utils"
import { playlistStore } from "@/stores/playlistStore"
import { useAuth } from "@clerk/clerk-react"




import {  EllipsisVertical, Heart, HomeIcon, Library, Plus, Search, Trash2, User2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

function SidebarMenu() {
    
	const { playlists, fetchPlaylists, isLoading, deletePlaylist } = playlistStore();
  const { isSignedIn } = useAuth();
  const { signInGoogle } = useAuthGoogle();
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

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await deletePlaylist(playlistId);
      
      fetchPlaylists(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Failed to delete playlist");
    }
  };

  const checkAuth = () => {
    if (!isSignedIn) {
      signInGoogle();
      return false;
    }
    return true;
  };
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
      await fetchPlaylists();
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
						<span className='hidden md:inline'>Головна</span>
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
            <span className='hidden md:inline'>Пошук</span>
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
            <span className='hidden md:inline'>Вподобані</span>
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
            <span className='hidden md:inline'>Чат</span>
          </Link>
          
            <AddFriendButton />
          
          
					<Dialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={checkAuth}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                <Plus className='mr-2 size-5' />
                <span className='hidden md:inline'>Новий плейліст</span>
              </button>
            </DialogTrigger>
            <DialogContent className='bg-zinc-900 border-zinc-700'>
              <DialogHeader>
                <DialogTitle>Створити новий плейліст</DialogTitle>
                <DialogDescription>
                  Введіть назву плейлісту та загрузіть обкладку
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
                      {imageFile ? imageFile.name : "Завантажити обкладку (опціонально)"}
                    </div>
                    <Button variant='outline' size='sm' className='text-xs'>
                      Вибрати файл
                    </Button>
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Назва плейлісту</label>
                  <Input
                    value={newPlaylist.playlistTitle}
                    onChange={(e) => setNewPlaylist({ playlistTitle: e.target.value })}
                    className='bg-zinc-800 border-zinc-700'
                    placeholder='Введіть назву плейлісту'
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant='outline' 
                  onClick={() => setPlaylistDialogOpen(false)} 
                  disabled={isLoadingPlaylist}
                >
                  Скасувати
                </Button>
                <Button
                  onClick={handleCreatePlaylist}
                  className='bg-violet-500 hover:bg-violet-600'
                  disabled={isLoadingPlaylist || !newPlaylist.playlistTitle}
                >
                  {isLoadingPlaylist ? "Створення..." : "Створити плейліст"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
					
				</div>
			</div>

			
			<div className='flex-1 rounded-lg bg-zinc-900 p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span className='hidden md:inline'>Плейлісти</span>
					</div>
				</div>
                
                <ScrollArea className='h-[calc(100vh-300px)]'>
          <div className='space-y-2'>
            {isLoading ? (
              <Playlist />
            ) : (
              playlists.map((playlist) => (
                <div key={playlist._id} className="group flex items-center hover:bg-zinc-800 rounded-md">
                  <Link
                    to={`/playlists/${playlist._id}`}
                    className='p-2 flex items-center gap-3 flex-1'
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
                  
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 text-zinc-400 hover:text-white  transition-opacity">
                        <EllipsisVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 bg-zinc-800 border-zinc-700">
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500 focus:bg-zinc-700 cursor-pointer"
                        onClick={() => handleDeletePlaylist(playlist._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Видалити
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
				
			</div>
		</div>
  )
}

export default SidebarMenu
