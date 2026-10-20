"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { setIsRouting } from "@/redux/tempSlice";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname, replace } = useNavigation();
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["newToken", "token"]);
  const newToken = cookies.newToken;

  useEffect(() => {
    if (!newToken) {
      const isAuthRoute =
        pathname === routes.LOGIN ||
        pathname === routes.FORGOT_PASSWORD ||
        pathname === routes.VERIFY_CODE ||
        pathname === routes.RESET_PASSWORD;
      if (!isAuthRoute) {
        replace(routes.LOGIN);
      }
    }
  }, [pathname, newToken, replace]);

  useEffect(() => {
    dispatch(setIsRouting(false));
  }, [dispatch]);

  return <div>{children}</div>;
};

export default AuthLayout;
