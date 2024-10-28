'use client'
import Link from "next/link"
import React, {useEffect, useState} from "react"
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
import logo_url from "@/image/logo.png"
import reset_password_url from "@/image/reset_password.png"
import AuthLayout from "@/components/layouts/AuthLayout";


export default function ResetPasswordPage() {
    const router  = useRouter()
    const [user, setUser] = useState({
        email: "",
        password: "",
        username:"",
    })

    const [loading, setLoading] = useState(false)

    const onSignup = async () => {
        try {
            setLoading(true)
            await axios.post("/api/users/signup", user)
            toast.success("Signup successfull")
            toast("Please check your inbox and click on verification link.", {duration: 10000})
            router.push("/login")
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
                        <Image src={logo_url} alt="logo" width={127} height={56}/>
                    </div>
                    <div>
                        <p className="border-2 rounded-xl font-sans p-[9px] px-[16px] text-bl">Login</p>
                    </div>
                </div>
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
                            <Image src={reset_password_url} alt="signup image" width={511.06} height={519.77}/>
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
                                />
                                <span className="text-[12px] font-sans text-grey-40">Password must be at least 8 character long</span>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="font-label">Confirm password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                                />
                            </div>
                        </CardContent>
                        <CardContent className="flex flex-col space-y-2">
                            <Button className="auth-button" onClick={onSignup}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Save password"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </AuthLayout>
    )
}