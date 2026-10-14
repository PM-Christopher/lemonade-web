"use client";
import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Label, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import EyeIcon from "@/images/icons/eyeIcon.svg";
import { useAppDispatch } from "@/redux/hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordInput } from "@/features/settings/schema";
import { FieldError } from "@/components/global/FieldError";
import { applyServerErrors } from "@/lib/form-errors";
import { useChangePasswordMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { SubmitButton } from "@/components/global/SubmitButton";

type UpdatePasswordInterface = {
  toggle: () => void;
  isOpen: boolean;
  user: unknown;
};

const UpdatePasswordModal: React.FC<UpdatePasswordInterface> = ({ toggle, isOpen }) => {
  const dispatch = useAppDispatch();
  const changePasswordMutation = useChangePasswordMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values: ChangePasswordInput) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `Password updated successfully`,
            type: "success",
          }),
        );
        toggle();
      },
      onError: (error: { message?: string }) => {
        if (
          applyServerErrors(error, setError, [
            "password",
            "new_password",
            "new_password_confirmation",
          ])
        )
          return;
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || `Something went wrong`,
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Update password</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="laptop:h-full laptop:w-[480px] laptop:rounded-lg h-screen w-screen rounded-none bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="cursor-pointer" onClick={toggle}>
                  <CloseIcon className="w-[11.25px]" />
                </div>
                <p className="text-[16px] font-semibold">Update password</p>
              </div>
              <div className="laptop:block hidden">
                <SubmitButton
                  title="Save password"
                  isValid={isValid}
                  loading={isSubmitting}
                  classes="max-w-[135px] p-2 max-h-[39px] rounded-xl border shadow-custom-bottom"
                />
              </div>
            </div>
            <div className="mt-6">
              <div className="flex flex-col gap-y-[500px]">
                <div className="flex flex-col">
                  <div className="mt-6 grid gap-1">
                    <Label
                      htmlFor="current-password"
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Current password
                    </Label>
                    <div className="bg-light_grey flex h-12 w-full items-center justify-between gap-3 rounded-xl p-2 px-3">
                      <div className="w-full">
                        <input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          className="bg-light_grey h-12 w-full rounded-xl border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                          placeholder=""
                          {...register("password")}
                        />
                      </div>
                      <EyeIcon onClick={() => setShowCurrentPassword((v) => !v)} />
                    </div>
                    <FieldError message={errors.password?.message} />
                  </div>
                  <div className="mt-6 grid gap-1">
                    <Label
                      htmlFor="new-password"
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      New Password
                    </Label>
                    <div className="bg-light_grey flex h-12 w-full items-center justify-between gap-3 rounded-xl p-2 px-3">
                      <div className="w-full">
                        <input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          className="bg-light_grey h-12 w-full rounded-xl border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                          placeholder=""
                          {...register("new_password")}
                        />
                      </div>
                      <EyeIcon onClick={() => setShowNewPassword((v) => !v)} />
                    </div>
                    <p className="text-grey-40 text-[12px] font-normal">
                      Password must be at least 8 character long
                    </p>
                    <FieldError message={errors.new_password?.message} />
                  </div>
                  <div className="mt-6 grid gap-1">
                    <Label
                      htmlFor="confirm-password"
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Confirm password
                    </Label>
                    <div className="bg-light_grey flex h-12 w-full items-center justify-between gap-3 rounded-xl p-2 px-3">
                      <div className="w-full">
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          className="bg-light_grey h-12 w-full rounded-xl border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                          placeholder=""
                          {...register("new_password_confirmation")}
                        />
                      </div>
                      <EyeIcon onClick={() => setShowConfirmPassword((v) => !v)} />
                    </div>
                    <FieldError message={errors.new_password_confirmation?.message} />
                  </div>
                </div>
                <div className="laptop:hidden block">
                  <SubmitButton
                    title="Save password"
                    isValid={isValid}
                    loading={isSubmitting}
                    classes="w-full laptop:max-w-[135px] p-2 h-12 laptop:max-h-[39px] rounded-xl border shadow-custom-bottom"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default UpdatePasswordModal;
