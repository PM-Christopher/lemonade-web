"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { useFormik } from "formik";
import * as yup from "yup";
import { FormikButton } from "@/components/global/FormikButton";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { login } from "@/features/authentication/authApi";
import AuthLayout from "@/components/layouts/AuthLayout";
import {setIsRouting} from "@/redux/tempSlice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {authSuccess, authUser} from "@/features/authentication/authSlice";
import {useGoogleLogin} from "@react-oauth/google";
import {axiosInstance} from "@/lib/axiosInstane";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cookie, setCookie] = useCookies(["token", "newToken"]);

  const [loading, setLoading] = useState(false);

  const loginSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: yup.string().min(8).required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "harvegeorge@outlook.com",
      password: "password@12345",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await login({ ...values }, dispatch, router, setCookie);
    },
  });

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
    onSuccess: async (tokenResponse:any) => {
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
            <Link href="/signup">
              <p className="border-2 rounded-xl font-sans p-[9px] px-[16px] text-bl">
                Sign up
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col mt-24 items-center tablet:items-start justify-center gap-16 tablet:px-4 tablet:flex-row">
          <div className="flex flex-col phone:mb-[16px]">
            <div className="text-center phone:text-left">
              <p className="text-[40px] font-bold leading-[48px] font-ruso">
                Login
              </p>
              <p className="text-[18px] font-normal leading-[27px] font-sans mt-2">
                Let's get you back into your account
              </p>
            </div>
            {/* Show image only on desktop and laptop screens */}
            <div className="hidden tablet:flex">
              <Image
                src={"/images/signup_image.png"}
                alt="signup image"
                width={511.06}
                height={519.77}
              />
            </div>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <Card className="p-[24px] w-full tablet:w-[480px] rounded-[16px] shadow-none border-none">
              <CardContent className="grid gap-[24px] tablet:gap-[40px]">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="font-sans text-text-grey font-normal text-[14px]"
                  >
                    Email address
                  </Label>
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
                  <Label
                    htmlFor="password"
                    className="font-sans text-text-grey font-normal text-[14px]"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <Link href="/forgot-password">
                  <p className="font-sans text-bl underline text-light-green cursor-pointer">
                    Forgot password?
                  </p>
                </Link>
                <FormikButton
                  loading={formik.isSubmitting}
                  title="Login"
                  error={formik.isValid}
                  classes="w-full h-[48px] rounded-[12px]"
                />
                <div className="flex justify-around items-center">
                  <div className="w-[60px] h-[2px] bg-border-grey" />
                  <p className="text-grey-light font-normal text-[14px] text-center">
                    Or continue with
                  </p>
                  <div className="w-[60px] h-[2px] bg-border-grey" />
                </div>
                <div className="flex justify-center items-center gap-[24px] mt-4">
                  {/*<div className="app-icon-border flex justify-center items-center">*/}
                  {/*  <Image*/}
                  {/*    src={"/images/apple.png"}*/}
                  {/*    alt="logo"*/}
                  {/*    width={24}*/}
                  {/*    height={24}*/}
                  {/*  />*/}
                  {/*</div>*/}
                  <div className="app-icon-border flex justify-center items-center cursor-pointer" onClick={() => googleLogin()}>
                    <Image src={'/images/google.png'} alt="logo" width={24} height={24}/>
                  </div>
                  {/*<div className="app-icon-border flex justify-center items-center">*/}
                  {/*  <Image*/}
                  {/*    src={"/images/facebook.png"}*/}
                  {/*    alt="logo"*/}
                  {/*    width={24}*/}
                  {/*    height={24}*/}
                  {/*  />*/}
                  {/*</div>*/}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </AuthLayout>
  );
}
