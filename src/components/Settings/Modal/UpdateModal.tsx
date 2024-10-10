import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import Image from "next/image";
import Lemon from "@/image/Lemon.png";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

type UpdateInterface = {
    toggle: () => void,
    isOpen: boolean
}

const UpdateModal: React.FC<UpdateInterface> = ({toggle, isOpen}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon className="w-[11.25px]"/>
                        </div>
                        <p className="font-semibold text-[16px]">Change username</p>
                    </div>
                    <Button className="max-w-[135px] max-h-[39px] rounded-[12px] border-[1px] bg-gradient-green shadow-custom-bottom">
                        <p className="text-[16px] font-semi-normal text-white">Save changes</p>
                    </Button>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <div className="grid gap-1 mt-[24px]">
                            <Label htmlFor="username"
                                   className="font-normal text-[14px] leading-[16.8px] text-text-grey">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder=""
                                className="h-[48px] rounded-[12px] bg-light_grey border-[1.5px] border-step-color"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateModal;