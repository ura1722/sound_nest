import {  SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInButton from "./SignInButton";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { authStore } from "@/stores/authStore";


function Topbar() {
    const {isAdmin} = authStore()
	
    return (
        <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75   backdrop-blur-md z-10'>
			<div className='flex gap-2 items-center text-orange-400'>
				<img src='/logo.svg' className='size-9' alt='Logo' />
				SoundNest
			</div>
            <div className='flex items-center gap-4'>
				{isAdmin && (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
						<LayoutDashboardIcon className='size-4  mr-2' />
						Admin Dashboard
					</Link>
				)}

                

				<SignedOut>
					<SignInButton/>
				</SignedOut>

				<UserButton />
			</div>
			
		</div>
    );
}

export default Topbar;
