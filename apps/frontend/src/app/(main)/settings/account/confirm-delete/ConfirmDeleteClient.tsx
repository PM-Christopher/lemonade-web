"use client";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import { Button, Label } from "@lemonade/ui";
import EyeIcon from "@/images/icons/eyeIcon.svg";

import { useAppDispatch } from "@/redux/hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteAccountSchema, type DeleteAccountInput } from "@/features/settings/schema";
import { FieldError } from "@/components/global/FieldError";
import { applyServerErrors } from "@/lib/form-errors";
import { useDeleteAccountMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { SubmitButton } from "@/components/global/SubmitButton";

// Password confirmation form that deletes the account.
const ConfirmDeleteClient = () => {
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const deleteAccountMutation = useDeleteAccountMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "" },
    mode: "onTouched",
  });

  const onSubmit = (values: DeleteAccountInput) => {
    deleteAccountMutation.mutate(values, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Account deleted successfully",
            type: "success",
          }),
        );
        push(routes.LOGIN);
      },
      onError: (error: { message?: string }) => {
        if (applyServerErrors(error, setError, ["password"])) return;
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || "Something went wrong",
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <section className="mt-4 flex flex-col items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="laptop:w-[640px] flex w-full flex-col gap-4 rounded-xl bg-white p-6">
          <p className="font-semi-normal text-black-light text-[16px]">
            Enter your password to delete your account
          </p>

          <div className="mt-6 grid gap-1">
            <Label
              htmlFor="username"
              className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
            >
              Password
            </Label>
            <div className="bg-light_grey flex h-12 w-full items-center justify-between gap-3 rounded-xl p-2 px-3">
              <div className="w-full">
                <input
                  id="password"
                  type={showCurrentPassword ? "text" : "password"}
                  className="bg-light_grey h-12 w-full rounded-xl border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                  placeholder=""
                  {...register("password")}
                />
              </div>
              <EyeIcon className="cursor-pointer" onClick={toggleCurrentPasswordVisibility} />
            </div>
            <FieldError message={errors.password?.message} />
          </div>

          <div className="mt-6 flex justify-between gap-4">
            <SubmitButton
              title="Delete account"
              loading={isSubmitting}
              isValid={isValid}
              bgColor="bg-red-1"
              errorColor="bg-red-2"
              classes="h-12 shadow-none border border-red-2 rounded-xl w-full"
            />
            <Button
              className="h-12 w-full border-none bg-transparent shadow-none"
              onClick={() => push(routes.SETTINGS_ACCOUNT_DELETE)}
            >
              <p className="font-semi-normal text-light-green text-[16px]">Cancel</p>
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ConfirmDeleteClient;
