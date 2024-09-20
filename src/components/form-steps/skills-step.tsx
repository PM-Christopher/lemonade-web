'use client'
import React, {useEffect, useState} from "react"
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

interface SkillsInterface {
    loading: Boolean,
    next_step: () => void,
    prev_step: () => void
}

const SkillStep: React.FC<SkillsInterface> = ({loading, next_step, prev_step}) => {
    const skills = [
        "Creativity", "Leadership", "Problem-solving", "Critical thinking", "Work ethic"
    ]
    const interests = [
        "Arts", "Entertainment", "Science", "Sports", "Music", "Education", "Politics", "Religion", "Books", "Software", "Game", "History", "Health care", "Marketing"
    ]
    return (
        <Card className="p-[15px] w-[480px]">
            <CardHeader className="grid gap-4">
                <div className="flex gap-2">
                    <div className="w-[15px] h-[2px] bg-step-color"/>
                    <div className="w-[15px] h-[2px] bg-step-color"/>
                    <div className="w-[15px] h-[2px] bg-step-color"/>
                    <div className="w-[15px] h-[2px] bg-border-grey"/>
                </div>
                <div>
                    <p className="font-sans text-[24px] font-semibold">Skills & Interests</p>
                    <p className="font-sans text-[14px] leading-[21px] font-normal text-text-grey">
                        Maximize your connections and experience by telling us <br />
                        about your skills and interests.
                    </p>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4 mt-[30px]">
                <div>
                    <p className="font-semibold text-[18px] font-sans">Skills</p>
                </div>
                <div className="grid grid-cols-[repeat(3,auto)] gap-3">
                    {
                        skills.map((item, idx) => (
                            <div
                                className="bg-light_grey text-[14px] font-normal inline-block p-2 py-[12px] rounded-lg whitespace-nowrap text-center text-text-grey"
                                key={idx}>{item}</div>
                        ))
                    }
                </div>
                <div className="mt-2">
                    <p className="font-semibold text-[18px] font-sans">Interests</p>
                </div>
                <div className="grid grid-cols-[repeat(4,auto)] gap-3">
                    {
                        interests.map((item, idx) => (
                            <div
                                className="bg-light_grey text-[14px] font-normal inline-block p-2 py-[12px] rounded-lg whitespace-nowrap text-center text-text-grey"
                                key={idx}>{item}</div>
                        ))
                    }
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
export default SkillStep