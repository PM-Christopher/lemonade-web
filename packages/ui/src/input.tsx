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
            "field file:text-foreground file:text-label file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
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
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
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
