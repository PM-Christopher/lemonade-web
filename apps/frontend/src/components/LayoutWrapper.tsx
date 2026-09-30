"use client";
import { AlertMessage } from "@/components/global/AlertMessage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useSelector } from "react-redux";
import { usePusher } from "@/hooks/usePusher";
import { Toaster } from "react-hot-toast";
import "@/app/globals.css";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: any) => state.auth);
  usePusher(user?.id ? `request.${user.id}` : null, "request.service");
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
      <AlertMessage />
    </GoogleOAuthProvider>
  );
};

export default LayoutWrapper;
