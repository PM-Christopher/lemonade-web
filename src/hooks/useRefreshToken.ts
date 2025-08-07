import {useRef, useCallback, useEffect} from "react";
import {axiosInstance} from "@/lib/axiosInstane";
import { useCookies } from "react-cookie";

export const useRefreshToken = () => {
    const isRefreshing = useRef(false);
    const [cookie, setCookie] = useCookies(["token"]);

    const refreshAccessToken = useCallback(async () => {
        if (isRefreshing.current) return

        isRefreshing.current = true
        try {
            const res = await axiosInstance.post('/auth/refresh', {})
            // console.log({res})
            const {access_token} = res.data


            if(!access_token) throw new Error(("No access token provided"));

            setCookie("token", access_token, {
                path: "/",
                maxAge: 3600 * 6, // Expires after 6hrs
                sameSite: false,
            });
        }
        catch(err) {
            // console.log({err})
            // window.location.href = "/login";
        } finally {
            isRefreshing.current = false
        }
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            // console.log('TRIGGERED!!!')
            refreshAccessToken();
        }, 60 * 1000)
        return () => clearInterval(interval)
    }, [refreshAccessToken])

    return { refreshAccessToken }
}