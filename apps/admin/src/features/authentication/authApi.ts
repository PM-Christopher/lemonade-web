import type { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axiosInstane";
import { authFailure, authStart, authSuccess, loadStop } from "./authSlice";
import { setIsRouting } from "@/redux/tempSlice";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { AppDispatch } from "@/redux/store";

interface LoginValues {
  email: string;
  password: string;
}

type SetCookie = (name: string, value: string, options?: Record<string, unknown>) => void;

export const login = async (
  values: LoginValues,
  dispatch: AppDispatch,
  router: ReturnType<typeof useRouter>,
  setCookie: SetCookie,
) => {
  dispatch(authStart());
  try {
    const { data } = await axiosInstance.post("/admin/auth/login", { ...values });
    if (data.status || data.success) {
      dispatch(setIsRouting(true));
      dispatch(setIsRouting(true));
      if (data.data.admin.status == 0) {
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
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "successful",
            type: "success",
          }),
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
          message: data.message || "error",
          type: "error",
        }),
      );
    }
  } catch {
    dispatch(
      updateToastifyReducer({
        show: true,
        message: "Something went wrong. Please try again.",
        type: "error",
      }),
    );
    dispatch(authFailure());
  } finally {
    dispatch(loadStop());
  }
};
