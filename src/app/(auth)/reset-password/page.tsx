'use client'
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import AuthLayout from "@/components/layouts/AuthLayout";
import {axiosInstance} from "@/lib/axiosInstane";
import {useAppDispatch} from "@/redux/hook";
import {useCookies} from "react-cookie";
import {useSelector} from "react-redux";
import Link from "next/link";
import {RootState} from "@/redux/store";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {resetPassword} from "@/features/authentication/authSlice";
import * as yup from "yup";
import {useFormik} from "formik";


export default function ResetPasswordPage() {
    const router  = useRouter()
    const dispatch = useAppDispatch();
    const { loading } = useSelector((state: RootState) => state.auth)
    const [cookie, setCookie, removeCookie] = useCookies([
        "token",
        "newToken",
    ]);

    const resetPasswordSchema = yup.object({
        password: yup
            .string()
            .required("Password is required"),

        confirm_password: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Confirm password is required"),
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            confirm_password: "",
        },
        validationSchema: resetPasswordSchema,
        onSubmit: async (values) => {
            await onSignup(values)
        },
    })

    const onSignup = async (values: any) => {
        try {
            const { payload } = await dispatch(resetPassword({token: cookie.newToken, data: {password: values.password, confirm_password: values.confirm_password}}))
            if (payload.status) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Password reset successfully",
                        type: "success",
                    })
                );
                router.push("/login")
            }
        } catch (error: any) {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: error.message,
                    type: "error",
                })
            );
        }
    }


    return (
        <AuthLayout>
            <section className="bg-gradient-light-green">
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
                    <div>
                        <Link href="/login">
                            <p className="border-2 rounded-xl font-sans p-[9px] px-[16px] text-bl">Login</p>
                        </Link>
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="min-h-screen flex flex-wrap items-start mt-10 justify-center gap-16">
                        <div className="flex flex-col">
                            <div>
                                <p className="text-[40px] font-bold leading-[48px] font-ruso">Reset password</p>
                                <p className="text-[18px] font-normal leading-[27px] font-sans mt-2">
                                    Stronger password, stronger protection! Combine <br/> uppercase, lowercase, numbers, and
                                    symbols to <br/> protect your account.
                                </p>
                            </div>
                            <div>
                                <Image src={"/images/reset_password.png"} alt="signup image" width={511.06} height={519.77}/>
                            </div>
                        </div>
                        <Card className="p-10 w-[480px]">
                            <CardContent className="grid gap-4">
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
                                    <span className="text-[12px] font-sans text-grey-40">Password must be at least 8 character long</span>
                                    {formik.touched.password && formik.errors.password ? (
                                        <p className="text-[#FF8D8D] text-[12px] text-left">
                                            {formik.errors.password}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="font-label">Confirm password</Label>
                                    <Input
                                        id="confirm_password"
                                        type="password"
                                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                                        value={formik.values.confirm_password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.confirm_password && formik.errors.confirm_password ? (
                                        <p className="text-[#FF8D8D] text-[12px] text-left">
                                            {formik.errors.confirm_password}
                                        </p>
                                    ) : null}
                                </div>
                            </CardContent>
                            <CardContent className="flex flex-col space-y-2">
                                <Button
                                    type="submit"
                                    disabled={loading || !formik.isValid || !formik.dirty}
                                    aria-busy={loading}
                                    aria-disabled={loading || !formik.isValid}
                                    className={`w-full h-12 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200
                                ${loading || !formik.isValid
                                        ? "bg-green-700 cursor-not-allowed opacity-90"
                                        : "bg-gradient-green hover:brightness-110 active:scale-[0.98]"}
                                    `}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        "Save password"
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </section>
        </AuthLayout>
    )
}