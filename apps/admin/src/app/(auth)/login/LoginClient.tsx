"use client";
import React from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { BrandLogo } from "@/components/global/BrandLogo";
import Link from "next/link";
import { Card, CardContent, Input, Label, FieldError } from "@lemonade/ui";
import { SubmitButton } from "@/components/global/SubmitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@lemonade/validation";
import { useLoginMutation } from "@/features/authentication/mutations";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { routes } from "@/lib/routes";
import { localLoginDefaults } from "@/lib/env.client";
import { useNavigation } from "@/hooks/useNavigation";
import { readNext } from "@/lib/post-auth-redirect";

function LoginPage({}) {
  const { push, getQueryParam } = useNavigation();
  const dispatch = useAppDispatch();
  const [, setCookie] = useCookies(["newToken"]);
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: localLoginDefaults(),
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      const result = await loginMutation.mutateAsync(values);

      if (result.needsOnboarding) {
        // Incomplete admin profile — keep a short-lived onboarding token.
        setCookie("newToken", result.token, {
          path: "/",
          maxAge: 3600 * 6,
          sameSite: false,
        });
        push(routes.PROFILE_SETUP);
        return;
      }

      dispatch(
        updateToastifyReducer({
          show: true,
          message: apiMessage("successful"),
          type: "success",
        }),
      );
      push(readNext(getQueryParam("next")));
    } catch (error) {
      dispatch(
        updateToastifyReducer({
          show: true,
          message:
            (error instanceof Error && error.message) || "Something went wrong. Please try again.",
          type: "error",
        }),
      );
    }
  };

  return (
    <AuthLayout>
      <section className="bg-light-grey h-full min-h-screen overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 px-10">
          <div>
            <BrandLogo />
          </div>
        </div>
        <div className="tablet:flex-row tablet:items-start tablet:px-4 mt-24 flex flex-col items-center justify-center gap-16">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="tablet:w-120 w-full rounded-2xl border-none p-6 shadow-sm">
              <CardContent className="tablet:gap-10 grid gap-6">
                <div>
                  <p className="font-ruso text-title-l leading-normal font-normal">Login</p>
                  <p className="text-text-grey text-body-s font-normal">
                    Login with your email address and password.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. Janedoe@example.com"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="password"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("password")}
                  />
                  <FieldError message={errors.password?.message} />
                </div>
                <Link
                  href={routes.FORGOT_PASSWORD}
                  className="text-light-green text-body-l font-medium underline"
                >
                  Forgot password?
                </Link>
                <SubmitButton
                  loading={isSubmitting}
                  title="Login"
                  isValid={isValid}
                  classes="w-full h-12 rounded-xl"
                />
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </AuthLayout>
  );
}

export default LoginPage;
