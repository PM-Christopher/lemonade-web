// @lemonade/ui
//
// Primitives, not features. If a component knows about an event, tribe,
// wallet or user, it belongs to an app, not here. No component in this
// package may import from @lemonade/api-client. See docs/ARCHITECTURE.md §7.
//
// Admin (dense, desktop) and the user app (spacious, mobile) have real
// visual differences — handle them via token values and variants, not
// forks, and never with an `isAdmin` prop.
//
// Style: shadcn's "new-york" preset, reconciled from admin (new-york) and
// frontend (default) diverging — see docs/ARCHITECTURE.md §7. Two
// exceptions kept from frontend's "default" version because they're
// correctness fixes, not style: Card's title/description render as
// <h3>/<p> (semantic heading, not <div>) and Input carries the
// password-visibility toggle (gated on `type="password"`, not an app flag).

export { Button, buttonVariants, type ButtonProps } from "./button";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";
export { Input, type InputProps } from "./input";
export { Label } from "./label";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./select";
export { Textarea, type TextareaProps } from "./textarea";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogContentBare,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";
export { cn } from "./lib/utils";
