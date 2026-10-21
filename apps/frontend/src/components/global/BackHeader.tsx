"use client";
import React from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { useNavigation } from "@/hooks/useNavigation";

type BackHeaderProps = { title: string; href?: string };

/** Sticky page header with a back button; goes to `href`, or the previous page. */
export function BackHeader({ title, href }: BackHeaderProps) {
  const { back, push } = useNavigation();

  return (
    <div className="laptop:px-16 sticky top-[var(--top-nav-h,4.5rem)] z-40 flex items-center justify-between bg-white p-2 px-4">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
        onClick={() => (href ? push(href) : back())}
      >
        <ChevronLeft aria-hidden="true" />
        <span className="tracking-custom text-body-l font-sans font-semibold">{title}</span>
      </button>
    </div>
  );
}
