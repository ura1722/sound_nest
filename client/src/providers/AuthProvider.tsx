
import { axiosInstance } from "@/lib/axios"
import { authStore } from "@/stores/authStore";
import { useAuth } from "@clerk/clerk-react"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"

const updateApiToken = (token: string | null) => {
	if (token){
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } 
	else {
        delete axiosInstance.defaults.headers.common["Authorization"]
    }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken } = useAuth()
	const [loading, setLoading] = useState(true)
	const {checkIfAdmin} = authStore()

	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = await getToken()
				updateApiToken(token)

				if (token){
					await checkIfAdmin()
				}
				
			} catch (error: any) {
				updateApiToken(null)
				console.log("Error in auth provider", error)
			} finally {
				setLoading(false)
			}
		}

		initAuth()

	
		
	}, [getToken, checkIfAdmin])

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-10 text-orange-500 animate-spin' />
			</div>
		);

	return <>{children}</>
};
export default AuthProvider
