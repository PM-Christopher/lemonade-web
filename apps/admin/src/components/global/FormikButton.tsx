"use client";
import React from "react";
import { ColorRing } from "react-loader-spinner";

interface FormikButtonProps {
  loading?: boolean;
  title?: string;
  error?: boolean;
  classes?: string | null;
  bgColor?: string | null;
  errorColor?: string | null;
}

export const FormikButton = ({
  loading = false,
  title = "Continue",
  error = true,
  classes = null,
  bgColor = null,
  errorColor = null,
}: FormikButtonProps) => {
  return (
    <button
      type="submit"
      className={`${
        classes === null
          ? "flex h-[48px] w-fit items-center justify-center rounded-xl px-[14px] py-[10px]"
          : classes
      } ${loading && "opacity-70"} ${bgColor && !error ? errorColor : bgColor} ${
        bgColor === null ? (!error ? "bg-mid-green" : "bg-gradient-green") : ""
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
