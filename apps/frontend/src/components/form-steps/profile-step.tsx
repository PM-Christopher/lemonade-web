"use client";
import { images } from "@/lib/images";
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, Label, Input, Textarea, FieldError } from "@lemonade/ui";
import Image from "next/image";
import { authApi } from "@/features/authentication/api";
import { sharedApi } from "@/features/shared/api";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { isImageFile } from "@/lib/files";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSetupSchema, type ProfileSetupInput } from "@lemonade/validation";
import { applyServerErrors } from "@/lib/form-errors";
import { SubmitButton } from "@/components/global/SubmitButton";
import { IndustrySelect } from "@/components/global/IndustrySelect";
import { authFailure, authStart, loadStop } from "@/features/authentication/authSlice";
import { errorMessage } from "@/lib/api-error";

interface ProfileInterface {
  loading: boolean;
  next_step: () => void;
}

const ProfileStep: React.FC<ProfileInterface> = ({ next_step }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ProfileSetupInput>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: { profile_image: "", bio: "", username: "", industry: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: ProfileSetupInput) => {
    dispatch(authStart());

    try {
      await authApi.profileSetUp(values);
      next_step();
    } catch (err) {
      dispatch(authFailure());
      if (applyServerErrors(err, setError, ["username", "bio", "industry", "profile_image"]))
        return;
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

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change (when a file is selected)
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isImageFile(file)) {
      event.target.value = "";
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Please choose an image file",
          type: "error",
        }),
      );
      return;
    }
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const result = await sharedApi.uploadFile(formData);
        setAvatar(result.image);
        setValue("profile_image", result.image, { shouldValidate: true });
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Image uploaded",
            type: "success",
          }),
        );
      } catch (err) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(err, "error"),
            type: "error",
          }),
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="tablet:w-120 w-full rounded-2xl border-none p-6 shadow-none">
        <CardHeader className="grid gap-4 p-0">
          <div className="flex gap-2">
            <div className="bg-step-color h-0.5 w-3.75" />
            <div className="bg-border-grey h-0.5 w-3.75" />
            <div className="bg-border-grey h-0.5 w-3.75" />
            <div className="bg-border-grey h-0.5 w-3.75" />
          </div>
          <div>
            <p className="text-title-l font-sans leading-normal font-semibold">Profile set up</p>
            <p className="text-text-grey text-body-s font-sans font-normal">
              Share a brief introduction about yourself, and your <br /> professional background.
            </p>
          </div>
        </CardHeader>
        <CardContent className="mt-4 grid gap-4 p-0">
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
                className="h-20 w-20 cursor-pointer rounded-3xl border border-[#3B4152]"
              ></div>
            ) : (
              <Image
                src={images.AVATAR_1}
                alt="avatar"
                width={80}
                height={80}
                onClick={handleImageClick}
                className="cursor-pointer"
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <FieldError message={errors.profile_image?.message} />
          <p className="text-meta text-text-grey text-center">Snap shot</p>
        </CardContent>
        <CardContent className="mt-4 grid gap-4 p-0">
          <div className="grid gap-2">
            <Label htmlFor="username" className="font-label">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="form-font bg-light_grey h-12 rounded-xl border-0"
              {...register("username")}
            />
            <FieldError message={errors.username?.message} />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio" className="font-label">
                Bio
              </Label>
              <span className="text-meta text-text-grey">200 characters</span>
            </div>
            <Textarea
              id="bio"
              placeholder="A short bio about yourself..."
              className="form-font bg-light_grey h-24.75 gap-2.5 rounded-xl border-0"
              {...register("bio")}
            />
            <FieldError message={errors.bio?.message} />
          </div>
          <div className="my-2 grid gap-2">
            <Label htmlFor="industry" className="font-label">
              Industry
            </Label>
            <Controller
              control={control}
              name="industry"
              render={({ field }) => (
                <IndustrySelect
                  id="industry"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <FieldError message={errors.industry?.message} />
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
export default ProfileStep;
