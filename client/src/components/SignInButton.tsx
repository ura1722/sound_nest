
import { Button } from "./ui/button"
import { useAuthGoogle } from "@/hooks/useAuth";

function SignInButton() {
    const { signInGoogle, isLoaded } = useAuthGoogle();

    if (!isLoaded) {
        return null;
    }
    
    return (
        <Button 
            onClick={signInGoogle} 
            variant={"secondary"} 
            className='w-full text-white border-zinc-200 h-11'
        >
            Continue with Google
        </Button>
    );
}

export default SignInButton
