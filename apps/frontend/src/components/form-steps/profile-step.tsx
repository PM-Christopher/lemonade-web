"use client";
import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Label,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lemonade/ui";
import avatar_url from "@/image/avatar_1.png";
import Image from "next/image";
import { axiosInstance } from "@/lib/axiosInstane";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useFormik } from "formik";
import { profileSetupSchema } from "@lemonade/validation";
import { FormikButton } from "@/components/global/FormikButton";
import { authFailure, authStart, loadStop } from "@/features/authentication/authSlice";
import { useCookies } from "react-cookie";

interface ProfileInterface {
  loading: boolean;
  next_step: () => void;
}

const ProfileStep: React.FC<ProfileInterface> = ({ loading, next_step }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatar, setAvatar] = useState(null);
  const dispatch = useAppDispatch();
  const [cookie, setCookie, removeCookie] = useCookies(["token", "newToken"]);

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
      profile_image: "",
      bio: "",
      username: "",
      industry: "",
      referral_code: "",
    },
    validationSchema: profileSetupSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      await profileStep(values);
    },
  });

  const profileStep = async (values: any) => {
    dispatch(authStart());

    try {
      const { data } = await axiosInstance.post(
        "/user/profile/profile-set-up",
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

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change (when a file is selected)
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const { data } = await axiosInstance.post("/shared/utilities/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (data.success) {
          setAvatar(data.data.image);
          await formik.setFieldValue("profile_image", data.data.image);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Image uploaded",
              type: "success",
            }),
          );
        } else {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error uploading image",
              type: "error",
            }),
          );
        }
      } catch (err: any) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: err?.response?.data?.message || "error",
            type: "error",
          }),
        );
      }
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className="tablet:w-[480px] w-full rounded-[16px] border-none shadow-none">
        <CardHeader className="grid gap-4">
          <div className="flex gap-2">
            <div className="bg-step-color h-[2px] w-[15px]" />
            <div className="bg-border-grey h-[2px] w-[15px]" />
            <div className="bg-border-grey h-[2px] w-[15px]" />
            <div className="bg-border-grey h-[2px] w-[15px]" />
          </div>
          <div>
            <p className="font-sans text-[24px] font-semibold">Profile set up</p>
            <p className="text-text-grey font-sans text-[14px] leading-[21px] font-normal">
              Share a brief introduction about yourself, and your <br /> professional background.
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className={"flex justify-center"}>
            {avatar ? (
              <div
                style={{
                  background: `url("${avatar}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                onClick={handleImageClick}
                className="h-[80px] w-[80px] cursor-pointer rounded-[24px] border-[1px] border-[#3B4152]"
              ></div>
            ) : (
              <Image
                src={"/images/avatar_1.png"}
                alt="avatar"
                width={80}
                height={80}
                onClick={handleImageClick}
                className="cursor-pointer"
              />
            )}
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          {formik.touched.profile_image && formik.errors.profile_image ? (
            <p className="text-center text-[12px] text-[#FF8D8D]">{formik.errors.profile_image}</p>
          ) : null}
          <p className="text-meta text-center text-text-grey">Snap shot</p>
        </CardContent>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username" className="font-label">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="form-font bg-light_grey h-12 rounded-xl border-0"
              value={formik.values.username}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.touched.username && formik.errors.username ? (
              <p className="text-[12px] text-[#FF8D8D]">{formik.errors.username}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="username" className="font-label">
                Bio
              </Label>
              <span className="text-meta text-text-grey">200 characters</span>
            </div>
            <Textarea
              id="bio"
              placeholder="A short bio about yourself..."
              className="form-font bg-light_grey h-[99px] gap-[10px] rounded-xl border-0"
              value={formik.values.bio}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.touched.bio && formik.errors.bio ? (
              <p className="text-[12px] text-[#FF8D8D]">{formik.errors.bio}</p>
            ) : null}
          </div>
          <div className="my-2 grid gap-2">
            <Label htmlFor="email" className="font-label">
              Industry
            </Label>
            <Select
              onValueChange={(value) => formik.setFieldValue("industry", value)} // Update value with Formik
              value={formik.values.industry}
            >
              <SelectTrigger aria-label="Industry">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="form-font">
                <SelectItem value="Software Development">Software Development</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Health Care">Health Care</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.industry && formik.errors.industry ? (
              <p className="text-[12px] text-[#FF8D8D]">{formik.errors.industry}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="font-label">
              Referral code
            </Label>
            <Input
              id="referral_code"
              type="text"
              className="form-font bg-light_grey h-12 rounded-xl border-0"
              value={formik.values.referral_code}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </div>
        </CardContent>
        <CardContent className="flex flex-col space-y-2">
          <FormikButton
            loading={formik.isSubmitting}
            title="Next"
            error={formik.isValid}
            classes="w-full h-[48px] rounded-[12px]"
          />
        </CardContent>
      </Card>
    </form>
  );
};
export default ProfileStep;
