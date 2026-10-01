"use client";
import React from "react";
import { Card, CardContent, CardHeader, Label, Input } from "@lemonade/ui";

import { axiosInstance } from "@/lib/axiosInstane";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { checkError } from "@lemonade/domain";
import { useFormik } from "formik";
import { contactAddressSchema } from "@lemonade/validation";
import { FormikButton } from "@/components/global/FormikButton";
import { authFailure, authStart, loadStop } from "@/features/authentication/authSlice";
import { useCookies } from "react-cookie";
import CountryList from "country-list-with-dial-code-and-flag";

interface AddressInterface {
  loading: boolean;
  next_step: () => void;
  prev_step: () => void;
}

interface AddressFormValues {
  address: string;
  city: string;
  country: string;
  state: string;
}

interface LegacyAxiosError {
  response?: { data?: { message?: string } };
}

const AddressStep: React.FC<AddressInterface> = ({ next_step }) => {
  const dispatch = useAppDispatch();
  const [cookie] = useCookies(["token", "newToken"]);

  const getHeader = () => {
    const token = cookie.newToken;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  //form validation
  const formik = useFormik({
    initialValues: {
      address: "",
      city: "",
      country: "",
      state: "",
    },
    validationSchema: contactAddressSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      await addressStep(values);
    },
  });

  const addressStep = async (values: AddressFormValues) => {
    dispatch(authStart());

    try {
      const { data } = await axiosInstance.post(
        "/user/profile/address-set-up",
        { ...values },
        getHeader(),
      );
      if (data.success) {
        next_step();
      } else {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Something went wrong",
            type: "error",
          }),
        );
      }
    } catch (err) {
      const legacyError = err as LegacyAxiosError;
      dispatch(authFailure());
      dispatch(
        updateToastifyReducer({
          show: true,
          message: legacyError?.response?.data?.message || "error",
          type: "error",
        }),
      );
    } finally {
      dispatch(loadStop());
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className="tablet:w-[480px] w-full rounded-2xl border-none shadow-none">
        <CardHeader className="grid gap-4">
          <div className="flex gap-2">
            <div className="bg-step-color h-0.5 w-[15px]" />
            <div className="bg-step-color h-0.5 w-[15px]" />
            <div className="bg-border-grey h-0.5 w-[15px]" />
            <div className="bg-border-grey h-0.5 w-[15px]" />
          </div>
          <div>
            <p className="font-sans text-[24px] font-semibold">Contact address</p>
            <p className="text-text-grey font-sans text-[14px] leading-[21px] font-normal">
              We&apos;ll use this address for important information and <br /> keep it confidential.
            </p>
          </div>
        </CardHeader>
        <CardContent className="mt-[30px] grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="address" className="font-label">
              Address
            </Label>
            <Input
              id="address"
              type="text"
              className="form-font bg-light_grey h-12 rounded-xl border-0"
              value={formik.values.address}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {checkError("address", formik) ? (
              <p className="text-[12px] text-[#FF8D8D]">{formik.errors.address}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city" className="font-label">
              City
            </Label>
            <Input
              id="city"
              type="text"
              className="form-font bg-light_grey h-12 rounded-xl border-0"
              value={formik.values.city}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {checkError("city", formik) ? (
              <p className="text-[12px] text-[#FF8D8D]">{formik.errors.city}</p>
            ) : null}
          </div>

          <div className="my-2 grid gap-2">
            <Label htmlFor="email" className="font-label">
              Country
            </Label>
            <select
              id="country"
              className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
              value={formik.values.country}
              onChange={(e) => {
                formik.setFieldValue("country", e.target.value);
              }}
            >
              <option value="">Select country</option>
              {CountryList.getAll().map((country, index) => (
                <option value={country.name} key={index}>
                  {country.name}
                </option>
              ))}
            </select>
            {checkError("country", formik) ? (
              <p className="text-[12px] text-[#FF8D8D]">{formik.errors.country}</p>
            ) : null}
          </div>
          <div className="my-2 grid gap-2">
            <Label htmlFor="state" className="font-label">
              State/Region
            </Label>
            <Input
              id="state"
              type="text"
              className="form-font bg-light_grey h-12 rounded-xl border-0"
              value={formik.values.state}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {checkError("state", formik) ? (
              <p className="text-[12px] text-[#FF8D8D]">{formik.errors.state}</p>
            ) : null}
          </div>
        </CardContent>
        <CardContent className="flex flex-col space-y-2">
          <FormikButton
            loading={formik.isSubmitting}
            title="Next"
            error={formik.isValid}
            classes="w-full h-12 rounded-xl"
          />
        </CardContent>
      </Card>
    </form>
  );
};
export default AddressStep;
