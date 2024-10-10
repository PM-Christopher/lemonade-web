import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type BankAccountInterface = {
    isOpen: boolean,
    toggle: () => void
}

const BankAccountModal: React.FC<BankAccountInterface> = ({isOpen, toggle}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                        <p className="font-sans font-semibold text-[18p] leading-[27px] tracking-custom">Bank
                            Account</p>
                    </div>
                    <div>
                        <Button
                            className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom">
                            <p className="font-sans font-semi-normal text-[12px]">Submit</p>
                        </Button>
                    </div>
                </div>
                <div className="mt-10">
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Bank
                            Name</Label>
                        <select className="h-12 rounded-xl bg-light_grey form-font border-0 p-2 w-full">
                            <option value="Access Bank">Access Bank</option>
                            <option value="Zenith Bank">Zenith Bank</option>
                        </select>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Account
                            number</Label>
                        <Input
                            id="fullname"
                            type="text"
                            placeholder=""
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                        />
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Account
                            name</Label>
                        <Input
                            id="fullname"
                            type="text"
                            placeholder=""
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                            readOnly={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BankAccountModal;