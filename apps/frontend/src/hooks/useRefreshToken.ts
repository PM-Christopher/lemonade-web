import {useRef, useCallback, useEffect} from "react";
import {axiosInstance} from "@/lib/axiosInstane";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie"

export const useRefreshToken = () => {
    const isRefreshing = useRef(false);
    const [cookie, setCookie] = useCookies(["token"]);

    const refreshAccessToken = useCallback(async () => {
        if (isRefreshing.current) return

        isRefreshing.current = true
        try {
            console.log({here: "here"})
            const res = await axiosInstance.post('/auth/refresh', {
                refresh_token: Cookies.get("refresh_token"),
            })
            const {token} = res?.data?.data


            if(!token) throw new Error(("No access token provided"));

            Cookies.set("token", token, { expires: 1 / 96, sameSite: "Lax" });
        }
        catch(err) {
            console.log({err})
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