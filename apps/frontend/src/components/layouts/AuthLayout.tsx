"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { setIsRouting } from "@/redux/tempSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";
import { useNavigation } from "@/hooks/useNavigation";

const HEADER_ACTION: Record<string, { href: string; label: string } | null> = {
  [routes.LOGIN]: { href: routes.SIGNUP, label: "Sign up" },
  [routes.SIGNUP]: { href: routes.LOGIN, label: "Login" },
  [routes.VERIFY_EMAIL]: { href: routes.LOGIN, label: "Login" },
  [routes.VERIFY_CODE]: { href: routes.LOGIN, label: "Login" },
  [routes.FORGOT_PASSWORD]: { href: routes.LOGIN, label: "Login" },
  [routes.RESET_PASSWORD]: { href: routes.LOGIN, label: "Login" },
  [routes.PROFILE_SETUP]: null,
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname, replace } = useNavigation();
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["newToken", "token"]);
  const newToken = cookies.newToken;
  const token = cookies.token;

  useEffect(() => {
    if (token) {
      replace(routes.HOME);
      return;
    }
    if (!newToken) {
      const isAuthRoute =
        pathname === routes.SIGNUP ||
        pathname === routes.LOGIN ||
        pathname === routes.FORGOT_PASSWORD ||
        pathname === routes.RESET_PASSWORD;
      if (!isAuthRoute) {
        replace(routes.LOGIN);
      }
    }
  }, [pathname, newToken, token, replace]);

  useEffect(() => {
    dispatch(setIsRouting(false));
  }, [dispatch]);

  const action = HEADER_ACTION[pathname];
  const surface =
    pathname === routes.PROFILE_SETUP
      ? "bg-white tablet:bg-gradient-light-green"
      : "bg-gradient-light-green";

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <section className={`${surface} flex h-dvh max-h-dvh flex-col overflow-hidden`}>
        <header className="phone:px-10 static flex shrink-0 items-center justify-between px-4 py-3">
          <Link href={routes.LOGIN}>
            <Image
              src={images.LOGO}
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
        {/* Extra bottom padding so the form block clears the viewport edge (Figma). */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-4 pb-10">
          <div className="mx-auto my-auto w-full">{children}</div>
        </div>
      </section>
    </GoogleOAuthProvider>
  );
};

export default AuthLayout;
