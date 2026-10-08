"use client";
import { AlertMessage } from "@/components/global/AlertMessage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { usePusher } from "@/hooks/usePusher";
import { useAuthReady } from "@/hooks/useAuthReady";
import { isAuthPath } from "@/lib/auth-paths";
import "@/app/globals.css";
import type { RootState } from "@/redux/store";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const authReady = useAuthReady();
  const { user } = useSelector((state: RootState) => state.auth);

  // Skip private realtime on auth pages and before the client is ready.
  const realtimeChannel =
    authReady && !isAuthPath(pathname) && user?.id ? `request.${user.id}` : null;

  usePusher(realtimeChannel, "request.service");

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
      <AlertMessage />
    </GoogleOAuthProvider>
  );
};

export default LayoutWrapper;
