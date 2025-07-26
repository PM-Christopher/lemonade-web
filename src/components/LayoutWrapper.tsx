'use client'
import {AlertMessage} from "@/components/global/AlertMessage";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {useRefreshToken} from "@/hooks/useRefreshToken";
import {useEffect} from "react";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            {children}
            <AlertMessage />
        </GoogleOAuthProvider>
    );
};

export default LayoutWrapper;