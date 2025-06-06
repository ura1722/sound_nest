import { useSignIn } from "@clerk/clerk-react";

export const useAuthGoogle = () => {
    const { signIn, isLoaded } = useSignIn();

    const signInGoogle = () => {
        if (!isLoaded || !signIn) {
            console.error("Clerk not loaded");
            return;
        }
        
        return signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/auth-callback",
        });
    };

    return { signInGoogle, isLoaded };
};
