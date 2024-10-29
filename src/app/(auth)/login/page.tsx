'use client'
import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

import {useFormik} from "formik";
import * as yup from "yup";
import {FormikButton} from "@/components/global/FormikButton";
import { useAppDispatch } from "@/redux/hook";
import {useCookies} from "react-cookie";
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
                        <Image src={"/images/logo.png"} alt="logo" width={127} height={56}/>
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
                            <Image src={"/images/signup_image.png"} alt="signup image" width={511.06} height={519.77}/>
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
                                    <Image src={"/images/apple.png"} alt="logo" width={24} height={24}/>
                                </div>
                                <div className="app-icon-border flex justify-center items-center">
                                    <Image src={'/images/google.png'} alt="logo" width={24} height={24}/>
                                </div>
                                <div className="app-icon-border flex justify-center items-center">
                                    <Image src={"/images/facebook.png"} alt="logo" width={24} height={24}/>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </section>
        </AuthLayout>
    )
}