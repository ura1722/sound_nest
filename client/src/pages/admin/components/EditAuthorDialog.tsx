'use client';

import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Author } from "@/types";
import { useState, useRef } from "react";
import MultipleSelector from "@/components/ui/multipleselect";
import { Upload, X } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

interface EditAuthorDialogProps {
  author: Author;
  onClose: () => void;
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

export default function EditAuthorDialog({ author, onClose }: EditAuthorDialogProps) {
  const [name, setName] = useState(author.name);
  const [genres, setGenres] = useState(author.genres || []);
  const [moods, setMoods] = useState(author.moods || []);
  const [decades, setDecades] = useState(author.decades || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      setImageFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      
      // Add arrays only if they're not empty
      if (genres.length > 0) {
        genres.forEach(genre => {
          formData.append("genres", genre);
        });
      } else {
        formData.append("genres", "");
      }

      if (decades.length > 0) {
        decades.forEach(decade => {
          formData.append("decades", decade);
        });
      } else {
        formData.append("decades", "");
      }

      if (moods.length > 0) {
        moods.forEach(mood => {
          formData.append("moods", mood);
        });
      } else {
        formData.append("moods", "");
      }
      
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await axiosInstance.put(`/admin/authors-update/${author._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Author updated successfully");
      onClose();
    } catch (error: any) {
      toast.error("Failed to update author: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Author</DialogTitle>
            <DialogDescription>Update author information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />

            {/* Image upload area */}
            <div
              className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {imageFile ? (
                <div className="relative">
                  <img 
                    src={URL.createObjectURL(imageFile)} 
                    alt="Preview" 
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
                <div className="text-center">
                  <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                    <Upload className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-400 mb-2">
                    {author.imageUrl ? "Change image" : "Upload image"}
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Select File
                  </Button>
                </div>
              )}
            </div>

            {/* Name field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder="Author or band name"
              />
            </div>

            {/* Genres multi-select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Genres</label>
              <MultipleSelector
                value={genres.map(g => ({ value: g, label: g }))}
                onChange={(options) => setGenres(options.map(o => o.value))}
                defaultOptions={availableGenres}
                placeholder="Select genres..."
                creatable
                emptyIndicator={
                  <p className="text-center text-zinc-400">No genres found</p>
                }
              />
            </div>

            {/* Decades multi-select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Active Decades</label>
              <MultipleSelector
                value={decades.map(d => ({ value: d, label: d }))}
                onChange={(options) => setDecades(options.map(o => o.value))}
                defaultOptions={availableDecades}
                placeholder="Select decades..."
                emptyIndicator={
                  <p className="text-center text-zinc-400">No decades found</p>
                }
              />
            </div>

            {/* Moods multi-select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Moods</label>
              <MultipleSelector
                value={moods.map(m => ({ value: m, label: m }))}
                onChange={(options) => setMoods(options.map(o => o.value))}
                defaultOptions={availableMoods}
                placeholder="Select moods..."
                emptyIndicator={
                  <p className="text-center text-zinc-400">No moods found</p>
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !name}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}
