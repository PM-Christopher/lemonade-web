"use client";
import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Label, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import EyeIcon from "@/images/icons/eyeIcon.svg";
import { useAppDispatch } from "@/redux/hook";
import * as yup from "yup";
import { useFormik } from "formik";
import { useChangePasswordMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { FormikButton } from "@/components/global/FormikButton";

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

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordSchema = yup.object({
    password: yup.string().required("Password is required"),
    new_password: yup.string().required("New Password is required"),
    new_password_confirmation: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    validationSchema: passwordSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
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
          dispatch(
            updateToastifyReducer({
              show: true,
              message: error?.message || `Something went wrong`,
              type: "error",
            }),
          );
        },
      });
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Update password</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <div className="laptop:h-full laptop:w-[480px] laptop:rounded-lg h-screen w-screen rounded-none bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="cursor-pointer" onClick={toggle}>
                  <CloseIcon className="w-[11.25px]" />
                </div>
                <p className="text-[16px] font-semibold">Update password</p>
              </div>
              <div className="laptop:block hidden">
                <FormikButton
                  title="Save password"
                  error={formik.isValid}
                  loading={formik.isSubmitting}
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
                          value={formik.values.password}
                          onChange={(e) => {
                            formik.setFieldValue("password", e.target.value);
                          }}
                        />
                      </div>
                      <EyeIcon onClick={toggleCurrentPasswordVisibility} />
                    </div>
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
                          type={showCurrentPassword ? "text" : "password"}
                          className="bg-light_grey h-12 w-full rounded-xl border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                          placeholder=""
                          value={formik.values.new_password}
                          onChange={(e) => {
                            formik.setFieldValue("new_password", e.target.value);
                          }}
                        />
                      </div>
                      <EyeIcon onClick={toggleNewPasswordVisibility} />
                    </div>
                    <p className="text-grey-40 text-[12px] font-normal">
                      Password must be at least 8 character long
                    </p>
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
                          type={showCurrentPassword ? "text" : "password"}
                          className="bg-light_grey h-12 w-full rounded-xl border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                          placeholder=""
                          value={formik.values.new_password_confirmation}
                          onChange={(e) => {
                            formik.setFieldValue("new_password_confirmation", e.target.value);
                          }}
                        />
                      </div>
                      <EyeIcon onClick={toggleConfirmPasswordVisibility} />
                    </div>
                  </div>
                </div>
                <div className="laptop:hidden block">
                  <FormikButton
                    title="Save password"
                    error={formik.isValid}
                    loading={formik.isSubmitting}
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
