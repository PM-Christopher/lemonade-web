"use client";
import { useNavigation } from "@/hooks/useNavigation";
import { ReactNode, useEffect } from "react";
import SideNav from "@/components/global/SideNav";
import TopNav from "@/components/global/TopNav";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

import { setIsRouting } from "@/redux/tempSlice";
import { authSuccess } from "@/features/authentication/authSlice";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { useMediaQuery } from "react-responsive";
import BottomNav from "../global/BottomNav";
import { routes } from "@/lib/routes";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Non-secret placeholder — see features/authentication/mutations.ts for why
// this exists instead of a real token.
const SESSION_MARKER = "session";

const MainLayout = ({ children }: DashboardLayoutProps) => {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setIsRouting(false));
  }, [dispatch]);

  // The single source of truth for "who is logged in" — replaces a
  // client-side check of the OLD, JS-readable "token" cookie. Route
  // protection at the edge already happens in middleware.ts against the
  // real httpOnly cookie; this is the belt-and-suspenders client-side
  // check plus the source for `state.auth.user`.
  const { isSuccess, isError, data: currentAdmin } = useCurrentAdminQuery({ enabled: !user });

  useEffect(() => {
    if (isSuccess && currentAdmin) {
      dispatch(authSuccess({ admin: currentAdmin, token: SESSION_MARKER }));
    }
  }, [isSuccess, currentAdmin, dispatch]);

  useEffect(() => {
    if (isError && !user) {
      push(routes.LOGIN);
    }
  }, [isError, user, push]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar stays put; its menu scrolls on its own. */}
      {!isMobile && <SideNav />}

      <main className="bg-light-grey flex h-full min-w-0 flex-1 flex-col">
        <TopNav />

        {/* Only the content scrolls. */}
        <div className={`min-h-0 flex-1 overflow-y-auto ${isMobile ? "pb-16" : ""}`}>
          {children}
        </div>

        {isMobile && (
          <div className="overflow-x-auto whitespace-nowrap">
            <BottomNav />
          </div>
        )}
      </main>
    </div>
  );
};

export default MainLayout;
