"use client";
import React, { useEffect, useRef, useState } from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@lemonade/ui";

interface ExportMenuProps {
  onExport: (type: "csv" | "pdf") => void;
  isBusy?: boolean;
}

// The green Export button with a small menu to pick PDF or CSV.
export function ExportMenu({ onExport, isBusy = false }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);

  // Closes the menu on a click anywhere else.
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (container.current && !container.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const pick = (type: "csv" | "pdf") => {
    setOpen(false);
    onExport(type);
  };

  return (
    <div className="relative" ref={container}>
      <Button
        aria-haspopup="menu"
        aria-expanded={open}
        className={"border-step-color bg-gradient-green flex h-10 rounded-xl"}
        onClick={() => setOpen((value) => !value)}
        disabled={isBusy}
      >
        <UploadIcon className={"h-3.75 w-3.75 text-white"} />
        <p className={"text-body-l font-medium text-white"}>{isBusy ? "Exporting..." : "Export"}</p>
      </Button>
      {open && (
        <ul
          role="menu"
          className="absolute top-full right-0 z-50 mt-1 w-40 rounded-xl bg-white shadow"
        >
          <li role="none">
            <button
              role="menuitem"
              className="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => pick("pdf")}
            >
              Export as pdf
            </button>
          </li>
          <li role="none">
            <button
              role="menuitem"
              className="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => pick("csv")}
            >
              Export as CSV
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
