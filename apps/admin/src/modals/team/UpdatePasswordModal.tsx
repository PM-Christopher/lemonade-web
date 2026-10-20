"use client";
import React from "react";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContentBare, DialogTitle, FieldError, Input, Label } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { applyServerErrors } from "@/lib/form-errors";
import { changePasswordSchema, type ChangePasswordInput } from "@/features/team/schema";

interface UpdatePasswordModalProps {
  isOpen: boolean;
  toggle: () => void;
  // Sends the change for whoever's password this is (the admin's own, or a team member's).
  submit: (values: ChangePasswordInput) => Promise<unknown>;
  // Whose password the "Current password" field asks for, when it is not the one being changed.
  currentPasswordHint?: string;
}

const FIELDS: { name: keyof ChangePasswordInput; label: string }[] = [
  { name: "password", label: "Current password" },
  { name: "new_password", label: "New password" },
  { name: "new_password_confirmation", label: "Confirm password" },
];

function UpdatePasswordModal({
  isOpen,
  toggle,
  submit,
  currentPasswordHint,
}: UpdatePasswordModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "", new_password: "", new_password_confirmation: "" },
    mode: "onTouched",
  });

  const close = () => {
    reset();
    toggle();
  };

  const onSubmit = async (values: ChangePasswordInput) => {
    try {
      await submit(values);
      dispatch(
        updateToastifyReducer({
          show: true,
          message: apiMessage("Password updated"),
          type: "success",
        }),
      );
      close();
    } catch (error) {
      if (applyServerErrors(error, setError, ["password", "new_password"])) return;
      dispatch(
        updateToastifyReducer({
          show: true,
          message: error instanceof Error ? error.message : "Something went wrong",
          type: "error",
        }),
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Update password</DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-100 max-w-[92vw] rounded-xl bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-body-xl font-sans font-semibold">Update password</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={close}>
              <XIcon />
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {FIELDS.map(({ name, label }) => (
              <div className="grid gap-1.5" key={name}>
                <Label htmlFor={`pw-${name}`} className="text-text-grey text-meta font-normal">
                  {label}
                </Label>
                <Input
                  id={`pw-${name}`}
                  type="password"
                  autoComplete={name === "password" ? "current-password" : "new-password"}
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  {...register(name)}
                />
                {name === "password" && currentPasswordHint && (
                  <p className="text-text-grey text-meta font-normal">{currentPasswordHint}</p>
                )}
                <FieldError message={errors[name]?.message} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2.5">
            <button
              type="button"
              className="border-light-grey-50 h-12 w-full rounded-xl border bg-white"
              onClick={close}
            >
              <p className="text-body-l font-medium text-black">Cancel</p>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="border-step-color bg-gradient-green h-12 w-full rounded-xl border text-center disabled:opacity-60"
            >
              <p className="text-body-l font-medium text-white">Save password</p>
            </button>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
}

export default UpdatePasswordModal;
