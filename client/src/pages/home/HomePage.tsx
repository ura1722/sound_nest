import Topbar from "@/components/Topbar"
import { ScrollArea } from "@/components/ui/scroll-area";
import DiscoverGrid from "@/layout/components/DiscoverGrid";

import SectionGrid from "@/layout/components/SectionGrid";
import { musicStore } from "@/stores/musicStore";
import { playerStore } from "@/stores/playerStore";
import { useEffect } from "react";

function HomePage() {
  const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchDiscoverSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		discoverSongs,
	} = musicStore();
	const { initializeQueue } = playerStore();
	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchDiscoverSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchDiscoverSongs]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && discoverSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...discoverSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, discoverSongs, featuredSongs]);

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Home</h1>

					{discoverSongs.length > 0 &&
					<DiscoverGrid />
					}
					

					<div className='space-y-8'>
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Featured' songs={featuredSongs} isLoading={isLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
	);
}

export default HomePage
