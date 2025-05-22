'use client';

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

import { useRef, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multipleselect";

interface NewAuthor {
  name: string;
  genres: string[];
  decades: string[];
  moods: string[];
}

const availableGenres = [
  "rock", "pop", "jazz", "electronic", "hiphop", 
  "classical", "reggae", "blues", "country", 
  "metal", "folk", "rnb", "latin", "indie", 
  "punk", "alternative", "dance", "house", 
  "techno", "trance", "kpop", "soul", "funk", "disco","ambient"
].map(g => ({ value: g, label: g }));

const availableDecades = [
  "50s", "60s", "70s", "80s", 
  "90s", "00s", "10s", "20s"
].map(d => ({ value: d, label: d }));

const availableMoods = [
  "energetic", "relaxed", "happy", "sad", 
  "romantic", "angry", "focused", "nostalgic"
].map(m => ({ value: m, label: m }));

function AddAuthorDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  const [newAuthor, setNewAuthor] = useState<NewAuthor>({
    name: "",
    genres: [],
    decades: [],
    moods: []
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

  try {
    if (!imageFile) {
      return toast.error("Please upload an image file");
    }

    const formData = new FormData();
    formData.append("name", newAuthor.name);
    
    // Додаємо масиви тільки якщо вони не порожні
    if (newAuthor.genres.length > 0) {
      newAuthor.genres.forEach(genre => {
        formData.append("genres", genre); // Ключ без [] для NestJS
      });
    } else {
      formData.append("genres", ""); // Явно вказуємо порожнє значення
    }

    if (newAuthor.decades.length > 0) {
      newAuthor.decades.forEach(decade => {
        formData.append("decades", decade);
      });
    } else {
      formData.append("decades", "");
    }

    if (newAuthor.moods.length > 0) {
      newAuthor.moods.forEach(mood => {
        formData.append("moods", mood);
      });
    } else {
      formData.append("moods", "");
    }
    
    formData.append("imageFile", imageFile);

    await axiosInstance.post("/admin/create-author", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

      setNewAuthor({
        name: "",
        genres: [],
        decades: [],
        moods: []
      });
      setImageFile(null);
      toast.success("Author added successfully");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to add author: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
            <Plus className='mr-2 h-4 w-4' />
            Add Author
          </Button>
        </DialogTrigger>

        <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
          <DialogHeader>
            <DialogTitle>Add New Author</DialogTitle>
            <DialogDescription>Add a new author/band to your music library</DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <input
              type='file'
              ref={imageInputRef}
              className='hidden'
              accept='image/*'
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />

            {/* Image upload area */}
            <div
              className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
              onClick={() => imageInputRef.current?.click()}
            >
              <div className='text-center'>
                {imageFile ? (
                  <div className='space-y-2'>
                    <div className='text-sm text-emerald-500'>Image selected:</div>
                    <div className='text-xs text-zinc-400'>{imageFile.name.slice(0, 20)}</div>
                  </div>
                ) : (
                  <>
                    <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                      <Upload className='h-6 w-6 text-zinc-400' />
                    </div>
                    <div className='text-sm text-zinc-400 mb-2'>Upload author image</div>
                    <Button variant='outline' size='sm' className='text-xs'>
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Name field */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Name</label>
              <Input
                value={newAuthor.name}
                onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                className='bg-zinc-800 border-zinc-700'
                placeholder="Author or band name"
              />
            </div>

            {/* Genres multi-select */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Genres</label>
              <MultipleSelector
                value={newAuthor.genres.map(g => ({ value: g, label: g }))}
                onChange={(options) => setNewAuthor({
                  ...newAuthor,
                  genres: options.map(o => o.value)
                })}
                defaultOptions={availableGenres}
                placeholder="Select genres..."
                creatable
                emptyIndicator={
                  <p className="text-center text-zinc-400">No genres found</p>
                }
              />
            </div>

            {/* Decades multi-select */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Active Decades</label>
              <MultipleSelector
                value={newAuthor.decades.map(d => ({ value: d, label: d }))}
                onChange={(options) => setNewAuthor({
                  ...newAuthor,
                  decades: options.map(o => o.value)
                })}
                defaultOptions={availableDecades}
                placeholder="Select decades..."
                emptyIndicator={
                  <p className="text-center text-zinc-400">No decades found</p>
                }
              />
            </div>

            {/* Moods multi-select */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Moods</label>
              <MultipleSelector
                value={newAuthor.moods.map(m => ({ value: m, label: m }))}
                onChange={(options) => setNewAuthor({
                  ...newAuthor,
                  moods: options.map(o => o.value)
                })}
                defaultOptions={availableMoods}
                placeholder="Select moods..."
                emptyIndicator={
                  <p className="text-center text-zinc-400">No moods found</p>
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !newAuthor.name || !imageFile}>
              {isLoading ? "Creating..." : "Add Author"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}

export default AddAuthorDialog;
