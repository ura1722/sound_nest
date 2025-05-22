import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import { axiosInstance } from "@/lib/axios";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchResultItem } from "@/components/ui/search-result-item";

type SearchResult = {
  id: string;
  type: 'song' | 'album' | 'artist';
  title: string;
  subtitle?: string;
  imageUrl?: string;
};

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Використовуємо debounce для запобігання занадто частим запитам
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/search?query=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 py-6 text-lg bg-zinc-800 border-zinc-700 focus-visible:ring-violet-500"
          placeholder="Search for songs, albums or artists..."
          autoFocus
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-3">
          {results.map((result) => (
            <SearchResultItem
              key={`${result.type}-${result.id}`}
              result={result}
            />
          ))}
        </div>
      )}

      {!isLoading && query.length > 1 && results.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}
