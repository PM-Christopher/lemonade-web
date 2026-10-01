"use client";
import React, { useEffect } from "react";
import { setIsRouting } from "@/redux/tempSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { authSuccess } from "@/features/authentication/authSlice";
import { useCurrentUserQuery } from "@/features/authentication/queries";
import TopNav from "@/components/navigation/TopNav";
import { useMediaQuery } from "react-responsive";
import BottomNav from "@/components/navigation/BottomNav";

// Non-secret placeholder — see features/authentication/mutations.ts for why
// this exists instead of a real token.
const SESSION_MARKER = "session";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 766px)" });
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setIsRouting(false));
  }, [dispatch]);

  // The single source of truth for "who is logged in" — replaces a
  // verifyUserToken function that used to sit here unused (no effect
  // ever called it). This one actually runs, and the httpOnly cookie
  // rides along automatically; there's no token to read or attach here.
  const { data: currentUser, isSuccess } = useCurrentUserQuery({ enabled: !user });

  useEffect(() => {
    if (isSuccess && currentUser) {
      dispatch(authSuccess({ user: currentUser, token: SESSION_MARKER }));
    }
  }, [isSuccess, currentUser, dispatch]);

  return (
    <div className="bg-light_grey min-h-screen w-full pb-10">
      <TopNav />
      {children}
      {isMobile && <BottomNav />}
    </div>
  );
};

export default MainLayout;
