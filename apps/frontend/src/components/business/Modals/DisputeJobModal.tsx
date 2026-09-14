import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {Button} from "@/components/ui/button";

interface DisputeJobModalProps {
    isOpen: boolean;
    toggle: () => void;
    job: any
    toggleSubmit : () => void
}

const DisputeJobModal: React.FC<DisputeJobModalProps> = ({ isOpen, toggle, job, toggleSubmit }) => {
    const toggleModal = () => {
        toggle()
        toggleSubmit()
    }
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <p className="font-sans font-bold text-[24px]">
                        Important
                    </p>
                </div>
                <div className="mt-2 flex flex-col items-center">
                    <div className={"flex flex-col gap-[16px]"}>
                        <p className="font-normal text-[14px]">
                            It&apos;s best to avoid disputing services unless the business owner has breached the terms of your agreement.
                        </p>

                        <p className={'font-normal text-[14px]'}>To ensure your dispute is valid</p>

                        <ol className="font-sans font-normal text-[14px] list-decimal pl-5 space-y-[16px]">
                            <li>Briefly explain the issue and how the agreement was breached.</li>
                            <li>Upload clear photos as evidence.</li>
                            <li>We&apos;ll analyze your claim to determine a fair resolution.</li>
                        </ol>
                    </div>
                    <div className="mt-[16px] flex justify-center gap-3 w-full">
                        <Button
                            className="bg-gradient-green p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-custom-bottom w-full"
                            onClick={toggleModal}
                        >
                            I understand
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisputeJobModal;