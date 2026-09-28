"use client";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";

interface GoogleAuthButtonProps {
  onSuccess: (tokenResponse: { access_token: string }) => void | Promise<void>;
}

// Only ever mounted when NEXT_PUBLIC_GOOGLE_CLIENT_ID is actually set (see
// the login/signup pages' callers) — @react-oauth/google's useGoogleLogin()
// throws synchronously inside its own effect ("Missing required parameter
// client_id") when GoogleOAuthProvider's clientId is empty, which crashes
// whichever page called it, not just disables the button. Extracted into
// its own component specifically so the caller's guard unmounts this hook
// entirely instead of merely hiding a still-running one — same shape as
// lib/firebase.ts's guard on a missing Firebase config.
export function GoogleAuthButton({ onSuccess }: GoogleAuthButtonProps) {
  const googleLogin = useGoogleLogin({
    onSuccess,
    onError: () => alert("Login Failed"),
    flow: "implicit",
  });

  return (
    <div
      className="app-icon-border flex cursor-pointer items-center justify-center"
      onClick={() => googleLogin()}
    >
      <Image src="/images/google.png" alt="logo" width={24} height={24} />
    </div>
  );
}
