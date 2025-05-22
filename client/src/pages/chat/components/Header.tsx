import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatStore } from "@/stores/chatStore";

function Header() {
  const { selectedUser, onlineUsers } = chatStore();

	if (!selectedUser) return null;

	return (
		<div className='p-4 border-b border-zinc-800'>
			<div className='flex items-center gap-3'>
				<Avatar>
					<AvatarImage src={selectedUser.userImgUrl} />
					<AvatarFallback>{selectedUser.userName[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium'>{selectedUser.userName}</h2>
					<p className='text-sm text-zinc-400'>
						{onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
					</p>
				</div>
			</div>
		</div>
	);
}

export default Header
