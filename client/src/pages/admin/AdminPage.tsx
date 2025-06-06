import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authStore } from "@/stores/authStore";
import { musicStore } from "@/stores/musicStore";
import { Album, Music, Users } from "lucide-react";
import { useEffect } from "react";
import AdminTopbar from "./components/AdminTopbar";
import Dashboard from "./components/Dashboard";
import Songs from "./components/Songs";
import Albums from "./components/Albums";
import Authors from "./components/Authors";

function AdminPage() {
  const { isAdmin, isLoading } = authStore();

	const { fetchAlbums, fetchSongs, fetchStats, fetchAuthors } = musicStore();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
		fetchAuthors();
	}, [fetchAlbums, fetchSongs, fetchStats, fetchAuthors]);

	if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

	return (
		<div
			className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8'
		>
			<AdminTopbar />

			<Dashboard />

			<Tabs defaultValue='songs' className='space-y-6'>
				<TabsList className='p-1 bg-zinc-800/50'>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
						<Music className='mr-2 size-4' />
						Пісні
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
						<Album className='mr-2 size-4' />
						Альбоми
					</TabsTrigger>
					<TabsTrigger value='authors' className='data-[state=active]:bg-zinc-700'>
						<Users className='mr-2 size-4' />
						Автори
					</TabsTrigger>
				</TabsList>

				<TabsContent value='songs'>
					<Songs/>
				</TabsContent>
				<TabsContent value='albums'>
					<Albums/>
				</TabsContent>
				<TabsContent value='authors'>
					<Authors/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default AdminPage
