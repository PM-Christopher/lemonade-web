"use client";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { images } from "@/lib/images";

interface GoogleAuthButtonProps {
  onSuccess: (tokenResponse: { access_token: string }) => void | Promise<void>;
}

// Mount only when NEXT_PUBLIC_GOOGLE_CLIENT_ID is set — an empty client id crashes the hook.
export function GoogleAuthButton({ onSuccess }: GoogleAuthButtonProps) {
  const googleLogin = useGoogleLogin({
    onSuccess,
    onError: () => alert("Login Failed"),
    flow: "implicit",
  });

  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2"
      onClick={() => googleLogin()}
    >
      <span className="border-border-grey flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border bg-white">
        <Image src={images.GOOGLE} alt="" width={24} height={24} />
      </span>
      <span className="text-meta text-text-grey">Google</span>
    </button>
  );
}
