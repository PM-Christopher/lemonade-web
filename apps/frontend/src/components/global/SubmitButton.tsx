"use client";
import React, { lazy, Suspense } from "react";

const ColorRing = lazy(() =>
  import("react-loader-spinner").then((mod) => ({ default: mod.ColorRing })),
);

interface SubmitButtonProps {
  loading?: boolean;
  title?: string;
  /** Enables the button. Pass the form's isValid. */
  isValid?: boolean;
  classes?: string | null;
  bgColor?: string | null;
  errorColor?: string | null;
  /** Id of the form to submit when the button renders outside it (e.g. in a portal). */
  form?: string;
}

export const SubmitButton = ({
  loading = false,
  title = "Continue",
  isValid = true,
  classes = null,
  bgColor = null,
  errorColor = null,
  form,
}: SubmitButtonProps) => {
  const isDisabled = loading || !isValid;
  const defaultBg = bgColor === null ? (!isValid ? "bg-disabled-green" : "bg-gradient-green") : "";

  return (
    <button
      type="submit"
      form={form}
      className={`${
        classes === null
          ? "flex h-12 w-fit items-center justify-center rounded-xl px-3.5 py-2.5"
          : classes
      } ${loading && "opacity-70"} ${bgColor && !isValid ? errorColor : bgColor} ${defaultBg} ${
        loading && "bg-light-green cursor-not-allowed opacity-70"
      } ${!isValid && "cursor-not-allowed"} `}
      disabled={isDisabled}
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
