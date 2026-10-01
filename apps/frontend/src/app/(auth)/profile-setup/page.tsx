"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileStep from "@/components/form-steps/profile-step";
import AddressStep from "@/components/form-steps/address-step";
import SkillStep from "@/components/form-steps/skills-step";
import SocialStep from "@/components/form-steps/social-step";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useUserProfileQuery } from "@/features/settings/queries";

export default function ProfileStepsPage() {
  const router = useRouter();
  const [loading] = useState(false);
  const [step, setStep] = useState(1);
  const { user } = useSelector((state: RootState) => state.auth);
  // No token needed — the BFF proxy reads the onboarding cookie
  // server-side for exactly this pre-session case (see
  // app/api/v1/[...path]/route.ts's onboardingToken handling).
  const { data } = useUserProfileQuery();

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
    router.push("/");
  };

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
      <div className="flex h-full w-full max-w-[1180px] items-center justify-center gap-10">
        <div className="tablet:flex hidden min-w-0 flex-col">
          <p className="text-title-l font-sans font-semibold">Welcome,</p>
          <p className="font-ruso text-mid-green text-display-xs font-bold">{user?.fullname}</p>
          <p className="text-body-xl text-text-grey mt-3 max-w-[26rem] font-sans font-normal">
            Set up your account to optimize your experience on the Lemonade network. Don&apos;t
            worry this will take less than a minute.
          </p>
          <Image
            src="/images/profile_verification.png"
            alt=""
            width={320}
            height={361}
            className="mt-4 h-auto max-h-[40vh] w-auto object-contain"
          />
        </div>
        <div className="flex h-full min-h-0 w-full max-w-[480px] flex-col justify-center overflow-y-auto">
          <div className="tablet:hidden mb-2">
            <p className="text-title-l font-sans font-semibold">Welcome,</p>
            <p className="font-ruso text-mid-green text-title-xl font-bold">{user?.fullname}</p>
          </div>
          {renderStep()}
        </div>
      </div>
    </AuthLayout>
  );
}
