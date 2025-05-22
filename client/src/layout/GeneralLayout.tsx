import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "./components/SidebarMenu";
import Player from "./components/Player";
import PlayerPanel from "./components/PlayerPanel";
import FriendsActivity from "./components/FriendsActivity";

function GeneralLayout() {
    const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile)
	}, []);

	return (
		<div className='h-screen bg-black text-white flex flex-col'>
			<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>

				<Player />
				
				<ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
					<SidebarMenu />
				</ResizablePanel>

				<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

				
				<ResizablePanel defaultSize={isMobile ? 80 : 60}>
					<Outlet />
				</ResizablePanel>

				{!isMobile && (
					<>
						<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

						{/* right sidebar */}
						<ResizablePanel defaultSize={20} minSize={0} maxSize={20} collapsedSize={0}>
							<FriendsActivity />
						</ResizablePanel>
					</>
				)}

				
			</ResizablePanelGroup>

			

			<PlayerPanel />
		</div>
	);
}

export default GeneralLayout
