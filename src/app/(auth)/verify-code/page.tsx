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
import logo_url from "@/image/logo.png"
import verify_url from "@/image/verification.png"
import AuthLayout from "@/components/layouts/AuthLayout";


export default function VerifyCodePage() {
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
                            <p className="text-[40px] font-bold leading-[48px] font-ruso">Verification code</p>
                            <p className="text-[18px] font-normal leading-[27px] font-sans">
                                Enter the 4-digit code sent to tadeniyi@gmail.com <br/> to verify your account
                            </p>
                        </div>
                        <div>
                            <Image src={verify_url} alt="signup image" width={511.06} height={519.77}/>
                        </div>
                    </div>
                    <Card className="p-10 w-[480px]">
                        <CardContent className="flex justify-center">
                            <div className="flex gap-2">
                                <div
                                    className="app-icon-border flex justify-center items-center bg-light_grey border-light_grey"></div>
                                <div
                                    className="app-icon-border flex justify-center items-center bg-light_grey border-light_grey"></div>
                                <div
                                    className="app-icon-border flex justify-center items-center bg-light_grey border-light_grey"></div>
                                <div
                                    className="app-icon-border flex justify-center items-center bg-light_grey border-light_grey"></div>
                            </div>
                        </CardContent>
                        <CardContent className="flex justify-center mt-[10px] mb-[10px]">
                            <div>
                                <p className="font-sans font-semi-normal text-light-green text-[16px]">Resend code in 60
                                    secs</p>
                            </div>
                        </CardContent>
                        <CardContent className="flex flex-col space-y-2">
                            <Button className="auth-button" onClick={onSignup}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Verify"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </AuthLayout>
    )
}