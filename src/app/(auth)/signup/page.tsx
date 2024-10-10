'use client'
import Link from "next/link"
import React, {useEffect, useState} from "react"
import {useCookies} from "react-cookie";
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {checkError} from "@/lib/checkError";
import {useFormik} from "formik";
import * as yup from "yup";
import {signup} from "@/features/authentication/authApi";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import image_url from "@/image/signup_image.png"
import logo_url from "@/image/logo.png"
import apple_logo from "@/image/apple.png"
import google_logo from "@/image/google.png"
import facebook_logo from "@/image/facebook.png"
import {FormikButton} from "@/components/global/FormikButton";

type valuesType = {
    email: string;
    fullname: string;
    password: string;
};

export default function SignupPage() {
    const router  = useRouter()
    const dispatch = useAppDispatch();
    const [cookie, setCookie] = useCookies(["newToken"]);

    const passwordRules =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~])(?=.{8,})/;
    //form validation
    const signUpSchema = yup.object({
        fullname: yup
            .string()
            .required("Fullname is required"),
        email: yup
            .string()
            .email("Please enter a valid email")
            .required("Email is required"),
        password: yup
            .string()
            .min(8)
            .matches(passwordRules, {
                message:
                    "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
            })
            .required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            fullname: "",
            password: "",
        },
        validationSchema: signUpSchema,
        onSubmit: async (values) => {
            await signup({...values}, dispatch, router, setCookie)
        },
    })

    return (
        <section className="bg-gradient-light-green">
            <div className="flex flex-wrap items-center justify-between p-2 px-10">
                <div>
                    <Image src={logo_url} alt="logo" width={127} height={56}/>
                </div>
                <div>
                    <Link href="/login">
                        <p className="border-2 rounded-xl font-sans p-[9px] px-[16px] text-bl">Login</p>
                    </Link>
                </div>
            </div>
            <div className="min-h-screen flex flex-wrap items-start mt-52 justify-center gap-16">
                <div className="flex flex-col">
                    <div>
                        <p className="text-[40px] font-bold leading-[48px] font-ruso">Create account</p>
                        <p className="text-[18px] font-normal leading-[27px] font-sans">Join the network of diverse pool of talents.</p>
                    </div>
                    <div>
                        <Image src={image_url} alt="signup image" width={511.06} height={519.77}/>
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <Card className="p-10 w-[480px]">
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username" className="font-label">Full name</Label>
                                <Input
                                    id="fullname"
                                    type="text"
                                    placeholder="e.g. Jane Doe"
                                    value={formik.values.fullname}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                                />
                                {checkError("fullname", formik) ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.fullname}
                                    </p>
                                ) : null}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-label">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="e.g. Janedoe@example.com"
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                                />
                                {checkError("email", formik) ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.email}
                                    </p>
                                ) : null}

                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="font-label">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formik.values.password}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                                />
                                <span className="text-[12px] font-sans text-grey-40">Password must be at least 8 character long</span>
                                {checkError("password", formik) ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.password}
                                    </p>
                                ) : null}

                            </div>
                        </CardContent>
                        <CardContent className="flex flex-col space-y-2">
                            <FormikButton loading={formik.isSubmitting} title="Create account" error={formik.isValid} />
                        </CardContent>
                        <CardContent className="flex justify-center items-center gap-2">
                            <div className="w-20 h-[2px] bg-border-grey"/>
                            <div className="font-sans text-grey-light">
                                Or continue with
                            </div>
                            <div className="w-20 h-[2px] bg-border-grey"/>
                        </CardContent>
                        <CardContent className="flex justify-center items-center gap-2 mt-4">
                            <div className="app-icon-border flex justify-center items-center">
                                <Image src={apple_logo} alt="logo" width={24} height={24}/>
                            </div>
                            <div className="app-icon-border flex justify-center items-center">
                                <Image src={google_logo} alt="logo" width={24} height={24}/>
                            </div>
                            <div className="app-icon-border flex justify-center items-center">
                                <Image src={facebook_logo} alt="logo" width={24} height={24}/>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col justify-center mt-4">
                            <p className="font-sans text-[14px] font-normal">By continuing you agree with Lemonade network’s</p>
                            <p className="font-sans text-[14px] font-normal">Terms of Use and Privacy Policies</p>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </section>
    )
}