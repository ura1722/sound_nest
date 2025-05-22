import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MultipleSelector from "@/components/ui/multipleselect";
import { musicStore } from "@/stores/musicStore";

function AddAlbumDialog() {
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {authors} = musicStore();

  const [newAlbum, setNewAlbum] = useState({
    albumTitle: "",
    albumAuthor: "",
    albumRelease: new Date().getFullYear(),
    genres: [] as string[],
    moods: [] as string[],
    decade: `${(Math.floor(new Date().getFullYear() / 10) * 10).toString().slice(-2)}s`
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Опції для мультіселектів
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
].map(d => ({ value: d, label: d }));

const moodOptions = [
  "energetic", "relaxed", "happy", "sad", 
  "romantic", "angry", "focused", "nostalgic"
].map(m => ({ value: m, label: m }));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error('Будь ласка, оберіть зображення (JPEG, PNG тощо)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Розмір зображення має бути менше 5MB');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Валідація
      if (!imageFile) throw new Error("Обов'язкове зображення альбому");
      if (!newAlbum.albumTitle.trim()) throw new Error("Назва альбому обов'язкова");
      if (!newAlbum.albumAuthor.trim()) throw new Error("Ім'я виконавця обов'язкове");
      if (newAlbum.genres.length === 0) throw new Error("Оберіть хоча б один жанр");
      if (!newAlbum.decade) throw new Error("Оберіть декаду");

      const formData = new FormData();
      formData.append("albumTitle", newAlbum.albumTitle.trim());
      formData.append("albumAuthor", newAlbum.albumAuthor.trim());
      formData.append("albumRelease", newAlbum.albumRelease.toString());
      formData.append("decade", newAlbum.decade);
      newAlbum.genres.forEach(genre => formData.append("genres", genre));
      newAlbum.moods.forEach(mood => formData.append("moods", mood));
      formData.append("imageFile", imageFile);

      await axiosInstance.post("/admin/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Скидання форми
      setNewAlbum({
        albumTitle: "",
        albumAuthor: "",
        albumRelease: new Date().getFullYear(),
        genres: [],
        moods: [],
        decade: `${Math.floor(new Date().getFullYear() / 10) * 10}s`
      });
      removeImage();
      setAlbumDialogOpen(false);
      
      toast.success("Альбом успішно створено");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Помилка при створенні альбому");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
        <DialogTrigger asChild>
          <Button className='bg-violet-500 hover:bg-violet-600 text-white'>
            <Plus className='mr-2 h-4 w-4' />
            Додати альбом
          </Button>
        </DialogTrigger>
        
        <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Новий альбом</DialogTitle>
            <DialogDescription>Додайте новий альбом до вашої колекції</DialogDescription>
          </DialogHeader>
          
          <div className='space-y-4 py-4'>
            {/* Завантаження зображення */}
            <div>
              <label className='text-sm font-medium'>Обкладинка альбому</label>
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept='image/*'
                className='hidden'
              />
              <div
                className='mt-1 flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Попередній перегляд" 
                      className="h-40 w-40 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1 hover:bg-zinc-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className='text-center'>
                    <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                      <Upload className='h-6 w-6 text-zinc-400' />
                    </div>
                    <div className='text-sm text-zinc-400 mb-2'>
                      Завантажити обкладинку
                    </div>
                    <Button variant='outline' size='sm' className='text-xs'>
                      Обрати файл
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Назва альбому */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Назва альбому*</label>
              <Input
                value={newAlbum.albumTitle}
                onChange={(e) => setNewAlbum({...newAlbum, albumTitle: e.target.value})}
                className='bg-zinc-800 border-zinc-700'
                placeholder="Назва альбому"
              />
            </div>

            {/* Виконавець */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Виконавець*</label>
              <select
                value={newAlbum.albumAuthor}
                onChange={(e) => setNewAlbum({...newAlbum, albumAuthor: e.target.value})}
                className='bg-zinc-800 border-zinc-700 text-white rounded-md px-3 py-2 w-full'
              >
                <option value="">Оберіть автора</option>
                {authors.map((author) => (
                  <option key={author._id} value={author._id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>


            {/* Рік випуску */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Рік випуску*</label>
              <Input
  type='number'
  value={newAlbum.albumRelease}
  onChange={(e) => {
    const year = parseInt(e.target.value);
    setNewAlbum({
      ...newAlbum,
      albumRelease: year,
      decade: `${(Math.floor(year / 10) * 10).toString().slice(-2)}s` // Оновлено тут
    });
  }}
  className='bg-zinc-800 border-zinc-700'
  min={1900}
  max={new Date().getFullYear()}
/>
            </div>

            {/* Декада (автоматично оновлюється при зміні року) */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Декада*</label>
              <MultipleSelector
                value={[{value: newAlbum.decade, label: newAlbum.decade}]}
                onChange={(options) => setNewAlbum({...newAlbum, decade: options[0]?.value || ''})}
                defaultOptions={decadeOptions}
                placeholder="Оберіть декаду"
                hidePlaceholderWhenSelected
                emptyIndicator={<p className="text-center text-zinc-400">Немає варіантів</p>}
              />
            </div>

            {/* Жанри */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Жанри*</label>
              <MultipleSelector
                value={newAlbum.genres.map(g => ({value: g, label: g}))}
                onChange={(options) => setNewAlbum({...newAlbum, genres: options.map(o => o.value)})}
                defaultOptions={genreOptions}
                placeholder="Оберіть жанри"
                creatable
                emptyIndicator={<p className="text-center text-zinc-400">Немає жанрів</p>}
              />
            </div>

            {/* Настрої */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Настрої</label>
              <MultipleSelector
                value={newAlbum.moods.map(m => ({value: m, label: m}))}
                onChange={(options) => setNewAlbum({...newAlbum, moods: options.map(o => o.value)})}
                defaultOptions={moodOptions}
                placeholder="Оберіть настрої"
                emptyIndicator={<p className="text-center text-zinc-400">Немає настроїв</p>}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant='outline' 
              onClick={() => setAlbumDialogOpen(false)} 
              disabled={isLoading}
            >
              Скасувати
            </Button>
            <Button
              onClick={handleSubmit}
              className='bg-violet-500 hover:bg-violet-600'
              disabled={isLoading || 
                !imageFile || 
                !newAlbum.albumTitle.trim() || 
                !newAlbum.albumAuthor.trim() ||
                newAlbum.genres.length === 0 ||
                !newAlbum.decade
              }
            >
              {isLoading ? "Створення..." : "Створити альбом"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}

export default AddAlbumDialog;
