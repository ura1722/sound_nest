import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function AdminTopbar() {
  return (
		<div className='flex items-center justify-between mb-8'>
			<div className='flex items-center gap-3 '>
				<Link to='/' className='rounded-lg'>
					<img src='/logo.svg' className='size-12 text-black' />
				</Link>
				<div>
					<h1 className='text-3xl font-bold text-orange-400'>SoundNest</h1>
					<p className='text-zinc-400 mt-1'>Управління музикальним каталогом</p>
				</div>
			</div>
			<UserButton />
		</div>
	);
}

export default AdminTopbar
