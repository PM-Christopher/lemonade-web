"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  FieldError,
  Input,
  Label,
} from "@lemonade/ui";
import { SubmitButton } from "@/components/global/SubmitButton";
import { errorMessage } from "@/lib/api-error";

interface GoogleLinkDialogProps {
  open: boolean;
  /** Resolves when linking worked; throws to show the server's message. */
  onSubmit: (password: string) => Promise<void>;
  onCancel: () => void;
}

// Asks for the account password once, to link Google to an email/password account.
export function GoogleLinkDialog({ open, onSubmit, onCancel }: GoogleLinkDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isBusy, setIsBusy] = useState(false);

  const close = () => {
    setPassword("");
    setError(undefined);
    onCancel();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsBusy(true);
    setError(undefined);
    try {
      await onSubmit(password);
      setPassword("");
    } catch (err) {
      setError(errorMessage(err, "Could not link Google"));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent className="max-w-sm border-0">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <DialogTitle>Link your Google account</DialogTitle>
          <DialogDescription>
            This email already has a Lemonade account. Enter its password once to link Google. Next
            time you can sign in with Google directly.
          </DialogDescription>
          <div className="flex flex-col gap-2">
            <Label htmlFor="google-link-password">Password</Label>
            <Input
              id="google-link-password"
              type="password"
              autoComplete="current-password"
              className="form-font bg-light_grey h-12 rounded-xl border-0"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <FieldError message={error} />
          </div>
          <SubmitButton
            loading={isBusy}
            title="Link and sign in"
            isValid={password.length > 0}
            classes="w-full h-12 rounded-xl"
          />
          <Button type="button" variant="ghost" onClick={close} disabled={isBusy}>
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
