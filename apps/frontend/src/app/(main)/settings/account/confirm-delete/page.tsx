"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import EyeIcon from "@/images/icons/eyeIcon.svg";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hook";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDeleteAccountMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { FormikButton } from "@/components/global/FormikButton";
import MainLayout from "@/components/layouts/MainLayout";

const ConfirmDeletePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const deleteAccountMutation = useDeleteAccountMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const passwordSchema = yup.object({
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: passwordSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      deleteAccountMutation.mutate(values, {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: `Account deleted successfully`,
              type: "success",
            }),
          );
          // redirect user to login
          router.push("/login");
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
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] bg-white p-[8px] px-[64px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">Delete account</p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex w-full flex-col gap-4 rounded-[12px] bg-white p-[24px] laptop:w-[640px]">
              <p className="text-[16px] font-semi-normal text-black-light">
                Enter your password to delete your account
              </p>

              <div className="mt-[24px] grid gap-1">
                <Label
                  htmlFor="username"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  Password
                </Label>
                <div className="flex h-[48px] w-full items-center justify-between gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]">
                  <div className="w-full">
                    <input
                      id="search"
                      type={showCurrentPassword ? "text" : "password"}
                      className="h-[48px] w-full rounded-xl border-0 bg-light_grey text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder=""
                      value={formik.values.password}
                      onChange={(e) => {
                        formik.setFieldValue("password", e.target.value);
                      }}
                    />
                  </div>
                  <EyeIcon className="cursor-pointer" onClick={toggleCurrentPasswordVisibility} />
                </div>
              </div>

              <div className="mt-[24px] flex justify-between gap-[16px]">
                <FormikButton
                  title="Delete account"
                  loading={formik.isSubmitting}
                  error={formik.isValid}
                  bgColor="bg-red-1"
                  errorColor="bg-red-2"
                  classes="h-[48px] shadow-none border-[1px] border-red-2 rounded-[12px] w-full"
                />
                <Button
                  className="h-[48px] w-full border-none bg-transparent shadow-none"
                  onClick={() => router.push("/delete-account")}
                >
                  <p className="text-[16px] font-semi-normal text-light-green">Cancel</p>
                </Button>
              </div>
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default ConfirmDeletePage;
