import * as React from "react";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";

import { cn } from "./lib/utils";

export type InputProps = React.ComponentProps<"input">;

// Renders a show/hide toggle whenever `type="password"` — any consumer gets
// it by passing that type, not by an app-specific flag. See CLAUDE.md's "no
// app-shaped branching inside a package".
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";

    return (
      <div className={isPasswordType ? "relative" : ""}>
        <input
          type={isPasswordType ? (showPassword ? "text" : "password") : type}
          className={cn(
            "md:text-sm flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            isPasswordType && "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOpenIcon className="h-4 w-4" />
            ) : (
              <EyeClosedIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
