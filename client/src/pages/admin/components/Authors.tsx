import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { musicStore } from "@/stores/musicStore";
import { Author } from "@/types";
import { Calendar, Mic2, Trash2 } from "lucide-react";
import AddAuthorDialog from "./AddAuthorDialog";
import { useState } from "react";
import EditAuthorDialog from "./EditAuthorDialog";



function Authors() {
    const { authors, isLoading, error, deleteAuthor } = musicStore();
     const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-8'>
                <div className='text-zinc-400'>Loading authors...</div>
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
                            <Mic2 className='size-5 text-orange-500' />
                            Автори
                        </CardTitle>
                        
                    </div>
                    <AddAuthorDialog />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className='hover:bg-zinc-800/50'>
                            <TableHead className='w-[50px]'></TableHead>
                            <TableHead>Ім'я</TableHead>
                            <TableHead>Жанри</TableHead>
                            <TableHead>Активні десятиліття</TableHead>
                            <TableHead className='text-right'>Дії</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {authors.map((author: Author) => (
                            <TableRow key={author._id} className='hover:bg-zinc-800/50' onClick={() => setEditingAuthor(author)}>
                                <TableCell>
                                    <img 
                                        src={author.imageUrl} 
                                        alt={author.name} 
                                        className='size-10 rounded-full object-cover' 
                                    />
                                </TableCell>
                                <TableCell className='font-medium'>{author.name}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {author.genres?.slice(0, 3).map(genre => (
                                            <span 
                                                key={genre} 
                                                className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                        {author.genres?.length > 3 && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300">
                                                +{author.genres.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className='inline-flex items-center gap-1 text-zinc-400'>
                                        <Calendar className='h-4 w-4' />
                                        {author.decades?.length ? author.decades.join(', ') : 'N/A'}
                                    </span>
                                </TableCell>

                                <TableCell className='text-right'>
                                    <div className='flex gap-2 justify-end'>
                                        <Button
                                            variant={"ghost"}
                                            size={"sm"}
                                            className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                            onClick={() => deleteAuthor(author._id)}
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
            {editingAuthor && (
                <EditAuthorDialog
                    author={editingAuthor}
                    onClose={() => setEditingAuthor(null)}
                />
            )}
        </Card>
    );
}

export default Authors
