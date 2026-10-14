import "@testing-library/jest-dom/vitest";
import { createElement, type ReactNode } from "react";
import { expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// The loading spinner needs styled-components runtime that jsdom lacks; it is decorative.
vi.mock("react-loader-spinner", () => ({ ColorRing: () => null }));

// Next's Link prefetches and updates state after mount — that races axe/assertions
// outside act(). A plain anchor is enough for every unit test here.
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) => createElement("a", { href: typeof href === "string" ? href : "#", ...rest }, children),
}));
