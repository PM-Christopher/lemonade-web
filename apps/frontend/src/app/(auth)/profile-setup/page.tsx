"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileStep from "@/components/form-steps/profile-step";
import AddressStep from "@/components/form-steps/address-step";
import SkillStep from "@/components/form-steps/skills-step";
import SocialStep from "@/components/form-steps/social-step";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/redux/store";
import { useUserProfileQuery } from "@/features/settings/queries";

export default function ProfileStepsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { user } = useSelector((state: RootState) => state.auth);
  // No token needed — the BFF proxy reads the onboarding cookie
  // server-side for exactly this pre-session case (see
  // app/api/v1/[...path]/route.ts's onboardingToken handling).
  const { data } = useUserProfileQuery();

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

  const checkStep = useCallback(() => {
    if (data?.bio === null) {
      setStep(1);
    } else if (data?.address === null) {
      setStep(2);
    } else if (data?.skills === null) {
      setStep(3);
    } else if (data?.socials === null) {
      setStep(4);
    }
  }, [data]);

  useEffect(() => {
    checkStep();
  }, [checkStep]);

  return (
    <section>
      <section className="h-full min-h-screen overflow-hidden bg-white tablet:bg-gradient-light-green">
        <div className="flex flex-wrap items-center justify-between p-2 px-10">
          <div>
            <Link href={"/login"}>
              <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
            </Link>
          </div>
        </div>
        <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] px-[16px] tablet:flex-row tablet:items-start tablet:gap-16 tablet:px-4">
          <div className="flex w-full flex-col items-start px-[16px] tablet:w-[438px]">
            <div className="flex flex-col">
              <p className="w-[295px] text-left font-sans text-[24px] font-semibold leading-[48px] tablet:text-[18px]">
                Welcome,
              </p>
              <p className="w-[343px] text-left font-ruso text-[24px] font-bold leading-[48px] text-mid-green tablet:w-[438px] tablet:text-[32px]">
                {user?.fullname}
              </p>
              {/* Removed the outer div that had hidden class */}
              <div className="mt-[12px] hidden tablet:flex">
                <p className="w-0 font-sans text-[18px] font-normal leading-[27px] tablet:w-[438px]">
                  Set up your account to optimize your experience <br />
                  on the Lemonade network. Don’t worry this will <br />
                  take less than a minute.
                </p>
              </div>
            </div>
            <div className="mt-[24px] hidden tablet:flex">
              <Image
                src={"/images/profile_verification.png"}
                alt="signup image"
                width={320}
                height={361}
              />
            </div>
          </div>
          {renderStep()}
        </div>
      </section>
    </section>
  );
}
