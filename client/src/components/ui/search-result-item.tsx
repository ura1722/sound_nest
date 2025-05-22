import { Link } from "react-router-dom";

type SearchResultItemProps = {
  result: {
    id: string;
    type: 'song' | 'album' | 'artist';
    title: string;
    author?: string;
    albumId?: string; 
    authorId?: string;
    imageUrl?: string;
  };
};

export function SearchResultItem({ result }: SearchResultItemProps) {
  const getLink = () => {
    switch(result.type) {
      case 'song': return result.albumId ? `/albums/${result.albumId}` : `/authors/${result.authorId}`;
      case 'album': return `/albums/${result.id}`;
      case 'artist': return `/authors/${result.id}`;
      default: return '#';
    }
  };

  const getIcon = () => {
    switch(result.type) {
      case 'song': return '🎵';
      case 'album': return '💿';
      case 'artist': return '👤';
      default: return '';
    }
  };

  return (
    <Link
      to={getLink()}
      className="flex items-center p-3 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-zinc-700 rounded-md flex items-center justify-center mr-3">
        {result.imageUrl ? (
          <img 
            src={result.imageUrl} 
            alt={result.title}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <span className="text-lg">{getIcon()}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{result.title}</h4>
        {result.author && (
          <p className="text-sm text-zinc-400 truncate">{result.author}</p>
        )}
      </div>
      <div className="ml-2 text-xs text-zinc-400 capitalize">
        {result.type}
      </div>
    </Link>
  );
}
