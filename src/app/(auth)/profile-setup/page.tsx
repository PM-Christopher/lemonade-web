'use client'
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ProfileStep from "@/components/form-steps/profile-step";
import AddressStep from "@/components/form-steps/address-step";
import SkillStep from "@/components/form-steps/skills-step";
import SocialStep from "@/components/form-steps/social-step";
import {useRequest} from "@/hooks/useRequest";
import {useCookies} from "react-cookie";
import AuthLayout from "@/components/layouts/AuthLayout";
import {useSelector} from "react-redux";
import Link from "next/link";



export default function ProfileStepsPage() {
    const router  = useRouter()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1);
    const [cookies, setCookie] = useCookies(["newToken"]);
    const { user } = useSelector((state: any) => state.auth)

    const getHeader = () => {
        const token = cookies.newToken;
        console.log({cookies})
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const { data } = useRequest("/profile/user");

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const onComplete: () => Promise<void> = async () => {
        router.push("/")
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return <ProfileStep next_step={nextStep} loading={loading} />;
            case  2:
                return <AddressStep loading={loading} next_step={nextStep} prev_step={prevStep} />
            case  3:
                return <SkillStep loading={loading} next_step={nextStep} prev_step={prevStep} />
            case  4:
                return <SocialStep loading={loading} prev_step={prevStep} onComplete={onComplete} />
            default:
                return <ProfileStep next_step={nextStep} loading={loading} />;
        }
    };

    const checkStep = () => {
        if(data?.bio === null) {
            setStep(1)
        } else if (data?.address === null) {
            setStep(2)
        } else if (data?.skills === null) {
            setStep(3)
        } else if (data?.socials === null) {
            setStep(4)
        }
    }

    useEffect(() => {
        checkStep()
    }, [data])



    return (
        <AuthLayout>
            <section className="bg-white tablet:bg-gradient-light-green min-h-screen h-full overflow-hidden">
                <div className="flex flex-wrap items-center justify-between p-2 px-10">
                    <div>
                        <Link href={"/login"}>
                            <Image
                                src={"/images/logo.png"}
                                alt="logo"
                                width={127}
                                height={56}
                            />
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col mt-[16px] items-center tablet:items-start justify-center gap-[4px] tablet:gap-16 px-[16px] tablet:px-4 tablet:flex-row">
                    <div className="flex flex-col items-start w-full tablet:w-[438px] px-[16px]">
                        <div className="flex flex-col">
                            <p className="text-[24px] tablet:text-[18px] font-semibold leading-[48px] font-sans text-left w-[295px] ">Welcome,</p>
                            <p className="text-[24px] tablet:text-[32px] font-bold leading-[48px] font-ruso text-mid-green text-left w-[343px] tablet:w-[438px]">
                                {user?.fullname}
                            </p>
                            {/* Removed the outer div that had hidden class */}
                            <div className="hidden tablet:flex mt-[12px]">
                                <p className="text-[18px] font-normal leading-[27px] font-sans w-0 tablet:w-[438px]">
                                    Set up your account to optimize your experience <br/>
                                    on the Lemonade network. Don’t worry this will <br/>
                                    take less than a minute.
                                </p>
                            </div>
                        </div>
                        <div className="hidden tablet:flex mt-[24px]">
                            <Image src={'/images/profile_verification.png'} alt="signup image" width={320}
                                   height={361}/>
                        </div>
                    </div>
                    {renderStep()}
                </div>
            </section>
        </AuthLayout>
    )
}