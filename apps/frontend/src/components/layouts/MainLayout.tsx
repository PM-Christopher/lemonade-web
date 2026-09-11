"use client";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Image from "next/image";
import { setIsRouting } from "@/redux/tempSlice";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import {redirect, useRouter} from "next/navigation";
import {authSuccess, resetAuth} from "@/features/authentication/authSlice";
import {axiosInstance} from "@/lib/axiosInstane";
import TopNav from "@/components/navigation/TopNav";
import {useMediaQuery} from "react-responsive";
import BottomNav from "@/components/navigation/BottomNav";
import {useRefreshToken} from "@/hooks/useRefreshToken";

const MainLayout = ({children}: {children: React.ReactNode}) => {
    const isMobile = useMediaQuery({ query: "(max-width: 766px)" });
    const { admin } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies([
        "token",
        "adminAuthToken",
    ]);
    const token = cookies.token;

    useEffect(() => {
        dispatch(setIsRouting(false));
    }, []);

    // useEffect(() => {
    //     if (!token) {
    //         router.push("/login");
    //         removeCookie("token");
    //         dispatch(resetAuth());
    //     }
    // }, [token]);
    // if (!token) {
    //     removeCookie("token");
    //     dispatch(resetAuth());
    //     redirect("/login");
    // }

    // console.log(cookies)
    const verifyUserToken = async () => {
        try {
            const { data } = await axiosInstance.get(`/user/profile/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userDetails = data.data;
            dispatch(authSuccess(userDetails));
        } catch (error) {
            console.error("Error verifying user token:", error);
            console.log("working userdata  error>>>>>>");
        }
    };

    return (
        <div className="bg-light_grey pb-10 min-h-screen h-full overflow-hidden w-full">
            <TopNav/>
            {children}
            {
                isMobile && (
                    <BottomNav />
                )
            }
        </div>
    );
}

export default MainLayout;