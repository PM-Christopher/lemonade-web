"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProfileStep from "@/components/form-steps/profile-step";
import AddressStep from "@/components/form-steps/address-step";
import SkillStep from "@/components/form-steps/skills-step";
import SocialStep from "@/components/form-steps/social-step";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ColorRing } from "react-loader-spinner";
import { ApiError } from "@lemonade/api-client";
import { useUserProfileQuery } from "@/features/settings/queries";
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";
import { useNavigation } from "@/hooks/useNavigation";

export default function ProfileStepsPage() {
  const { push } = useNavigation();
  const [loading] = useState(false);
  const [step, setStep] = useState(1);
  // Profile comes from the query, not Redux (Redux can outlive the session).
  const { data, isLoading, isError, error } = useUserProfileQuery();

  // Auth pages skip the global 401 redirect — send real auth failures to login.
  useEffect(() => {
    if (isError && error instanceof ApiError && error.kind === "auth") {
      push(routes.LOGIN);
    }
  }, [isError, error, push]);

  const suggestedStep =
    data?.bio === null
      ? 1
      : data?.address === null
        ? 2
        : data?.skills === null
          ? 3
          : data?.socials === null
            ? 4
            : null;
  const [seenProfile, setSeenProfile] = useState(data);
  if (data !== seenProfile && suggestedStep !== null) {
    setSeenProfile(data);
    setStep(suggestedStep);
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const onComplete: () => Promise<void> = async () => {
    push(routes.HOME);
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex h-full w-full items-center justify-center">
          <ColorRing visible={true} height="40" width="40" ariaLabel="loading profile" />
        </div>
      </AuthLayout>
    );
  }

  // Redirect is already in flight via the effect above — render nothing
  // rather than the form, so a visitor whose session just failed never
  // sees their old name or a usable-looking set of steps.
  if (isError) {
    return null;
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ProfileStep next_step={nextStep} loading={loading} />;
      case 2:
        return <AddressStep loading={loading} next_step={nextStep} prev_step={prevStep} />;
      case 3:
        return <SkillStep loading={loading} next_step={nextStep} prev_step={prevStep} />;
      case 4:
        return <SocialStep loading={loading} prev_step={prevStep} onComplete={onComplete} />;
      default:
        return <ProfileStep next_step={nextStep} loading={loading} />;
    }
  };

  return (
    <AuthLayout>
      <div className="mx-auto flex w-fit max-w-full items-start justify-center gap-10">
        <div className="tablet:flex hidden w-[400px] shrink-0 flex-col">
          <p className="text-title-l font-sans font-semibold">Welcome,</p>
          <p className="font-ruso text-mid-green text-display-xs font-bold">{data?.fullname}</p>
          <p className="text-body-xl text-text-grey mt-3 max-w-[26rem] font-sans font-normal">
            Set up your account to optimize your experience on the Lemonade network. Don&apos;t
            worry this will take less than a minute.
          </p>
          <Image
            src={images.PROFILE_VERIFICATION}
            alt=""
            width={320}
            height={361}
            className="mt-4 h-auto w-full object-contain"
          />
        </div>
        <div className="flex min-h-0 w-full max-w-[480px] shrink-0 flex-col overflow-y-auto">
          <div className="tablet:hidden mb-2">
            <p className="text-title-l font-sans font-semibold">Welcome,</p>
            <p className="font-ruso text-mid-green text-title-xl font-bold">{data?.fullname}</p>
          </div>
          {renderStep()}
        </div>
      </div>
    </AuthLayout>
  );
}
