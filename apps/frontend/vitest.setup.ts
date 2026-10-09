import "@testing-library/jest-dom/vitest";
import { expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// The loading spinner needs styled-components runtime that jsdom lacks; it is decorative.
vi.mock("react-loader-spinner", () => ({ ColorRing: () => null }));
