import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { musicStore } from "@/stores/musicStore";
import { useRef, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultipleSelector from "@/components/ui/multipleselect";

interface NewSong {
  songTitle: string;
  songAuthor: string; 
  songAlbum: string; 
  songDuration: string;
  genres: string[];
  moods: string[];
  decade: string;
}

function AddSongDialog() {
  const { albums, authors } = musicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newSong, setNewSong] = useState<NewSong>({
    songTitle: "",
    songAuthor: "",
    songAlbum: "",
    songDuration: "0",
    genres: [],
    moods: [],
    decade: `${Math.floor(new Date().getFullYear() / 10) * 10}s`
  });

  const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
    audio: null,
    image: null,
  });

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  
  const genreOptions = [
  "rock", "pop", "jazz", "electronic", "hiphop", 
  "classical", "reggae", "blues", "country", 
  "metal", "folk", "rnb", "latin", "indie", 
  "punk", "alternative", "dance", "house", 
  "techno", "trance", "kpop", "soul", "funk", "disco","ambient"
].map(g => ({ value: g, label: g }));

const decadeOptions = [
    "50s", "60s", "70s", "80s",
    "90s", "00s", "10s", "20s"
  ];
  
const moodOptions = [
  "energetic", "relaxed", "happy", "sad", 
  "romantic", "angry", "focused", "nostalgic"
].map(m => ({ value: m, label: m }));

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!files.audio || !files.image) {
        return toast.error("Будь ласка, виберіть музиний файл і зображеня");
      }

      const formData = new FormData();

      formData.append("songTitle", newSong.songTitle);
      formData.append("songAuthor", newSong.songAuthor);
      formData.append("songDuration", newSong.songDuration);
      formData.append("decade", newSong.decade);
      newSong.genres.forEach(genre => formData.append("genres", genre));
      newSong.moods.forEach(mood => formData.append("moods", mood));
      
      if (newSong.songAlbum && newSong.songAlbum !== "none") {
        formData.append("albumId", newSong.songAlbum);
      }

      formData.append("audioFile", files.audio);
      formData.append("imageFile", files.image);

      await axiosInstance.post("/admin/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      
      setNewSong({
        songTitle: "",
        songAuthor: "",
        songAlbum: "",
        songDuration: "0",
        genres: [],
        moods: [],
        decade: `${Math.floor(new Date().getFullYear() / 10) * 10}s`
      });

      setFiles({
        audio: null,
        image: null,
      });
      
      setSongDialogOpen(false);
      toast.success("Song added successfully");
      
      
      await musicStore.getState().fetchSongs();
    } catch (error: any) {
      toast.error("Failed to add song: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
        <DialogTrigger asChild>
          <Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
            <Plus className='mr-2 h-4 w-4' />
            Додати пісню
          </Button>
        </DialogTrigger>

        <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
          <DialogHeader>
            <DialogTitle>Додати нову пісню</DialogTitle>
            <DialogDescription>Додати нову пісню до бібліотеки</DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            
            <input
              type='file'
              accept='audio/*'
              ref={audioInputRef}
              hidden
              onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
            />

            <input
              type='file'
              ref={imageInputRef}
              className='hidden'
              accept='image/*'
              onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
            />

            
            <div
              className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
              onClick={() => imageInputRef.current?.click()}
            >
              <div className='text-center'>
                {files.image ? (
                  <div className='space-y-2'>
                    <div className='text-sm text-emerald-500'>Зображення вибрано:</div>
                    <div className='text-xs text-zinc-400'>{files.image.name.slice(0, 20)}</div>
                  </div>
                ) : (
                  <>
                    <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                      <Upload className='h-6 w-6 text-zinc-400' />
                    </div>
                    <div className='text-sm text-zinc-400 mb-2'>Завантажити обкладку</div>
                    <Button variant='outline' size='sm' className='text-xs'>
                      Виберіть файл
                    </Button>
                  </>
                )}
              </div>
            </div>

            
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Аудіо файл</label>
              <div className='flex items-center gap-2'>
                <Button variant='outline' onClick={() => audioInputRef.current?.click()} className='w-full'>
                  {files.audio ? files.audio.name.slice(0, 20) : "Вибрати аудіо файл"}
                </Button>
              </div>
            </div>

            
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Назва*</label>
              <Input
                value={newSong.songTitle}
                onChange={(e) => setNewSong({ ...newSong, songTitle: e.target.value })}
                className='bg-zinc-800 border-zinc-700'
              />
            </div>

            {/* Artist select */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Автор*</label>
              <Select
                value={newSong.songAuthor}
                onValueChange={(value) => setNewSong({ ...newSong, songAuthor: value })}
              >
                <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                  <SelectValue placeholder='Вибрати автора' />
                </SelectTrigger>
                <SelectContent className='bg-zinc-800 border-zinc-700'>
                  {authors.map((author) => (
                    <SelectItem key={author._id} value={author._id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Album select */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Альбом (опціонально)</label>
              <Select
                value={newSong.songAlbum}
                onValueChange={(value) => setNewSong({ ...newSong, songAlbum: value })}
              >
                <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                  <SelectValue placeholder='Вибрати альбом' />
                </SelectTrigger>
                <SelectContent className='bg-zinc-800 border-zinc-700'>
                  <SelectItem value='none'>Без альбому (Сингл)</SelectItem>
                  {albums.map((album) => (
                    <SelectItem key={album._id} value={album._id}>
                      {album.albumTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Тривалвсть (секунди)*</label>
              <Input
                type='number'
                min='0'
                value={newSong.songDuration}
                onChange={(e) => setNewSong({ ...newSong, songDuration: e.target.value || "0" })}
                className='bg-zinc-800 border-zinc-700'
              />
            </div>

            
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Десятиліття*</label>
              <Select
                value={newSong.decade}
                onValueChange={(value) => setNewSong({ ...newSong, decade: value })}
              >
                <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                  <SelectValue placeholder='Вибрати десятиліття' />
                </SelectTrigger>
                <SelectContent className='bg-zinc-800 border-zinc-700'>
                  {decadeOptions.map((decade) => (
                    <SelectItem key={decade} value={decade}>
                      {decade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Genres */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Жанри*</label>
              <MultipleSelector
                value={newSong.genres.map(g => ({value: g, label: g}))}
                onChange={(options) => setNewSong({...newSong, genres: options.map(o => o.value)})}
                defaultOptions={genreOptions}
                placeholder="Вибрати жанри"
                creatable
                emptyIndicator={<p className="text-center text-zinc-400">Нема жанрів</p>}
              />
            </div>

            {/* Moods */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Настрої</label>
              <MultipleSelector
                value={newSong.moods.map(m => ({value: m, label: m}))}
                onChange={(options) => setNewSong({...newSong, moods: options.map(o => o.value)})}
                defaultOptions={moodOptions}
                placeholder="Вибрати настрої"
                emptyIndicator={<p className="text-center text-zinc-400">Нема настроїв</p>}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
              Скасувати
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || 
                !files.audio || 
                !files.image || 
                !newSong.songTitle || 
                !newSong.songAuthor ||
                !newSong.songDuration ||
                newSong.genres.length === 0 ||
                !newSong.decade
              }
            >
              {isLoading ? "Uploading..." : "Додати"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}

export default AddSongDialog;
