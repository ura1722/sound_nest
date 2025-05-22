import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { musicStore } from "@/stores/musicStore";
import { Song } from "@/types";
import { Calendar, Music, Trash2 } from "lucide-react";
import AddSongDialog from "./AddSongDialog";

function Songs() {
    const { songs, isLoading, error, deleteSong } = musicStore();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>Loading songs...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-400'>{error}</div>
			</div>
		);
	}
  return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Music className='size-5 text-emerald-500' />
							Songs Library
						</CardTitle>
						<CardDescription>Manage your music tracks</CardDescription>
					</div>
					<AddSongDialog/>
				</div>
			</CardHeader>
			<CardContent>
				<Table>
                    <TableHeader>
                        <TableRow className='hover:bg-zinc-800/50'>
                            <TableHead className='w-[50px]'></TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Artist</TableHead>
                            <TableHead>Release Date</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {songs.map((song: Song) => (
                            <TableRow key={song._id} className='hover:bg-zinc-800/50'>
                                <TableCell>
                                    <img src={song.songImgUrl} alt={song.songTitle} className='size-10 rounded object-cover' />
                                </TableCell>
                                <TableCell className='font-medium'>{song.songTitle}</TableCell>
                                <TableCell>{song.songAuthor?.name}</TableCell>
                                <TableCell>
                                    <span className='inline-flex items-center gap-1 text-zinc-400'>
                                        <Calendar className='h-4 w-4' />
                                        {song.createdAt.split("T")[0]}
                                    </span>
                                </TableCell>

                                <TableCell className='text-right'>
                                    <div className='flex gap-2 justify-end'>
                                        <Button
                                            variant={"ghost"}
                                            size={"sm"}
                                            className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                            onClick={() => deleteSong(song._id)}
                                        >
                                            <Trash2 className='size-4' />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
			</CardContent>
		</Card>
	);
}

export default Songs
