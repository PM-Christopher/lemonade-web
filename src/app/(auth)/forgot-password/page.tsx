'use client'
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
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
import {useCookies} from "react-cookie";
import Link from "next/link";


export default function ForgotPasswordPage() {
    const router  = useRouter()
    const [email, setEmail] = useState("")
    const [cookie, setCookie] = useCookies(["newToken", "email"]);
    const [loading, setLoading] = useState(false)

    const onSignup = async () => {
        try {
            setLoading(true)
            const res = await axiosInstance.post("/auth/forgot-password", {email})
            if (res.status === 200) {
                setLoading(false)
                toast("Please check your inbox and click on verification link.", {duration: 10000})
                setCookie("newToken", res?.data?.data.token, {
                    path: "/",
                    maxAge: 3600 * 6, // Expires after 6hrs
                    sameSite: false,
                    // domain: env === 'development' ? '' : ''
                });
                setCookie("email", res?.data?.data.email, {
                    path: "/",
                    maxAge: 3600 * 6, // Expires after 6hrs
                    sameSite: false,
                    // domain: env === 'development' ? '' : ''
                });
                router.push("/verify-code")
            }
        } catch (error: any) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }


    return (
        <AuthLayout>
            <section className="bg-gradient-light-green">
                <div className="flex flex-wrap items-center justify-between p-2 px-10">
                    <div>
                        <Link href={"/login"}>
                            <Image src={"/images/logo.png"}
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
                <div className="min-h-screen flex flex-wrap items-start mt-10 justify-center gap-16">
                    <div className="flex flex-col">
                        <div>
                            <p className="text-[40px] font-bold leading-[48px] font-ruso">Forgot Password</p>
                            <p className="text-[18px] font-normal leading-[27px] font-sans mt-2">
                                Enter your email address and a 4-digit code will <br/> be sent to reset your password.
                            </p>
                        </div>
                        <div>
                            <Image src={"/images/forgot_password.png"} alt="signup image" width={511.06} height={519.77}/>
                        </div>
                    </div>
                    <Card className="p-10 w-[480px]">
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-label">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="e.g. Janedoe@example.com"
                                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardContent className="flex flex-col space-y-2">
                            <Button className="w-full h-12 bg-gradient-green" onClick={onSignup}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Send code"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </AuthLayout>
    )
}