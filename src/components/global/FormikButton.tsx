"use client"
import React from 'react';
import { ColorRing } from "react-loader-spinner";
import { useAppSelector } from "@/redux/hook";

export const FormikButton = ({loading = false, title = "Continue", error = true}:any) => {
    const { isRouting } = useAppSelector((state: any) => state.temp);
    return (
        <button
            type="submit"
            className={
            `h-12 rounded-xl py-4 flex justify-center items-center 
            ${
                loading && "opacity-70"
            } ${
                !error ?  "bg-mid-green" : "bg-gradient-green"
            }
             
            `}
            disabled={loading || !error}
        >
            {loading ? (
                <ColorRing
                    visible={true}
                    height="30"
                    width="30"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
                />
            ) : (
                <span className="font-sans text-white font-semibold">{title}</span>
            )}
        </button>
    );
}
