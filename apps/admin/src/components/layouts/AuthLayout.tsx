import React, { useEffect, useLayoutEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { setIsRouting } from "@/redux/tempSlice";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["newToken", "token"]);
  const newToken = cookies.newToken;

  useLayoutEffect(() => {
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
  }, [pathname, newToken]);

  useEffect(() => {
    dispatch(setIsRouting(false));
  }, [dispatch]);
  return <div>{children}</div>;
};

export default AuthLayout;
