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
    let timer: any;
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
    if (showToast.message) {
      if (showToast.type === "success") {
        toast.success(showToast.message);
      } else {
        toast.error(showToast.message);
      }
    }
  }, [showToast]);

  return showToast.show ? (
    <div className="fixed top-10 left-0 w-full" style={{ zIndex: 99999 }}>
      <div className="tablet:mx-auto tablet:w-[872px] z-100 w-full px-5">
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 5000,
            style: {
              background: "#BFDF37",
              color: "#fff",
              width: "100%",
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
    </div>
  ) : null;
};
