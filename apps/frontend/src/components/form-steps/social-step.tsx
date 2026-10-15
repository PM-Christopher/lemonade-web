"use client";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React from "react";
import { Card, CardContent, CardHeader } from "@lemonade/ui";
import Image from "next/image";

import { useCompleteOnboardingMutation } from "@/features/authentication/mutations";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialHandlesSchema, type SocialHandlesInput } from "@/features/authentication/schema";
import { SubmitButton } from "@/components/global/SubmitButton";
import { authFailure, authStart, loadStop } from "@/features/authentication/authSlice";
import { errorMessage } from "@/lib/api-error";

interface SocialInterface {
  loading: boolean;
  prev_step: () => void;
  onComplete: () => void;
}

const SocialStep: React.FC<SocialInterface> = () => {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();
  const completeOnboarding = useCompleteOnboardingMutation();
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<SocialHandlesInput>({
    resolver: zodResolver(socialHandlesSchema),
    defaultValues: { facebook: "", linkedin: "", twitter: "", instagram: "" },
  });

  const onSubmit = async (socials: SocialHandlesInput) => {
    const requestBody = {
      socials: (Object.keys(socials) as Array<keyof SocialHandlesInput>)
        .filter((key) => socials[key])
        .map((key) => ({ name: key, value: socials[key] })),
    };

    dispatch(authStart());
    try {
      // Starts the session server-side and clears the onboarding cookie.
      await completeOnboarding.mutateAsync(requestBody);
      dispatch(
        updateToastifyReducer({
          show: true,
          message: apiMessage("Account created successfully"),
          type: "success",
        }),
      );
      push(routes.HOME);
    } catch (err) {
      dispatch(authFailure());
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
      <Card className="tablet:w-120 w-full rounded-2xl border-none p-6 shadow-none">
        <CardHeader className="grid gap-4 p-0">
          <div className="flex gap-2">
            <div className="bg-step-color h-0.5 w-3.75" />
            <div className="bg-step-color h-0.5 w-3.75" />
            <div className="bg-step-color h-0.5 w-3.75" />
            <div className="bg-step-color h-0.5 w-3.75" />
          </div>
          <div>
            <p className="text-title-l font-sans leading-normal font-semibold">
              Link your social profiles
            </p>
            <p className="text-text-grey text-body-s font-sans font-normal">
              Good job! Now add your social profile usernames to <br />
              stay connected with others.
            </p>
          </div>
        </CardHeader>
        <CardContent className="mt-6 grid gap-4 p-0">
          {(
            [
              { name: "facebook", icon: images.FACEBOOK },
              { name: "linkedin", icon: images.LINKEDIN },
              { name: "twitter", icon: images.TWITTER },
              { name: "instagram", icon: images.INSTAGRAM },
            ] as const
          ).map((field) => (
            <label
              key={field.name}
              htmlFor={field.name}
              className="bg-light_grey focus-within:border-step-color flex h-14 w-full items-center gap-3 rounded-xl border border-transparent px-5"
            >
              <Image src={field.icon} alt="" width={20} height={20} className="h-5 w-5 shrink-0" />
              <input
                id={field.name}
                type="text"
                className="form-font placeholder:text-text-grey h-full w-full min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none outline-none focus:border-0 focus:ring-0 focus:outline-none focus-visible:outline-none"
                placeholder="Username"
                {...register(field.name)}
              />
            </label>
          ))}
        </CardContent>
        <CardContent className="mt-4 flex flex-col p-0">
          <div className="mt-2 mb-6 flex justify-center">
            <button
              type="submit"
              className="font-semi-normal text-light-green text-body-l cursor-pointer border-none bg-transparent text-center font-sans"
            >
              Skip
            </button>
          </div>
          <SubmitButton
            loading={isSubmitting}
            title="Done"
            isValid={isValid}
            classes="w-full h-12 rounded-xl"
          />
        </CardContent>
      </Card>
    </form>
  );
};
export default SocialStep;
