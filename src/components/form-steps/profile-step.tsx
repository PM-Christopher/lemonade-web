'use client'
import React, {useEffect, useState} from "react"
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Loader2} from "lucide-react";
import avatar_url from "@/image/avatar_1.png"
import Image from "next/image";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface ProfileInterface {
    loading: Boolean,
    next_step: () => void
}

const ProfileStep: React.FC<ProfileInterface> = ({loading, next_step}) => {
    return (
        <Card className="p-[20px] w-[480px]">
            <CardHeader className="grid gap-4">
                <div className="flex gap-2">
                    <div className="w-[15px] h-[2px] bg-step-color"/>
                    <div className="w-[15px] h-[2px] bg-border-grey"/>
                    <div className="w-[15px] h-[2px] bg-border-grey"/>
                    <div className="w-[15px] h-[2px] bg-border-grey"/>
                </div>
                <div>
                    <p className="font-sans text-[24px] font-semibold">Profile set up</p>
                    <p className="font-sans text-[14px] leading-[21px] font-normal text-text-grey">
                        Share a brief introduction about yourself, and your <br /> professional background.
                    </p>
                </div>
            </CardHeader>
            <CardContent className="flex justify-center">
                <div>
                    <Image src={avatar_url} alt="avatar" width={80} />
                </div>
            </CardContent>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="username" className="font-label">Bio</Label>
                    <Textarea
                        id="username"
                        placeholder="A short bio about yourself..."
                        className="h-[99px] rounded-xl bg-light_grey form-font border-0 gap-[10px]"
                    />
                </div>
                <div className="grid gap-2 my-2">
                    <Label htmlFor="email" className="font-label">Industry</Label>
                    <Select>
                        <SelectTrigger className="bg-light_grey border-0 h-12">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="form-font">
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password" className="font-label">Referral code</Label>
                    <Input
                        id="password"
                        type="password"
                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                    />
                </div>
            </CardContent>
            <CardContent className="flex flex-col space-y-2">
                <Button className="w-full h-12 bg-gradient-green" onClick={next_step}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Next"}
                </Button>
            </CardContent>
        </Card>
    )
}
export default ProfileStep