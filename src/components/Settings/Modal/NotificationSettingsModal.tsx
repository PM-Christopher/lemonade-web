import React from 'react';
import CloseIcon from "@/image/icons/close.svg";

type NotificationSettingsInterface = {
    toggle: () => void,
    isOpen: boolean
}

const NotificationSettingsModal: React.FC<NotificationSettingsInterface> = ({toggle, isOpen}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon className="w-[11.25px]"/>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-semibold text-[16px]">Thread engagements</p>
                            <p className="text-text-grey font-normal text-[14px]">Notify me when I have new likes and comments on my threads.</p>
                        </div>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col gap-[12px]">
                        <div className="flex justify-between items-center">
                            <p className="font-normal text-[16px]">In-app notification</p>
                            <p>CHK_BOX</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-normal text-[16px]">Email</p>
                            <p>CHK_BOX</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotificationSettingsModal;