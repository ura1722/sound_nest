export interface Song {
	_id: string;
	songTitle: string;
	songAuthor: string;
	albumId?: {
    _id: string;
    albumTitle: string;
  };
	songImgUrl: string;
	songAudioUrl: string;
	songDuration: number;
	createdAt: string;
	updatedAt: string;
}

export interface Album {
	_id: string;
	albumTitle: string;
	albumAuthor: string;
	albumImgUrl: string;
	albumRelease: number;
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
