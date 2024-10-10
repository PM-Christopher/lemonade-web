'use client'
import Link from "next/link"
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import Image from "next/image"
import image_url from "@/image/signup_image.png"
import logo_url from "@/image/logo.png"
import profile_ver_url from "@/image/profile_verification.png"
import ProfileStep from "@/components/form-steps/profile-step";
import AddressStep from "@/components/form-steps/address-step";
import SkillStep from "@/components/form-steps/skills-step";
import SocialStep from "@/components/form-steps/social-step";
import {useRequest} from "@/hooks/useRequest";
import {useCookies} from "react-cookie";



export default function SignupPage() {
    const router  = useRouter()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1);
    const [cookies, setCookie] = useCookies(["newToken"]);

    const getHeader = () => {
        const token = cookies.newToken;
        console.log({cookies})
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const { data } = useRequest("/profile/user", "GET", {}, true, getHeader());

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
        <section className="bg-gradient-light-green">
            <div className="flex flex-wrap items-center justify-between p-2 px-10">
                <div>
                    <Image src={logo_url} alt="logo" width={127} height={56}/>
                </div>
                <div>
                    <p className="border-2 rounded-xl font-sans p-[9px] px-[16px] text-bl">Login</p>
                </div>
            </div>
            <div className="min-h-screen flex flex-wrap items-start mt-20 justify-center gap-16">
                <div className="flex flex-col">
                    <div>
                        <p className="text-[18px] font-semibold leading-[48px] font-sans">Welcome,</p>
                        <p className="text-[40px] font-bold leading-[48px] font-ruso text-mid-green">Thomas Adeniyi</p>
                        <p className="text-[18px] font-normal leading-[27px] font-sans mt-[12px]">
                            Set up your account to optimize your experience <br /> on the Lemonade network. Don’t worry this will <br /> take less than a minute.
                        </p>
                    </div>
                    <div>
                        <Image src={profile_ver_url} alt="signup image" width={320}/>
                    </div>
                </div>
                {renderStep()}
            </div>
        </section>
    )
}