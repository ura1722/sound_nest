import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatStore } from "@/stores/chatStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users, Trash2 } from "lucide-react";
import { useEffect } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import toast from "react-hot-toast";

function FriendsActivity() {
  const { users, fetchUsers, onlineUsers, userActivities, removeFriend } = chatStore();
  const { user } = useUser();
  

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriend(friendId);
      toast.success("Friend removed successfully");
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend");
    }
  };

  return (
    <div className='h-full bg-zinc-900 rounded-lg flex flex-col'>
      <div className='p-4 flex justify-between items-center border-b border-zinc-800'>
        <div className='flex items-center gap-2'>
          <Users className='size-5 shrink-0' />
          <h2 className='font-semibold'>Ваші друзі слухають</h2>
        </div>
      </div>

      {!user && <LoginPrompt />}

      <ScrollArea className='flex-1'>
        <div className='p-4 space-y-4'>
          {users.map((user) => {
            const activity = userActivities.get(user.clerkId);
            const isPlaying = activity && activity !== "Idle";

            return (
              <ContextMenu key={user._id}>
                <ContextMenuTrigger>
                  <div
                    className='cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group'
                    
                  >
                    <div className='flex items-start gap-3'>
                      <div className='relative'>
                        <Avatar className='size-10 border border-zinc-800'>
                          <AvatarImage src={user.userImgUrl} alt={user.userName} />
                          <AvatarFallback>{user.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
                            ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"}
                            `}
                          aria-hidden='true'
                        />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium text-sm text-white'>{user.userName}</span>
                          {isPlaying && <Music className='size-3.5 text-orange-400 shrink-0' />}
                        </div>

                        {isPlaying ? (
                          <div className='mt-1'>
                            <div className='mt-1 text-sm text-orange-400 font-medium truncate'>
                              {activity}
                            </div>
                          </div>
                        ) : (
                          <div className='mt-1 text-xs text-zinc-400'>Idle</div>
                        )}
                      </div>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-40 bg-zinc-900 border-zinc-700">
                  <ContextMenuItem 
                    onClick={() => handleRemoveFriend(user._id)}
                    className="text-red-500 hover:bg-zinc-800 focus:text-red-500 focus:bg-zinc-800"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Видалити з друзів
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default FriendsActivity;

const LoginPrompt = () => (
  <div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
    <div className='relative'>
      <div
        className='absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full blur-lg
       opacity-75 animate-pulse'
        aria-hidden='true'
      />
      <div className='relative bg-zinc-900 rounded-full p-4'>
        <HeadphonesIcon className='size-8 text-orange-400' />
      </div>
    </div>

    <div className='space-y-2 max-w-[250px]'>
      <h3 className='text-lg font-semibold text-white'>Дивіться що слухають ваші друзі</h3>
      <p className='text-sm text-zinc-400'>Ввійдіть у свій аккаунт щоб знати що слухають ваші друзі</p>
    </div>
  </div>
);
