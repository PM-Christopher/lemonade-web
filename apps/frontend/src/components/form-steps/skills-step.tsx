'use client'
import React, {useEffect, useState} from "react"
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {FormikButton} from "@/components/global/FormikButton";

import {axiosInstance} from "@/lib/axiosInstane";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {checkError} from "@/lib/checkError";
import {useFormik} from "formik";
import * as yup from "yup";
import {authFailure, authStart, authSuccess, loadStop} from "@/features/authentication/authSlice";
import {useCookies} from "react-cookie";

interface SkillsInterface {
    loading: Boolean,
    next_step: () => void,
    prev_step: () => void
}

type FormValues = {
    skills: string[],
    interests: string[]
}

const SkillStep: React.FC<SkillsInterface> = ({loading, next_step, prev_step}) => {

    const dispatch = useAppDispatch();
    const [cookie, setCookie, removeCookie] = useCookies([
        "token",
        "newToken",
    ]);

    const getHeader = () => {
        const token = cookie.newToken;
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const skills = [
        "Creativity", "Leadership", "Problem-solving", "Critical thinking", "Work ethic"
    ]
    const interests = [
        "Arts", "Entertainment", "Science", "Sports", "Music", "Education", "Politics", "Religion", "Books", "Software", "Game", "History", "Health care", "Marketing"
    ]

    const handleSkillsClick = (item: string) => {
        const currentSkills = formik?.values?.skills;
        // Check if currentSkills is an array and then safely update it
        if (Array.isArray(currentSkills)) {
            const updatedSkills = currentSkills.includes(item)
                ? currentSkills.filter((i) => i !== item) // Remove if already in the array
                : [...currentSkills, item]; // Add if not in the array
            formik.setFieldValue('skills', updatedSkills);
        } else {
            // If currentSkills is not an array (which shouldn't happen if initialValues is set correctly)
            console.error('skills is not an array:', currentSkills);
        }
    };

    const handleInterestClick = (item: string) => {
        const currentInterests = formik?.values?.interests;
        // Check if currentInterests is an array and then safely update it
        if (Array.isArray(currentInterests)) {
            const updatedInterests = currentInterests.includes(item)
                ? currentInterests.filter((i) => i !== item) // Remove if already in the array
                : [...currentInterests, item]; // Add if not in the array
            formik.setFieldValue('interests', updatedInterests);
        } else {
            // If currentInterests is not an array (which shouldn't happen if initialValues is set correctly)
            console.error('interests is not an array:', currentInterests);
        }
    }

    //form validation
    const addressStepSchema = yup.object({
        skills: yup
            .array()
            .of(yup.string()) // Ensure it's an array of strings
            .min(3, "At least three skills are required") // Add min length validation to prevent empty arrays
            .required("Skills is required"), // Required field
        interests: yup
            .array()
            .of(yup.string()) // Ensure it's an array of strings
            .min(3, "At least three interests are required") // Add min length validation to prevent empty arrays
            .required("Interests is required"), // Required field
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            skills: [],
            interests: [],
        },
        validationSchema: addressStepSchema,
        onSubmit: async (values) => {
            await skillsStep(values)
        },
    })

    const skillsStep = async (values: any) => {
        dispatch(authStart())

        try {
            const { data } = await axiosInstance.post("/user/profile/skills-set-up", { ...values }, getHeader());
            console.log({data})
            if(data.status) {
                next_step()
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Something went wrong",
                        type: "error",
                    })
                );
            }
        } catch (err: any) {
            dispatch(authFailure());
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: err?.response?.data?.message || "error",
                    type: "error",
                })
            );
        } finally {
            dispatch(loadStop())
        }
    }


    return (
        <form onSubmit={formik.handleSubmit}>
            <Card className="w-full tablet:w-[480px] rounded-[16px] shadow-none border-none">
                <CardHeader className="grid gap-4">
                    <div className="flex gap-2">
                        <div className="w-[15px] h-[2px] bg-step-color"/>
                        <div className="w-[15px] h-[2px] bg-step-color"/>
                        <div className="w-[15px] h-[2px] bg-step-color"/>
                        <div className="w-[15px] h-[2px] bg-border-grey"/>
                    </div>
                    <div>
                        <p className="font-sans text-[24px] font-semibold">Skills & Interests</p>
                        <p className="font-sans text-[14px] leading-[21px] font-normal text-text-grey">
                            Maximize your connections and experience by telling us <br />
                            about your skills and interests.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 mt-[30px]">
                    <div>
                        <p className="font-semibold text-[18px] font-sans">Skills</p>
                    </div>
                    <div className="grid grid-cols-[repeat(3,auto)] gap-3">
                        {skills.map((item, idx) => (
                            <div
                                key={idx}
                                className={`text-[14px] font-normal inline-block p-2 py-[12px] rounded-lg whitespace-nowrap cursor-pointer text-center text-text-grey ${
                                    Array.isArray(formik.values.skills) && formik.values.skills.includes(item) ? 'bg-gradient-green text-white' : 'bg-light_grey'
                                }`}
                                onClick={() => handleSkillsClick(item)}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                    {checkError("skills", formik) ? (
                        <p className="text-[#FF8D8D] text-[12px]">
                            {formik.errors.skills}
                        </p>
                    ) : null}
                    <div className="mt-2">
                        <p className="font-semibold text-[18px] font-sans">Interests</p>
                    </div>
                    <div className="grid grid-cols-[repeat(4,auto)] gap-3">
                        {
                            interests.map((item, idx) => (
                                <div
                                    className={`text-[14px] font-normal inline-block p-2 py-[12px] rounded-lg whitespace-nowrap cursor-pointer text-center text-text-grey ${Array.isArray(formik.values.interests) && formik.values.interests.includes(item) ? 'bg-gradient-green text-white' : 'bg-light_grey'}`}
                                    key={idx}
                                    onClick={() => handleInterestClick(item)}
                                >{item}</div>
                            ))
                        }
                    </div>
                    {checkError("interests", formik) ? (
                        <p className="text-[#FF8D8D] text-[12px]">
                            {formik.errors.interests}
                        </p>
                    ) : null}
                </CardContent>
                <CardContent className="flex flex-col space-y-2">
                    <FormikButton loading={formik.isSubmitting} title="Next" error={formik.isValid} classes="w-full h-[48px] rounded-[12px]"/>
                </CardContent>
            </Card>
        </form>
    )
}
export default SkillStep