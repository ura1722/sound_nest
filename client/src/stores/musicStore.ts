import { axiosInstance } from "@/lib/axios";
import { Album, Author, Song, Stats } from "../types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
	songs: Song[];
	albums: Album[];
	authors: Author[];
	isLoading: boolean;
	error: string | null;
	currentAuthor: Author | null;
	currentAlbum: Album | null;
	likedSongs: Song[];
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	discoverSongs: Song[];
	friendsSongs: Song[];
	stats: Stats;
	recentlyPlayed:  Song[];

	fetchAlbums: () => Promise<void>;
	toggleLikeSong: (songId: string) => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchAuthorById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchLikedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchDiscoverSongs: () => Promise<void>;
	fetchRecentlyPlayed: () => Promise<void>;
	fetchFriendsSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchAuthors: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
	deleteAuthor: (id: string) => Promise<void>;
	//updateSong: (id: string, data: Partial<Song>) => Promise<void>;
	//updateAlbum: (id: string, data: Partial<Album>) => Promise<void>;
	updateAuthor: (id: string, data: Partial<Author>) => Promise<void>;
}

export const musicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	authors: [],
	likedSongs: [],
	isLoading: false,
	error: null,
	currentAlbum: null,
	currentAuthor: null,
	madeForYouSongs: [],
	featuredSongs: [],
	friendsSongs: [],
	recentlyPlayed: [],
	discoverSongs: [],
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalAuthors: 0,
	},
	toggleLikeSong: async (songId) => {
    try {
      const response = await axiosInstance.put(`/users/like`, { songId });
      set({ likedSongs: response.data.likedSongs });
    } catch (error) {
      console.error("Error toggling like status:", error);
      throw error;
    }
  },
  fetchLikedSongs: async () => {
    try {
      const response = await axiosInstance.get('/users/liked-songs');
      set({ likedSongs: response.data });
    } catch (error) {
      console.error("Failed to fetch liked songs:", error);
    }
  },
	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},
	deleteAuthor: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/author-delete/${id}`);

			set((state) => ({
				authors: state.authors.filter((author) => author._id !== id),
			}));
			toast.success("Author deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteAuthor", error);
			toast.error("Error deleting author");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.albumTitle ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},
	fetchAuthors: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/authors");
			set({ authors: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},
	updateAuthor: async (id: string, data) => {
  try {
    await axiosInstance.put(`/admin/authors-update/${id}`, data);
    // Оновити локальний стан після успішного оновлення
    set(state => ({
      authors: state.authors.map(author => 
        author._id === id ? { ...author, ...data } : author
      )
    }));
  } catch (error) {
    console.error("Error updating author:", error);
    throw error;
  }
},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/statistic");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
	fetchAuthorById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/authors/${id}`);
			set({ currentAuthor: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/featured");
			set({ featuredSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
	fetchFriendsSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/friends-recently-played");
			set({ friendsSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
	fetchRecentlyPlayed: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/recently-played");
			set({ recentlyPlayed: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/recommended");
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchDiscoverSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/discover");
			set({ discoverSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
