// src/pages/auth/SelectArtistsPage.tsx
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Author } from "@/types";

function SelectAuthorsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Отримуємо всіх авторів при завантаженні сторінки
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axiosInstance.get("/authors");
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  // Обробник вибору автора
  const handleAuthorSelect = (authorId: string) => {
    setSelectedAuthors(prev => 
      prev.includes(authorId) 
        ? prev.filter(id => id !== authorId) 
        : [...prev, authorId]
    );
  };

  // Відправка вибраних авторів
  const handleSubmit = async () => {
    if (!user || selectedAuthors.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/users/add-authors', {
        authorIds: selectedAuthors
      });
      navigate("/"); // Перенаправляємо на головну після успішного збереження
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <h3 className="text-zinc-400 text-xl font-bold">Loading artists...</h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black p-4">
      <Card className="max-w-3xl mx-auto bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-center">
            Select your favorite artists
          </CardTitle>
          <p className="text-zinc-400 text-center">
            Choose at least 3 artists to personalize your experience
          </p>
        </CardHeader>
        
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {authors.map(author => (
            <div 
              key={author._id} 
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer 
                ${selectedAuthors.includes(author._id) 
                  ? "bg-zinc-700" 
                  : "hover:bg-zinc-800"}`}
              onClick={() => handleAuthorSelect(author._id)}
            >
              
              <div className="flex items-center gap-3">
                <img 
                  src={author.imageUrl} 
                  alt={author.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-white">{author.name}</span>
              </div>
            </div>
          ))}
        </CardContent>

        <div className="p-4 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={selectedAuthors.length < 3 || isSubmitting}
            className="bg-orange-400 hover:bg-orange-500 text-black"
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default SelectAuthorsPage;
