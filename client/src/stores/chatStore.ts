import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { io } from "socket.io-client";
import { Message, User } from "@/types";

interface ChatStore {
	users: User[];
    currentUser:  string;
    
	isLoading: boolean;
	error: string | null;
	socket: any;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;


    removeFriend: (friendId: string) => Promise<void>;
	fetchUsers: () => Promise<void>;
    fetchCurrentUser: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
    addFriend: (userId: string) => Promise<void>;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
	autoConnect: false, // only connect if user is authenticated
	withCredentials: true,
});

export const chatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
    currentUser: "",
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,

    fetchCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      set({ currentUser: response.data });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },
    removeFriend: async (userId: string) => {
    try {
      await axiosInstance.delete(`/users/delete-friend/${userId}`);
      // Оновити список друзів після додавання
      const response = await axiosInstance.get('/users/friends');
      set({ users: response.data });
    } catch (error) {
      console.error("Error adding friend:", error);
      throw error;
    }
  },
	setSelectedUser: (user) => set({ selectedUser: user }),
    addFriend: async (userId: string) => {
    try {
      await axiosInstance.post(`/users/add-friend`, { friendId: userId });
      // Оновити список друзів після додавання
      const response = await axiosInstance.get('/users/friends');
      set({ users: response.data });
    } catch (error) {
      console.error("Error adding friend:", error);
      throw error;
    }
  },
	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users/friends");
			set({ users: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	initSocket: (userId) => {
		if (!get().isConnected) {
			socket.auth = { userId };
			socket.connect();

			socket.emit("user_connected", userId);

			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("receive_message", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("message_sent", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},

	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: async (receiverId, senderId, content) => {
		const socket = get().socket;
		if (!socket) return;

		socket.emit("send_message", { receiverId, senderId, content });
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/users/messages/${userId}`);
			set({ messages: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
