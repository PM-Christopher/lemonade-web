import { axiosInstance } from "@/lib/axiosInstane";
import {
    authFailure,
    authStart,
    authSuccess, authUser,
    loadStop,
} from "./authSlice";
import { getTempError, setIsRouting, updateProperty } from "@/redux/tempSlice";
import {updateToastifyReducer} from "@/redux/toastifySlice";

export const signup = async (
    values: any,
    dispatch: any,
    router: any,
    setCookie: any
) => {
    dispatch(authStart());
    try {
        const { data } = await axiosInstance.post("/auth/register", { ...values });
        if (data.status || data.success) {
            dispatch(setIsRouting(true));
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Successful",
                    type: "success",
                })
            );

            setCookie("newToken", data.data.token, {
                path: "/",
                maxAge: 3600 * 6, // Expires after 6hrs
                sameSite: false,
            });
            await dispatch(authUser(data.data));
            router.push("/verify-email");
        } else {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Error creating new account",
                    type: "error",
                })
            );
        }
    } catch (error: any) {
        dispatch(
            updateToastifyReducer({
                show: true,
                message: error?.response?.data?.message || "Something went wrong. Please try again.",
                type: "error",
            })
        );
        dispatch(authFailure());
    }  finally {
        dispatch(loadStop());
    }
}

export const login = async (
    values: any,
    dispatch: any,
    router: any,
    setCookie: any
) => {
    dispatch(authStart());
    try {
        const { data } = await axiosInstance.post("/auth/login", { ...values });
        if (data.status || data.success) {
            dispatch(setIsRouting(true));
            dispatch(setIsRouting(true));
            const user = data?.data?.user
            if (user.status == 0) {
                setCookie("newToken", data.data.token, {
                    path: "/",
                    maxAge: 3600 * 6, // Expires after 6hrs
                    sameSite: false,
                    // domain: env === 'development' ? '' : ''
                });
                router.push("/verify-email");
            } else if(user.username === null) {
                setCookie("newToken", data.data.token, {
                    path: "/",
                    maxAge: 3600 * 6, // Expires after 6hrs
                    sameSite: false,
                    // domain: env === 'development' ? '' : ''
                });
                router.push("/profile-setup");
            } else {
                setCookie("token", data.data.token, {
                    path: "/",
                    maxAge: 3600 * 6, // Expires after 6hrs
                    sameSite: false,
                });
                setCookie("refresh_token", data.data.refresh_token, {
                    path: "/",
                    maxAge: 3600 * 24 * 7, // 7 days for a refresh token
                    sameSite: "Lax",
                });
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "successful",
                        type: "success",
                    })
                );
                await dispatch(authSuccess(data.data));
                setTimeout(() => {
                    router.push("/");
                }, 500);
            }
        } else {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Error trying to log in",
                    type: "error",
                })
            );
        }
    } catch (error: any) {
        console.log(error);
        dispatch(
            updateToastifyReducer({
                show: true,
                message: error?.response?.data?.message || "Error trying to login",
                type: "error",
            })
        );
        dispatch(authFailure());
    }  finally {
        dispatch(loadStop());
    }
}

