import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {FormikButton} from "@/components/global/FormikButton";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {membershipPlans} from "../../../../pageData";
import {formatNumberWithCommas} from "@/lib/formatNumber";

interface UpgradePlanProps {
    isOpen: boolean;
    toggle: () => void;
}

const UpgradePlanModal = ({isOpen, toggle}: UpgradePlanProps) => {
    const [selected, setSelected] = useState<number>();

    const handleSelectedPlan = (planId: number) => {
        setSelected(planId);
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${
                isOpen ? "flex" : "hidden"
            }`}
        >
            <form>
                <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="cursor-pointer" onClick={toggle}>
                                <CloseIcon />
                            </div>
                            <p className="font-sans font-semibold text-[18p] leading-[27px] tracking-custom">
                                Membership
                            </p>
                        </div>
                        <div>
                            <FormikButton title="Submit"/>
                        </div>
                    </div>
                    <div className="mt-10">
                        <div className={'flex flex-col gap-[16px]'}>
                            {
                                membershipPlans?.map((membership) => (
                                    <div className={`rounded-[12px] p-[16px] cursor-pointer ${selected === membership.id ? "border-[1px] border-step-color bg-light-green-10" : "bg-mid-grey"}`} key={membership.id} onClick={() => handleSelectedPlan(membership.id)}>
                                        <div className={"flex justify-between items-center"}>
                                            <p className={'text-[16px] font-semiBold text-black-light'}>{membership.title}</p>
                                            <p className={'text-[16px] font-semiBold text-black-light'}>₦{formatNumberWithCommas(membership.amount)} / {membership.paid}</p>
                                        </div>
                                        <p className={'font-normal text-[14px] text-text-grey'}>Billed {membership.billingPeriod}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UpgradePlanModal;