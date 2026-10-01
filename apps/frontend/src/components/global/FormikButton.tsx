"use client";
import React from "react";
import { ColorRing } from "react-loader-spinner";
import { useAppSelector } from "@/redux/hook";

export const FormikButton = ({
  loading = false,
  title = "Continue",
  error = true,
  classes = null,
  bgColor = null,
  errorColor = null,
}: any) => {
  const { isRouting } = useAppSelector((state: any) => state.temp);
  return (
    <button
      type="submit"
      className={`${
        classes === null
          ? "flex h-12 w-fit items-center justify-center rounded-xl px-3.5 py-2.5"
          : classes
      } ${loading && "opacity-70"} ${bgColor && !error ? errorColor : bgColor} ${
        bgColor === null ? (!error ? "bg-mid-green" : "bg-gradient-green") : ""
      } ${loading && "bg-light-green cursor-not-allowed opacity-70"} ${
        !error && "cursor-not-allowed"
      } `}
      disabled={loading || !error}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <ColorRing
            visible={true}
            height="30"
            width="30"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
        <span className="font-sans font-semibold text-white">{title}</span>
      )}
    </button>
  );
};
