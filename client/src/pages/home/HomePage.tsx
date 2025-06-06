import Topbar from "@/components/Topbar"
import { ScrollArea } from "@/components/ui/scroll-area";
import DiscoverGrid from "@/layout/components/DiscoverGrid";
import RecentlyPlayedGrid from "@/layout/components/RecentlyPlayedGrid";

import SectionGrid from "@/layout/components/SectionGrid";
import { musicStore } from "@/stores/musicStore";
import { playerStore } from "@/stores/playerStore";

import { useEffect } from "react";

function HomePage() {
  const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchDiscoverSongs,
		fetchRecentlyPlayed,
		fetchFriendsSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		discoverSongs,
		recentlyPlayed,
		friendsSongs,
	} = musicStore();
	const { initializeQueue } = playerStore();
	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchDiscoverSongs();
		fetchRecentlyPlayed();
		fetchFriendsSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchDiscoverSongs, fetchRecentlyPlayed, fetchFriendsSongs]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && discoverSongs.length > 0 && recentlyPlayed.length > 0 && friendsSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...discoverSongs, ...recentlyPlayed, ...friendsSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, discoverSongs, featuredSongs, recentlyPlayed, friendsSongs]);

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Головна</h1>

					{recentlyPlayed.length > 0 &&
						<RecentlyPlayedGrid />
					}
					{discoverSongs.length > 0 &&
						<DiscoverGrid />
					}

					<div className='space-y-8'>
						<SectionGrid title='Для вас' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Схожі за авторами' songs={featuredSongs} isLoading={isLoading} />
						{friendsSongs.length > 0 &&
						<SectionGrid title='Ваші друзі слухають' songs={friendsSongs} isLoading={isLoading} />
						}
					</div>

				</div>
			</ScrollArea>
		</main>
	);
}

export default HomePage
