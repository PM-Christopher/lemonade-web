import "vitest";
// jest-dom matcher types (toBeInTheDocument etc.), registered at runtime in vitest.setup.ts.
import "@testing-library/jest-dom/vitest";

declare module "vitest" {
  // Vitest 5's Assertion takes two type parameters; match that shape so
  // expect(await axe(container)).toHaveNoViolations() typechecks.
  interface Assertion<T = unknown, A = T> {
    toHaveNoViolations(): A;
  }

  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
