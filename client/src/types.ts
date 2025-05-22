export interface Song {
	_id: string;
	songTitle: string;
	songAuthor?: {
    _id: string;
    name: string;
  };
	albumId?: {
    _id: string;
    albumTitle: string;
  };
  	genres: string[];
	moods: string[];
	decade: string;
	songImgUrl: string;
	songAudioUrl: string;
	songDuration: number;
	createdAt: string;
    updatedAt: string;
}
export interface Author {
	_id: string;
	name: string;
	imageUrl: string;
	genres: string[];
	moods: string[];
	decades: string[];
	songs: Song[];
	albums: Album[];
}
export interface Album {
	_id: string;
	albumTitle: string;
	albumAuthor?: {
    _id: string;
    name: string;
  };
	albumImgUrl: string;
	albumRelease: number;
	genres: string[];
	moods: string[];
	decade: string;
	albumSongs: Song[];
}
export interface Playlist {
    _id: string;
    playlistTitle: string;
    playlistImgUrl: string;
    playlistSongs: Song[];
    createdAt: string;
    updatedAt: string;
}
export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalAuthors: number;
}

export interface User {
	_id: string;
	clerkId: string;
	userName: string;
	userImgUrl: string;
}
export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}


