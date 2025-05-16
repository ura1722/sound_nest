import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { musicStore } from "@/stores/musicStore";
import { Calendar, Library, Music, Trash2 } from "lucide-react";
import { useEffect } from "react";
import AddAlbumDialog from "./AddAlbumDialog";

function Albums() {
    const { albums, deleteAlbum, fetchAlbums } = musicStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);
  return (
		<Card className='bg-zinc-800/50 border-zinc-700/50'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Library className='h-5 w-5 text-violet-500' />
							Albums Library
						</CardTitle>
						<CardDescription>Manage your album collection</CardDescription>
					</div>
					<AddAlbumDialog />
				</div>
			</CardHeader>

			<CardContent>
				<Table>
                    <TableHeader>
                        <TableRow className='hover:bg-zinc-800/50'>
                            <TableHead className='w-[50px]'></TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Artist</TableHead>
                            <TableHead>Release Year</TableHead>
                            <TableHead>Songs</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {albums.map((album) => (
                            <TableRow key={album._id} className='hover:bg-zinc-800/50'>
                                <TableCell>
                                    <img src={album.albumImgUrl} alt={album.albumTitle} className='w-10 h-10 rounded object-cover' />
                                </TableCell>
                                <TableCell className='font-medium'>{album.albumTitle}</TableCell>
                                <TableCell>{album.albumAuthor}</TableCell>
                                <TableCell>
                                    <span className='inline-flex items-center gap-1 text-zinc-400'>
                                        <Calendar className='h-4 w-4' />
                                        {album.albumRelease}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className='inline-flex items-center gap-1 text-zinc-400'>
                                        <Music className='h-4 w-4' />
                                        {album.albumSongs.length} songs
                                    </span>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <div className='flex gap-2 justify-end'>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => deleteAlbum(album._id)}
                                            className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                        >
                                            <Trash2 className='h-4 w-4' />
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

export default Albums
