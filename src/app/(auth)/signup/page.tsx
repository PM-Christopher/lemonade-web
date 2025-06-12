'use client'
import Link from "next/link"
import React from "react"
import {useCookies} from "react-cookie";
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/redux/hook";
import {checkError} from "@/lib/checkError";
import {useFormik} from "formik";
import * as yup from "yup";
import {signup} from "@/features/authentication/authApi";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import {FormikButton} from "@/components/global/FormikButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import axios from 'axios';
import {axiosInstance} from "@/lib/axiosInstane";
import {setIsRouting} from "@/redux/tempSlice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {authSuccess, authUser} from "@/features/authentication/authSlice";
import { useGoogleLogin } from '@react-oauth/google';

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

    const handleLoginSuccess = async (res: any) => {
        try {
            console.log({res})

            if (res.status) {
                dispatch(setIsRouting(true));
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Successful",
                        type: "success",
                    })
                );

                if (res.data.data.token_type === 'account_verification_token') {
                    setCookie("newToken", res.data.data.token, {
                        path: "/",
                        maxAge: 3600 * 6, // Expires after 6hrs
                        sameSite: false,
                    });
                    dispatch(authUser(res?.data?.data));
                    router.push("/verify-email");
                } else {
                    const user = res.data?.data?.user
                    if (user.status == 0) {
                        setCookie("newToken", res.data.data.token, {
                            path: "/",
                            maxAge: 3600 * 6, // Expires after 6hrs
                            sameSite: false,
                            // domain: env === 'development' ? '' : ''
                        });
                        router.push("/verify-email");
                    } else if(user.username === null) {
                        setCookie("newToken", res.data.data.token, {
                            path: "/",
                            maxAge: 3600 * 6, // Expires after 6hrs
                            sameSite: false,
                            // domain: env === 'development' ? '' : ''
                        });
                        router.push("/profile-setup");
                    } else {
                        setCookie("token", res.data.data.token, {
                            path: "/",
                            maxAge: 3600 * 6, // Expires after 6hrs
                            sameSite: false,
                        });
                        dispatch(
                            updateToastifyReducer({
                                show: true,
                                message: "successful",
                                type: "success",
                            })
                        );
                        dispatch(authSuccess(res.data.data));
                        setTimeout(() => {
                            router.push("/");
                        }, 500);
                    }
                }
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: res.message || "error",
                        type: "error",
                    })
                );
            }

        } catch (error) {
            console.error(error);
            alert('Login failed!');
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Auth Code Response:', tokenResponse);

            // Send the codeResponse.code to your Laravel backend to exchange for tokens (including ID Token)
            try {
                const res = await axiosInstance.post(`/auth/google`, {
                    token: tokenResponse.access_token
                });

                await handleLoginSuccess(res)

            } catch (error) {
                console.error('Error sending code to backend:', error);
            }
        },
        onError: () => {
            alert('Login Failed');
        },
        flow: 'implicit'  // or 'auth-code' if you’re using code flow
    });

    return (
        <AuthLayout>
            <section className="bg-gradient-light-green min-h-screen h-full overflow-hidden">
                <div className="flex flex-wrap items-center justify-between p-2 px-10">
                    <Link href="/login">
                        <Image src={"/images/logo.png"} alt="logo" width={127} height={56}/>
                    </Link>
                    <div>
                        <Link href="/login">
                            <p className="border-2 rounded-xl font-sans p-[9px] px-[16px] text-bl">Login</p>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col mt-24 items-center tablet:items-start justify-center gap-16 tablet:px-4 tablet:flex-row">
                    <div className="flex flex-col phone:mb-[16px]">
                        <div className="text-center phone:text-left">
                            <p className="text-[40px] font-bold leading-[48px] font-ruso">Create account</p>
                            <p className="text-[18px] font-normal leading-[27px] font-sans">Join the network of diverse
                                pool of talents.</p>
                        </div>
                        <div className="hidden tablet:flex">
                            <Image src={"/images/signup_image.png"} alt="signup image" width={511.06} height={519.77}/>
                        </div>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <Card className="p-[24px] w-full tablet:w-[480px] rounded-[16px] shadow-none border-none">
                            <CardContent className="grid gap-[24px] tablet:gap-[40px]">
                                <div className="grid gap-2">
                                    <Label htmlFor="username"
                                           className="font-sans text-text-grey font-normal text-[14px]">Full
                                        name</Label>
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
                                    <Label htmlFor="email" className="font-sans text-text-grey font-normal text-[14px]">Email
                                        address</Label>
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
                                    <Label htmlFor="password"
                                           className="font-sans text-text-grey font-normal text-[14px]">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formik.values.password}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                                    />

                                    {checkError("password", formik) ? (
                                        <p className="text-[#FF8D8D] text-[12px]">
                                            {formik.errors.password}
                                        </p>
                                    ) : null}

                                </div>
                                <FormikButton loading={formik.isSubmitting} title="Create account"
                                              error={formik.isValid} classes="w-full h-[48px] rounded-[12px]"/>
                                <div className="flex justify-around items-center">
                                    <div className="w-[60px] h-[2px] bg-border-grey"/>
                                    <p className="text-grey-light font-normal text-[14px] text-center">Or continue
                                        with</p>
                                    <div className="w-[60px] h-[2px] bg-border-grey"/>
                                </div>
                                <div className="flex justify-center items-center gap-[24px] mt-4">
                                    <div className="app-icon-border flex justify-center items-center">
                                        <Image src={"/images/apple.png"} alt="logo" width={24} height={24}/>
                                    </div>
                                    <div className="app-icon-border flex justify-center items-center cursor-pointer" onClick={() => googleLogin()}>
                                        <Image src={'/images/google.png'} alt="logo" width={24} height={24}/>
                                    </div>
                                    <div className="app-icon-border flex justify-center items-center">
                                        <Image src={"/images/facebook.png"} alt="logo" width={24} height={24}/>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col justify-center mt-4">
                                <p className="text-[14px] font-normal w-[295px] tablet:w-[384px] text-center">By continuing you agree with Lemonade
                                    network’s <span className="text-mid-green underline cursor-pointer">Terms of Use</span> and <span className="text-mid-green underline cursor-pointer">Privacy Policies</span> </p>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </section>
        </AuthLayout>
    )
}