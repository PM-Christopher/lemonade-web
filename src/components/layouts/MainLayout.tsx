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

const MainLayout = ({children}: {children: React.ReactNode}) => {
    const { admin, authToken: token } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies([
        "token",
        "adminAuthToken",
    ]);


    useEffect(() => {
        dispatch(setIsRouting(false));
    }, []);

    useEffect(() => {
        if (!token) {
            router.push("/login");
            removeCookie("token");
            dispatch(resetAuth());
        }
    }, [token]);
    if (!token) {
        removeCookie("token");
        dispatch(resetAuth());
        redirect("/login");
    }

    const verifyUserToken = async () => {
        try {
            // Replace with your actual verification API endpoint URL
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`;
            const { data } = await axiosInstance.get(url, {
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
        <div>
            {children}
        </div>
    );
}

export default MainLayout;