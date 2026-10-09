import type { useCookies } from "react-cookie";
import type { SignUpRequest } from "@lemonade/api-types/generated";
import { authApi } from "./api";
import { authFailure, authStart, authUser, loadStop } from "./authSlice";
import { setIsRouting } from "@/redux/tempSlice";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { AppDispatch } from "@/redux/store";
import { routes } from "@/lib/routes";
import { ONBOARDING_TOKEN_COOKIE } from "@/lib/cookie-names";
import { errorMessage } from "@/lib/api-error";

type Navigate = { push: (to: string) => void };
type SetCookie = ReturnType<typeof useCookies<string>>[1];

/** Creates the account, stores the onboarding token, then sends the user to verify their email. */
export const signup = async (
  values: SignUpRequest,
  dispatch: AppDispatch,
  navigate: Navigate,
  setCookie: SetCookie,
) => {
  dispatch(authStart());
  try {
    const result = await authApi.register(values);
    dispatch(setIsRouting(true));
    dispatch(updateToastifyReducer({ show: true, message: "Successful", type: "success" }));

    setCookie(ONBOARDING_TOKEN_COOKIE, result.token, {
      path: "/",
      maxAge: 3600 * 6,
      sameSite: "lax",
    });
    dispatch(authUser(result));
    // Full navigation so the onboarding cookie is on the next document request.
    if (typeof window !== "undefined") {
      window.location.assign(routes.VERIFY_EMAIL);
      return;
    }
    navigate.push(routes.VERIFY_EMAIL);
  } catch (error) {
    dispatch(
      updateToastifyReducer({
        show: true,
        message: errorMessage(error, "Something went wrong. Please try again."),
        type: "error",
      }),
    );
    dispatch(authFailure());
  } finally {
    dispatch(loadStop());
  }
};
