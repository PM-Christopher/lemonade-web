"use client";
import React from "react";
import { Card, CardContent, CardHeader, Label, Input } from "@lemonade/ui";

import { authApi } from "@/features/authentication/api";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactAddressSchema, type ContactAddressInput } from "@lemonade/validation";
import { FieldError } from "@/components/global/FieldError";
import { applyServerErrors } from "@/lib/form-errors";
import { SubmitButton } from "@/components/global/SubmitButton";
import { authFailure, authStart, loadStop } from "@/features/authentication/authSlice";
import CountryList from "country-list-with-dial-code-and-flag";
import { errorMessage } from "@/lib/api-error";

interface AddressInterface {
  loading: boolean;
  next_step: () => void;
  prev_step: () => void;
}

const AddressStep: React.FC<AddressInterface> = ({ next_step }) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ContactAddressInput>({
    resolver: zodResolver(contactAddressSchema),
    defaultValues: { address: "", city: "", country: "", state: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: ContactAddressInput) => {
    dispatch(authStart());

    try {
      await authApi.addressSetUp(values);
      next_step();
    } catch (err) {
      dispatch(authFailure());
      if (applyServerErrors(err, setError, ["address", "city", "country", "state"])) return;
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(err, "error"),
          type: "error",
        }),
      );
    } finally {
      dispatch(loadStop());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="tablet:w-[480px] w-full rounded-2xl border-none p-6 shadow-none">
        <CardHeader className="grid gap-4 p-0">
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
        <CardContent className="mt-6 grid gap-4 p-0">
          <div className="grid gap-2">
            <Label htmlFor="address" className="font-label">
              Address
            </Label>
            <Input
              id="address"
              type="text"
              className="form-font bg-light_grey h-12 rounded-xl border-0"
              {...register("address")}
            />
            <FieldError message={errors.address?.message} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city" className="font-label">
              City
            </Label>
            <Input
              id="city"
              type="text"
              className="form-font bg-light_grey h-12 rounded-xl border-0"
              {...register("city")}
            />
            <FieldError message={errors.city?.message} />
          </div>

          <div className="my-2 grid gap-2">
            <Label htmlFor="email" className="font-label">
              Country
            </Label>
            <select
              id="country"
              className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
              {...register("country")}
            >
              <option value="">Select country</option>
              {CountryList.getAll().map((country, index) => (
                <option value={country.name} key={index}>
                  {country.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.country?.message} />
          </div>
          <div className="my-2 grid gap-2">
            <Label htmlFor="state" className="font-label">
              State/Region
            </Label>
            <Input
              id="state"
              type="text"
              className="form-font bg-light_grey h-12 rounded-xl border-0"
              {...register("state")}
            />
            <FieldError message={errors.state?.message} />
          </div>
        </CardContent>
        <CardContent className="mt-4 flex flex-col space-y-2 p-0">
          <SubmitButton
            loading={isSubmitting}
            title="Next"
            isValid={isValid}
            classes="w-full h-12 rounded-xl"
          />
        </CardContent>
      </Card>
    </form>
  );
};
export default AddressStep;
