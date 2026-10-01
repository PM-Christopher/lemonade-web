"use client";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Button, Label } from "@lemonade/ui";
import EyeIcon from "@/images/icons/eyeIcon.svg";
import { useRouter } from "next/navigation";
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
    validateOnMount: true,
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
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-t border-b bg-white p-2 px-16">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Delete account</p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <form onSubmit={formik.handleSubmit}>
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
                      id="search"
                      type={showCurrentPassword ? "text" : "password"}
                      className="bg-light_grey h-12 w-full rounded-xl border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
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

              <div className="mt-6 flex justify-between gap-4">
                <FormikButton
                  title="Delete account"
                  loading={formik.isSubmitting}
                  error={formik.isValid}
                  bgColor="bg-red-1"
                  errorColor="bg-red-2"
                  classes="h-12 shadow-none border border-red-2 rounded-xl w-full"
                />
                <Button
                  className="h-12 w-full border-none bg-transparent shadow-none"
                  onClick={() => router.push("/delete-account")}
                >
                  <p className="font-semi-normal text-light-green text-[16px]">Cancel</p>
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
