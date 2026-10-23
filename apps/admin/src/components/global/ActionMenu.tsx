"use client";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export interface ActionMenuItem {
  label: string;
  onSelect: () => void;
  // Red text, for actions like Delete.
  danger?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const MENU_WIDTH = 176;

// A kebab button that opens a list of row actions. The list is drawn over the page, so a table can't clip it.
export function ActionMenu({
  label,
  items,
  trigger,
  triggerClassName,
}: {
  label: string;
  items: ActionMenuItem[];
  // Replaces the kebab icon, for menus opened from something else like an avatar.
  trigger?: React.ReactNode;
  triggerClassName?: string;
}) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const isOpen = position !== null;

  const close = useCallback(() => {
    setPosition(null);
    triggerRef.current?.focus();
  }, []);

  const open = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.bottom + 4,
      left: Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')?.focus();

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        setPosition(null);
      }
    };
    const dismiss = () => setPosition(null);
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("scroll", dismiss, true);
    };
  }, [isOpen]);

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "Tab") {
      setPosition(null);
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const enabled = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [],
    );
    const index = enabled.indexOf(document.activeElement as HTMLElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    enabled[(index + step + enabled.length) % enabled.length]?.focus();
  };

  if (items.length === 0) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        className={
          triggerClassName ??
          "text-text-grey hover:bg-light_grey flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg"
        }
        onClick={(event) => {
          event.stopPropagation();
          if (isOpen) setPosition(null);
          else open();
        }}
      >
        {trigger ?? <MoreVertical className="h-4 w-4" aria-hidden="true" />}
      </button>
      {position &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={label}
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="border-grey-20 fixed z-[100] flex flex-col rounded-xl border bg-white py-1 shadow-lg"
            onKeyDown={onMenuKeyDown}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={`hover:bg-light_grey focus:bg-light_grey flex items-center gap-2 px-4 py-2 text-left text-sm font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                  item.danger ? "text-red-1" : ""
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setPosition(null);
                  item.onSelect();
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
