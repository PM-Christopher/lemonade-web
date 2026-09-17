"use client";
import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Label } from "@lemonade/ui";
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
  user: any;
};

const UpdatePasswordModal: React.FC<UpdatePasswordInterface> = ({ toggle, isOpen, user }) => {
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
        onError: (error: any) => {
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
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="h-screen w-screen rounded-none bg-white p-6 shadow-lg laptop:h-full laptop:w-[480px] laptop:rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon className="w-[11.25px]" />
              </div>
              <p className="text-[16px] font-semibold">Update password</p>
            </div>
            <div className="hidden laptop:block">
              <FormikButton
                title="Save password"
                error={formik.isValid}
                loading={formik.isSubmitting}
                classes="max-w-[135px] p-2 max-h-[39px] rounded-[12px] border-[1px] shadow-custom-bottom"
              />
            </div>
          </div>
          <div className="mt-[24px]">
            <div className="flex flex-col gap-y-[500px]">
              <div className="flex flex-col">
                <div className="mt-[24px] grid gap-1">
                  <Label
                    htmlFor="current-password"
                    className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                  >
                    Current password
                  </Label>
                  <div className="flex h-[48px] w-full items-center justify-between gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]">
                    <div className="w-full">
                      <input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        className="h-[48px] w-full rounded-xl border-0 bg-light_grey text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
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
                <div className="mt-[24px] grid gap-1">
                  <Label
                    htmlFor="new-password"
                    className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                  >
                    New Password
                  </Label>
                  <div className="flex h-[48px] w-full items-center justify-between gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]">
                    <div className="w-full">
                      <input
                        id="new-password"
                        type={showCurrentPassword ? "text" : "password"}
                        className="h-[48px] w-full rounded-xl border-0 bg-light_grey text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
                        placeholder=""
                        value={formik.values.new_password}
                        onChange={(e) => {
                          formik.setFieldValue("new_password", e.target.value);
                        }}
                      />
                    </div>
                    <EyeIcon onClick={toggleNewPasswordVisibility} />
                  </div>
                  <p className="text-[12px] font-normal text-grey-40">
                    Password must be at least 8 character long
                  </p>
                </div>
                <div className="mt-[24px] grid gap-1">
                  <Label
                    htmlFor="confirm-password"
                    className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                  >
                    Confirm password
                  </Label>
                  <div className="flex h-[48px] w-full items-center justify-between gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]">
                    <div className="w-full">
                      <input
                        id="confirm-password"
                        type={showCurrentPassword ? "text" : "password"}
                        className="h-[48px] w-full rounded-xl border-0 bg-light_grey text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
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
              <div className="block laptop:hidden">
                <FormikButton
                  title="Save password"
                  error={formik.isValid}
                  loading={formik.isSubmitting}
                  classes="w-full laptop:max-w-[135px] p-2 h-[48px] laptop:max-h-[39px] rounded-[12px] border-[1px] shadow-custom-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdatePasswordModal;
