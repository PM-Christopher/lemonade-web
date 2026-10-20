"use client";
import React from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { useNavigation } from "@/hooks/useNavigation";

/** Page header with a back button; the only client piece of otherwise static pages. */
export function BackHeader({ title }: { title: string }) {
  const { back } = useNavigation();

  return (
    <div className="laptop:px-16 flex items-center justify-between bg-white p-2 px-4">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
        onClick={() => back()}
      >
        <ChevronLeft aria-hidden="true" />
        <span className="tracking-custom text-body-l font-sans font-semibold">{title}</span>
      </button>
    </div>
  );
}
