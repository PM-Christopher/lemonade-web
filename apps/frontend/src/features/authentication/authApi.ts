import type { useCookies } from "react-cookie";
import { axiosInstance } from "@/lib/axiosInstane";
import { authFailure, authStart, authSuccess, authUser, loadStop } from "./authSlice";
import { setIsRouting } from "@/redux/tempSlice";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { AppDispatch } from "@/redux/store";
import { routes } from "@/lib/routes";

type Navigate = { push: (to: string) => void };
type SetCookie = ReturnType<typeof useCookies<string>>[1];

interface LegacyApiError {
  response?: { data?: { message?: string } };
}

export const signup = async (
  values: Record<string, unknown>,
  dispatch: AppDispatch,
  navigate: Navigate,
  setCookie: SetCookie,
) => {
  dispatch(authStart());
  try {
    const { data } = await axiosInstance.post("/user/auth/register", { ...values });
    if (data.status || data.success) {
      dispatch(setIsRouting(true));
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Successful",
          type: "success",
        }),
      );

      setCookie("newToken", data.data.token, {
        path: "/",
        maxAge: 3600 * 6, // Expires after 6hrs
        sameSite: false,
      });
      await dispatch(authUser(data.data));
      navigate.push(routes.VERIFY_EMAIL);
    } else {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Error creating new account",
          type: "error",
        }),
      );
    }
  } catch (error) {
    const legacyError = error as LegacyApiError;
    dispatch(
      updateToastifyReducer({
        show: true,
        message: legacyError?.response?.data?.message || "Something went wrong. Please try again.",
        type: "error",
      }),
    );
    dispatch(authFailure());
  } finally {
    dispatch(loadStop());
  }
};

export const login = async (
  values: Record<string, unknown>,
  dispatch: AppDispatch,
  navigate: Navigate,
  setCookie: SetCookie,
  nextPath: string = "/",
) => {
  dispatch(authStart());

  try {
    const { data } = await axiosInstance.post("/user/auth/login", { ...values });

    if (data.status || data.success) {
      dispatch(setIsRouting(true));

      const user = data?.data?.user;

      // Keep the post-login `next` path through onboarding.
      const pushWithNext = (path: string) => {
        navigate.push(`${path}?next=${encodeURIComponent(nextPath)}`);
      };

      if (user.status == 0) {
        setCookie("newToken", data.data.token, {
          path: "/",
          maxAge: 3600 * 6,
          sameSite: false,
        });

        pushWithNext(routes.VERIFY_EMAIL);
      } else if (user.username === null) {
        setCookie("newToken", data.data.token, {
          path: "/",
          maxAge: 3600 * 6,
          sameSite: false,
        });

        pushWithNext(routes.PROFILE_SETUP);
      } else {
        setCookie("token", data.data.token, {
          path: "/",
          maxAge: 3600 * 6,
          sameSite: false,
        });

        setCookie("refresh_token", data.data.refresh_token, {
          path: "/",
          maxAge: 3600 * 24 * 7,
          sameSite: "lax",
        });

        dispatch(
          updateToastifyReducer({
            show: true,
            message: "successful",
            type: "success",
          }),
        );

        await dispatch(authSuccess(data.data));

        setTimeout(() => {
          // Go to the original destination, or home.
          navigate.push(nextPath || routes.HOME);
        }, 500);
      }
    } else {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Error trying to log in",
          type: "error",
        }),
      );
    }
  } catch (error) {
    const legacyError = error as LegacyApiError;
    dispatch(
      updateToastifyReducer({
        show: true,
        message: legacyError?.response?.data?.message || "Error trying to login",
        type: "error",
      }),
    );
    dispatch(authFailure());
  } finally {
    dispatch(loadStop());
  }
};
