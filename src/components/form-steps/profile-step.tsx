'use client'
import React, {useEffect, useRef, useState} from "react"
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Loader2} from "lucide-react";
import avatar_url from "@/image/avatar_1.png"
import Image from "next/image";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {axiosInstance} from "@/lib/axiosInstane";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {checkError} from "@/lib/checkError";
import {useFormik} from "formik";
import * as yup from "yup";
import {FormikButton} from "@/components/global/FormikButton";
import {authFailure, authStart, authSuccess, loadStop} from "@/features/authentication/authSlice";
import {useCookies} from "react-cookie";


interface ProfileInterface {
    loading: Boolean,
    next_step: () => void
}

const ProfileStep: React.FC<ProfileInterface> = ({loading, next_step}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [avatar, setAvatar] = useState(null)
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

    //form validation
    const profileStepSchema = yup.object({
        profile_image: yup
            .string()
            .required("Profile image is required"),
        bio: yup
            .string()
            .required("Bio is required"),
        username: yup
            .string()
            .required("Username is required"),
        industry: yup
            .string()
            .required("Industry is required"),
        referral_code: yup
            .string()
    });

    const formik = useFormik({
        initialValues: {
            profile_image: "",
            bio: "",
            username: "",
            industry: "",
            referral_code: "",
        },
        validationSchema: profileStepSchema,
        onSubmit: async (values) => {
            await profileStep(values)
        },
    })

    const profileStep = async (values: any) => {
        dispatch(authStart())

        try {
            const { data } = await axiosInstance.post("/profile/profile-set-up", { ...values }, getHeader());
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

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle file input change (when a file is selected)
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData()
            formData.append("file", file)
            try {
                const { data } = await axiosInstance.post("/upload", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                console.log({data})
                if(data.status) {
                    setAvatar(data.data.image)
                    await formik.setFieldValue("profile_image", data.data.image)
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Image uploaded",
                            type: "success",
                        })
                    );
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Error uploading image",
                            type: "error",
                        })
                    );
                }
            } catch (err: any) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: err?.response?.data?.message || "error",
                        type: "error",
                    })
                );
            }
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Card className="p-[20px] w-[480px]">
                <CardHeader className="grid gap-4">
                    <div className="flex gap-2">
                        <div className="w-[15px] h-[2px] bg-step-color"/>
                        <div className="w-[15px] h-[2px] bg-border-grey"/>
                        <div className="w-[15px] h-[2px] bg-border-grey"/>
                        <div className="w-[15px] h-[2px] bg-border-grey"/>
                    </div>
                    <div>
                        <p className="font-sans text-[24px] font-semibold">Profile set up</p>
                        <p className="font-sans text-[14px] leading-[21px] font-normal text-text-grey">
                            Share a brief introduction about yourself, and your <br /> professional background.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <div>
                        {
                            avatar ? (
                                <div style={{background: `url("${avatar}")`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat"}} onClick={handleImageClick} className="w-[80px] h-[80px] cursor-pointer rounded-[24px] border-[1px] border-[#3B4152]"></div>
                            ) : (
                                <Image src={avatar_url} alt="avatar" width={80}  onClick={handleImageClick} className="cursor-pointer" />
                            )
                        }
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>
                </CardContent>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username" className="font-label">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Username"
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                            value={formik.values.username}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.username ? (
                            <p className="text-[#FF8D8D] text-[12px]">
                                {formik.errors.username}
                            </p>
                        ) : null}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="username" className="font-label">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="A short bio about yourself..."
                            className="h-[99px] rounded-xl bg-light_grey form-font border-0 gap-[10px]"
                            value={formik.values.bio}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.bio ? (
                            <p className="text-[#FF8D8D] text-[12px]">
                                {formik.errors.bio}
                            </p>
                        ) : null}
                    </div>
                    <div className="grid gap-2 my-2">
                        <Label htmlFor="email" className="font-label">Industry</Label>
                        <Select
                            onValueChange={(value) => formik.setFieldValue('industry', value)} // Update value with Formik
                            value={formik.values.industry}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select"/>
                            </SelectTrigger>
                            <SelectContent className="form-font">
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                        {formik.errors.industry ? (
                            <p className="text-[#FF8D8D] text-[12px]">
                                {formik.errors.industry}
                            </p>
                        ) : null}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="font-label">Referral code</Label>
                        <Input
                            id="referral_code"
                            type="text"
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                            value={formik.values.referral_code}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                        />
                    </div>
                </CardContent>
                <CardContent className="flex flex-col space-y-2">
                    <FormikButton loading={formik.isSubmitting} title="Next" error={formik.isValid}/>
                </CardContent>
            </Card>
        </form>
    )
}
export default ProfileStep