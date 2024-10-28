'use client'
import Link from "next/link"
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
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

import {checkError} from "@/lib/checkError";
import {useFormik} from "formik";
import * as yup from "yup";
import {FormikButton} from "@/components/global/FormikButton";
import {authFailure, authStart, authSuccess, loadStop} from "@/features/authentication/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {axiosInstance} from "@/lib/axiosInstane";
import {useCookies} from "react-cookie";
import { getTempError, setIsRouting, updateProperty } from "@/redux/tempSlice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {login} from "@/features/authentication/authApi";
import AuthLayout from "@/components/layouts/AuthLayout";



export default function LoginPage() {
    const router  = useRouter()
    const dispatch = useAppDispatch();
    const [cookie, setCookie] = useCookies(["token", "newToken"]);


    const [loading, setLoading] = useState(false)

    const loginSchema = yup.object({
        email: yup
            .string()
            .email("Please enter a valid email")
            .required("Email is required"),
        password: yup
            .string()
            .min(8)
            .required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            await login({...values}, dispatch, router, setCookie)
        },
    })


    return (
        <AuthLayout>
            <section className="bg-gradient-light-green">
                <div className="flex flex-wrap items-center justify-between p-2 px-10">
                    <div>
                        <Image src={logo_url} alt="logo" width={127} height={56}/>
                    </div>
                    <div>
                        <Link href="/signup">
                            <p className="border-2 rounded-xl font-sans p-[9px] px-[16px] text-bl">Sign up</p>
                        </Link>
                    </div>
                </div>
                <div className="min-h-screen flex flex-wrap items-start mt-10 justify-center gap-16">
                    <div className="flex flex-col">
                        <div>
                            <p className="text-[40px] font-bold leading-[48px] font-ruso">Login</p>
                            <p className="text-[18px] font-normal leading-[27px] font-sans mt-2">
                                Let's get you back into your account
                            </p>
                        </div>
                        <div>
                            <Image src={image_url} alt="signup image" width={511.06} height={519.77}/>
                        </div>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <Card className="p-10 w-[480px]">
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="font-label">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="e.g. Janedoe@example.com"
                                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="font-label">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </CardContent>
                            <CardContent className="flex flex-col space-y-2">
                                <FormikButton loading={formik.isSubmitting} title="Login" error={formik.isValid}/>
                                {/*<Button className="auth-button">*/}
                                {/*    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Login"}*/}
                                {/*</Button>*/}
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
                        </Card>
                    </form>
                </div>
            </section>
        </AuthLayout>
    )
}