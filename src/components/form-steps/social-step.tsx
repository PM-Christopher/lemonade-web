'use client'
import React, {useEffect, useState} from "react"
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import Image from "next/image";
import facebook_image from "@/image/facebook.png"
import linkedin_image from "@/image/linkedin.png"
import twitter_image from "@/image/twitter.png"
import instagram_image from "@/image/instagram.png"
import {Input} from "@/components/ui/input";

interface SocialInterface {
    loading: Boolean,
    prev_step: () => void,
    onComplete: () => void
}

const SocialStep: React.FC<SocialInterface> = ({loading, prev_step, onComplete}) => {
    return (
        <Card className="p-[15px] w-[480px]">
            <CardHeader className="grid gap-4">
                <div className="flex gap-2">
                    <div className="w-[15px] h-[2px] bg-step-color"/>
                    <div className="w-[15px] h-[2px] bg-step-color"/>
                    <div className="w-[15px] h-[2px] bg-step-color"/>
                    <div className="w-[15px] h-[2px] bg-step-color"/>
                </div>
                <div>
                    <p className="font-sans text-[24px] font-semibold">Link your social profiles</p>
                    <p className="font-sans text-[14px] leading-[21px] font-normal text-text-grey">
                        Good job! Now add your social profile usernames to <br />
                        stay connected with others.
                    </p>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4 mt-[30px]">
                <div className="flex bg-light_grey p-2 px-[20px] border-0 items-center gap-2 rounded-xl h-[56px]">
                    <div className="">
                        <Image src={facebook_image} alt="" width={19.2}/>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        className="form-font border-0 shadow-none"
                        placeholder="Username"
                    />
                </div>
                <div className="flex bg-light_grey p-2 px-[20px] border-0 items-center gap-2 rounded-xl h-[56px]">
                    <div className="">
                        <Image src={linkedin_image} alt="" width={19.2}/>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        className="form-font border-0 shadow-none"
                        placeholder="Username"
                    />
                </div>
                <div className="flex bg-light_grey p-2 px-[20px] border-0 items-center gap-2 rounded-xl h-[56px]">
                    <div className="">
                        <Image src={twitter_image} alt="" width={19.2}/>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        className="form-font border-0 shadow-none"
                        placeholder="Username"
                    />
                </div>
                <div className="flex bg-light_grey p-2 px-[20px] border-0 items-center gap-2 rounded-xl h-[56px]">
                    <div className="">
                        <Image src={instagram_image} alt="" width={19.2}/>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        className="form-font border-0 shadow-none"
                        placeholder="Username"
                    />
                </div>
            </CardContent>
            <CardContent className="flex flex-col">
                <div className="mb-6 mt-2">
                    <p className="text-light-green text-center font-sans font-semi-normal text-[16px]">Skip</p>
                </div>
                <Button className="w-full h-12 bg-gradient-green" onClick={onComplete}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Done"}
                </Button>
            </CardContent>
        </Card>
    )
}
export default SocialStep