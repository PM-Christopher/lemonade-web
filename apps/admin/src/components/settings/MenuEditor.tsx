"use client";
import React, { useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { routes } from "@/lib/routes";
import type { PageLink } from "@/utils/pageLinks";
import { applyMenuPreferences } from "@/utils/menuOrder";
import { useUpdateMenuPreferencesMutation } from "@/features/settings/mutations";
import type { MenuPreferences } from "@/features/settings/api";

interface MenuEditorProps {
  // The pages this admin may open.
  allowed: PageLink[];
  saved: MenuPreferences;
}

const move = <T,>(items: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

// Drag pages into the order you want, or hide the ones you don't use.
export function MenuEditor({ allowed, saved }: MenuEditorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const save = useUpdateMenuPreferencesMutation();

  // Hidden pages stay in the list so they can be shown again.
  const initialOrder = applyMenuPreferences(allowed, {
    menu_order: saved.menu_order,
    hidden_menu: [],
  }).map((link) => link.path);
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [hidden, setHidden] = useState<string[]>(saved.hidden_menu);
  const [labels, setLabels] = useState<Record<string, string>>(saved.menu_labels ?? {});
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  const byPath = new Map(allowed.map((link) => [link.path, link]));
  // Only names that are filled in and differ from the default are kept.
  const cleanLabels = Object.fromEntries(
    Object.entries(labels)
      .map(([path, label]) => [path, label.trim()] as const)
      .filter(([path, label]) => label !== "" && label !== byPath.get(path)?.name),
  );
  const hasChanges =
    JSON.stringify(order) !== JSON.stringify(initialOrder) ||
    JSON.stringify([...hidden].sort()) !== JSON.stringify([...saved.hidden_menu].sort()) ||
    JSON.stringify(Object.entries(cleanLabels).sort()) !==
      JSON.stringify(Object.entries(saved.menu_labels ?? {}).sort());

  const toast = (message: string, type: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type }));

  const toggleHidden = (path: string) =>
    setHidden((current) =>
      current.includes(path) ? current.filter((item) => item !== path) : [...current, path],
    );

  const defaultOrder = applyMenuPreferences(allowed, undefined).map((link) => link.path);

  const reset = () => {
    setOrder(defaultOrder);
    setHidden([]);
    setLabels({});
  };

  const onSave = () =>
    save.mutate(
      // The default order is saved as "no custom order", so new pages slot in A to Z.
      {
        menu_order: JSON.stringify(order) === JSON.stringify(defaultOrder) ? [] : order,
        hidden_menu: hidden,
        menu_labels: cleanLabels,
      },
      {
        onSuccess: () => toast(apiMessage("Menu saved"), "success"),
        onError: (error) => toast(error?.message || "Something went wrong", "error"),
      },
    );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-grey text-body-s">
        Drag a page to move it, or use the arrows. Type in a name to rename a page, and leave it
        empty to keep the default. Hidden pages leave the menu but can still be opened by link.
      </p>
      <ul className="flex max-w-xl flex-col gap-2">
        {order.map((path, index) => {
          const link = byPath.get(path);
          if (!link) return null;
          const isHidden = hidden.includes(path);
          const isOverview = path === routes.HOME;

          return (
            <li
              key={path}
              draggable
              onDragStart={() => setDragFrom(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragFrom !== null) setOrder((current) => move(current, dragFrom, index));
                setDragFrom(null);
              }}
              onDragEnd={() => setDragFrom(null)}
              className={`border-grey-20 flex items-center gap-3 rounded-xl border bg-white px-3 py-2 ${
                dragFrom === index ? "opacity-50" : ""
              }`}
            >
              <GripVertical
                className="text-grey-40 h-4 w-4 shrink-0 cursor-grab"
                aria-hidden="true"
              />
              <link.icon
                className={`h-4 w-4 shrink-0 ${isHidden ? "text-grey-40" : "text-text-grey"}`}
                aria-hidden="true"
              />
              <input
                type="text"
                aria-label={`Name for ${link.name}`}
                maxLength={40}
                placeholder={link.name}
                value={labels[path] ?? ""}
                onChange={(event) =>
                  setLabels((current) => ({ ...current, [path]: event.target.value }))
                }
                className={`text-body-s focus:bg-light_grey min-w-0 flex-1 rounded-lg bg-transparent px-2 py-1 focus:outline-none ${isHidden ? "text-grey-40 line-through" : ""}`}
              />
              <button
                type="button"
                aria-label={`Move ${link.name} up`}
                disabled={index === 0}
                className="text-text-grey cursor-pointer disabled:opacity-30"
                onClick={() => setOrder((current) => move(current, index, index - 1))}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Move ${link.name} down`}
                disabled={index === order.length - 1}
                className="text-text-grey cursor-pointer disabled:opacity-30"
                onClick={() => setOrder((current) => move(current, index, index + 1))}
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={isHidden ? `Show ${link.name}` : `Hide ${link.name}`}
                disabled={isOverview}
                title={isOverview ? "Overview is always shown" : undefined}
                className="text-text-grey cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                onClick={() => toggleHidden(path)}
              >
                {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={!hasChanges || save.isPending}
          className="bg-gradient-green h-12 rounded-xl px-6 font-sans font-semibold text-white disabled:opacity-50"
          onClick={onSave}
        >
          {save.isPending ? "Saving…" : "Save menu"}
        </button>
        <button
          type="button"
          className="text-text-grey text-body-s cursor-pointer font-medium"
          onClick={reset}
        >
          Reset to A to Z
        </button>
      </div>
    </div>
  );
}
