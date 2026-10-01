"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Input } from "@lemonade/ui";
import Image from "next/image";
import facebook_image from "@/image/facebook.png";
import linkedin_image from "@/images/linkedin.png";
import twitter_image from "@/images/twitter.png";
import instagram_image from "@/images/instagram.png";

import { axiosInstance } from "@/lib/axiosInstane";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormikButton } from "@/components/global/FormikButton";
import { authFailure, authStart, authSuccess, loadStop } from "@/features/authentication/authSlice";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

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

const SocialStep: React.FC<SocialInterface> = ({ loading, prev_step, onComplete }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [cookie, setCookie, removeCookie] = useCookies(["token", "newToken"]);
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
    onSubmit: async (values) => {
      await socialsStep(socials);
    },
  });

  const socialsStep = async (values: any) => {
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
        router.push("/");
      } else {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Something went wrong",
            type: "error",
          }),
        );
      }
    } catch (err: any) {
      dispatch(authFailure());
      dispatch(
        updateToastifyReducer({
          show: true,
          message: err?.response?.data?.message || "error",
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
        <CardContent className="mt-[30px] grid gap-4">
          <div className="bg-light_grey flex h-14 items-center gap-2 rounded-xl border-0 p-2 px-5">
            <div className="">
              <Image src={"/images/facebook.png"} alt="" width={19.2} height={19.2} />
            </div>
            <Input
              name="facebook"
              id="facebook"
              type="text"
              className="form-font border-0 shadow-none"
              placeholder="Username"
              value={socials.facebook}
              onChange={handleChange}
            />
          </div>
          <div className="bg-light_grey flex h-14 items-center gap-2 rounded-xl border-0 p-2 px-5">
            <div className="">
              <Image src={"/images/linkedin.png"} alt="" width={19.2} height={19.2} />
            </div>
            <Input
              name="linkedin"
              id="linkedin"
              type="text"
              className="form-font border-0 shadow-none"
              placeholder="Username"
              value={socials.linkedin}
              onChange={handleChange}
            />
          </div>
          <div className="bg-light_grey flex h-14 items-center gap-2 rounded-xl border-0 p-2 px-5">
            <div className="">
              <Image src={"/images/twitter.png"} alt="" width={19.2} height={19.2} />
            </div>
            <Input
              name="twitter"
              id="twitter"
              type="text"
              className="form-font border-0 shadow-none"
              placeholder="Username"
              value={socials.twitter}
              onChange={handleChange}
            />
          </div>
          <div className="bg-light_grey flex h-14 items-center gap-2 rounded-xl border-0 p-2 px-5">
            <div className="">
              <Image src={"/images/instagram.png"} alt="" width={19.2} height={19.2} />
            </div>
            <Input
              name="instagram"
              id="instagram"
              type="text"
              className="form-font border-0 shadow-none"
              placeholder="Username"
              value={socials.instagram}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardContent className="flex flex-col">
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
