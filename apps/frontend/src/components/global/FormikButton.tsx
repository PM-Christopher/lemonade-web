"use client";
import React, { lazy, Suspense } from "react";

const ColorRing = lazy(() =>
  import("react-loader-spinner").then((mod) => ({ default: mod.ColorRing })),
);

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
          <Suspense fallback={null}>
            <ColorRing
              visible={true}
              height="30"
              width="30"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </Suspense>
        </div>
      ) : (
        <span className="font-sans font-semibold text-white">{title}</span>
      )}
    </button>
  );
};
