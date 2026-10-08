"use client";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@lemonade/ui";
import Image from "next/image";

import { axiosInstance } from "@/lib/axiosInstane";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormikButton } from "@/components/global/FormikButton";
import { authFailure, authStart, authSuccess, loadStop } from "@/features/authentication/authSlice";
import { useCookies } from "react-cookie";

interface SocialInterface {
  loading: boolean;
  prev_step: () => void;
  onComplete: () => void;
}

interface SocialMediaHandles {
  instagram: string;
  linkedin: string;
  facebook: string;
  twitter: string;
}

interface LegacyAxiosError {
  response?: { data?: { message?: string } };
}

const SocialStep: React.FC<SocialInterface> = () => {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();
  const [cookie, , removeCookie] = useCookies(["token", "newToken"]);
  const [socials, setSocials] = useState<SocialMediaHandles>({
    instagram: "",
    linkedin: "",
    facebook: "",
    twitter: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocials((prev) => ({ ...prev, [name]: value }));
  };

  const getHeader = () => {
    const token = cookie.newToken;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  //form validation
  const socialStepSchema = yup.object({
    socials: yup.array(),
  });

  const formik = useFormik({
    initialValues: {
      socials: [],
    },
    validationSchema: socialStepSchema,
    validateOnMount: true,
    onSubmit: async () => {
      await socialsStep();
    },
  });

  const socialsStep = async () => {
    const filteredSocials = (Object.keys(socials) as Array<keyof SocialMediaHandles>)
      .filter((key) => socials[key]) // Only keep keys with non-empty values
      .map((key) => ({
        name: key,
        value: socials[key],
      }));
    const requestBody = {
      socials: filteredSocials,
    };

    dispatch(authStart());
    try {
      const { data } = await axiosInstance.post(
        "/user/profile/socials-set-up",
        requestBody,
        getHeader(),
      );
      if (data.success) {
        dispatch(authSuccess(data.data));
        removeCookie("newToken");
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Account created successfully",
            type: "success",
          }),
        );
        push(routes.HOME);
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
      <Card className="tablet:w-[480px] w-full rounded-2xl border-none p-6 shadow-none">
        <CardHeader className="grid gap-4 p-0">
          <div className="flex gap-2">
            <div className="bg-step-color h-0.5 w-[15px]" />
            <div className="bg-step-color h-0.5 w-[15px]" />
            <div className="bg-step-color h-0.5 w-[15px]" />
            <div className="bg-step-color h-0.5 w-[15px]" />
          </div>
          <div>
            <p className="font-sans text-[24px] font-semibold">Link your social profiles</p>
            <p className="text-text-grey font-sans text-[14px] leading-[21px] font-normal">
              Good job! Now add your social profile usernames to <br />
              stay connected with others.
            </p>
          </div>
        </CardHeader>
        <CardContent className="mt-6 grid gap-4 p-0">
          {(
            [
              { name: "facebook", icon: images.FACEBOOK, value: socials.facebook },
              { name: "linkedin", icon: images.LINKEDIN, value: socials.linkedin },
              { name: "twitter", icon: images.TWITTER, value: socials.twitter },
              { name: "instagram", icon: images.INSTAGRAM, value: socials.instagram },
            ] as const
          ).map((field) => (
            <label
              key={field.name}
              htmlFor={field.name}
              className="bg-light_grey focus-within:border-step-color flex h-14 w-full items-center gap-3 rounded-xl border border-transparent px-5"
            >
              <Image src={field.icon} alt="" width={20} height={20} className="h-5 w-5 shrink-0" />
              <input
                name={field.name}
                id={field.name}
                type="text"
                className="form-font placeholder:text-text-grey h-full w-full min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none outline-none focus:border-0 focus:ring-0 focus:outline-none focus-visible:outline-none"
                placeholder="Username"
                value={field.value}
                onChange={handleChange}
              />
            </label>
          ))}
        </CardContent>
        <CardContent className="mt-4 flex flex-col p-0">
          <div className="mt-2 mb-6 flex justify-center">
            <button
              type="submit"
              className="font-semi-normal text-light-green cursor-pointer border-none bg-transparent text-center font-sans text-[16px]"
            >
              Skip
            </button>
          </div>
          <FormikButton
            loading={formik.isSubmitting}
            title="Done"
            error={formik.isValid}
            classes="w-full h-12 rounded-xl"
          />
        </CardContent>
      </Card>
    </form>
  );
};
export default SocialStep;
