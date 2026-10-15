"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { toast, Toaster } from "react-hot-toast";
import { RootState } from "@/redux/store";

export const AlertMessage = () => {
  const dispatch = useDispatch();
  const { showToast } = useSelector((s: RootState) => s.toast);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (showToast.show) {
      timer = setTimeout(() => {
        dispatch(
          updateToastifyReducer({
            show: false,
            type: "success",
            message: "No message.",
          }),
        );
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showToast, dispatch]);

  useEffect(() => {
    // The reset after the timer clears `show`; it must not raise a toast of its own.
    if (showToast.show && showToast.message) {
      if (showToast.type === "success") {
        toast.success(showToast.message);
      } else {
        toast.error(showToast.message);
      }
    }
  }, [showToast]);

  return showToast.show ? (
    <div className="fixed top-4 right-4 z-[99999] w-auto max-w-sm">
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#BFDF37",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: "red",
              secondary: "white",
            },
          },
        }}
      />
    </div>
  ) : null;
};
