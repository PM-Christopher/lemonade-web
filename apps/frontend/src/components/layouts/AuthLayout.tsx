import React, { useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { setIsRouting } from "@/redux/tempSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";

const HEADER_ACTION: Record<string, { href: string; label: string } | null> = {
  "/login": { href: "/signup", label: "Sign up" },
  "/signup": { href: "/login", label: "Login" },
  "/verify-email": { href: "/login", label: "Login" },
  "/verify-code": { href: "/login", label: "Login" },
  "/forgot-password": { href: "/login", label: "Login" },
  "/reset-password": { href: "/login", label: "Login" },
  "/profile-setup": null,
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["newToken", "token"]);
  const newToken = cookies.newToken;
  const token = cookies.token;

  useLayoutEffect(() => {
    if (token) {
      redirect("/");
      return;
    }
    if (!newToken) {
      const isAuthRoute =
        pathname === "/signup" ||
        pathname === "/login" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password";
      if (!isAuthRoute) {
        redirect("/login");
      }
    }
  }, [pathname, newToken, token]);

  useEffect(() => {
    dispatch(setIsRouting(false));
  }, [dispatch]);

  const action = HEADER_ACTION[pathname];
  const surface =
    pathname === "/profile-setup"
      ? "bg-white tablet:bg-gradient-light-green"
      : "bg-gradient-light-green";

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <section className={`${surface} flex h-dvh max-h-dvh flex-col overflow-hidden`}>
        <header className="phone:px-10 static flex shrink-0 items-center justify-between px-4 py-3">
          <Link href="/login">
            <Image
              src="/images/logo.png"
              alt="The Lemonade Network"
              width={127}
              height={56}
              priority
              className="phone:h-12 h-8 w-auto"
            />
          </Link>
          {action ? (
            <Link href={action.href} className="btn-quiet text-primary-black text-body-s font-sans">
              {action.label}
            </Link>
          ) : null}
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
          <div className="mx-auto my-auto w-full">{children}</div>
        </div>
      </section>
    </GoogleOAuthProvider>
  );
};

export default AuthLayout;
