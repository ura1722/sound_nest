import { musicStore } from "@/stores/musicStore";
import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";
import StatCard from "./StatCard";

function Dashboard() {
  const { stats } = musicStore();

	const statsData = [
		{
			icon: ListMusic,
			label: "Всього пісень",
			value: stats.totalSongs.toString(),
			bgColor: "bg-emerald-500/10",
			iconColor: "text-emerald-500",
		},
		{
			icon: Library,
			label: "Всього альбомів",
			value: stats.totalAlbums.toString(),
			bgColor: "bg-violet-500/10",
			iconColor: "text-violet-500",
		},
		{
			icon: Users2,
			label: "Всього авторів",
			value: stats.totalAuthors.toString(),
			bgColor: "bg-orange-500/10",
			iconColor: "text-orange-500",
		},
		{
			icon: PlayCircle,
			label: "Всього користувачів",
			value: stats.totalUsers.toLocaleString(),
			bgColor: "bg-sky-500/10",
			iconColor: "text-sky-500",
		},
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 '>
			{statsData.map((stat) => (
				<StatCard
					key={stat.label}
					icon={stat.icon}
					label={stat.label}
					value={stat.value}
					bgColor={stat.bgColor}
					iconColor={stat.iconColor}
				/>
			))}
		</div>
	);
}

export default Dashboard
