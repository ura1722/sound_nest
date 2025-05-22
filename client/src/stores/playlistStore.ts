import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { Playlist } from "../types";

interface PlaylistStore {
    playlists: Playlist[];
    currentPlaylist: Playlist | null;
    isLoading: boolean;
    error: string | null;
    

    
    fetchPlaylists: () => Promise<void>;
    addSongToPlaylist: (playlistId: string, songId: string) => void;
    fetchPlaylistById: (id: string) => Promise<void>;
    removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
    
}

export const playlistStore = create<PlaylistStore>((set, get) => ({
    playlists: [],
    currentPlaylist: null,
    isLoading: false,
    error: null,
    
    fetchPlaylists: async () => {
        set({ isLoading: true, error: null });
        try {
            
            const response = await axiosInstance.get(`/playlists/user-playlists`);
            set({ playlists: response.data });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message });
            toast.error("Failed to fetch playlists");
        } finally {
            set({ isLoading: false });
        }
    },
    fetchPlaylistById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/playlists/${id}`);
            set({ currentPlaylist: response.data });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message });
            toast.error("Failed to fetch playlist");
        } finally {
            set({ isLoading: false });
        }
    },
    addSongToPlaylist: async (playlistId: string, songId: string) => {
        set({ isLoading: true, error: null });
        try {
           
            const response = await axiosInstance.post(
                `/playlists/${playlistId}/add-song`,
                { songId }
            );

            set({

                    playlists: get().playlists.map(playlist => 
                        playlist._id === playlistId ? response.data : playlist
                    )
                
            });
            
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message });
            toast.error("Failed to add song to playlist");
        } finally {
            set({ isLoading: false });
        }
    },
    removeSongFromPlaylist: async (playlistId: string, songId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post(
                `/playlists/${playlistId}/remove-song`,
                { songId }
            );

            set({
                playlists: get().playlists.map(playlist => 
                    playlist._id === playlistId ? response.data : playlist
                ),
                currentPlaylist: get().currentPlaylist?._id === playlistId 
                    ? response.data 
                    : get().currentPlaylist
            });
            toast.success("Song removed from playlist");
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message });
            toast.error("Failed to remove song from playlist");
        } finally {
            set({ isLoading: false });
        }
    }
    
}));
