import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {Button} from "@/components/ui/button";
import CheckedIcon from "@/images/icons/checkedIcon.svg";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {useAppDispatch} from "@/redux/hook";
import {useReportThreadMutation} from "@/features/tribes/mutations";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type ReportThreadIF = {
    toggle: () => void,
    isOpen: boolean,
    threadId: null|number,
}

const ReportThreadModal: React.FC<ReportThreadIF> = ({toggle, isOpen, threadId}) => {
    const dispatch = useAppDispatch()
    const reportThreadMutation = useReportThreadMutation()

    const [selectedReport, setSelectedReport] = useState("Inappropriate content");

    const submitThread = () =>{
        if (threadId !== null) {
            reportThreadMutation.mutate({id: threadId, data: {report: selectedReport}})
        }
        dispatch(
            updateToastifyReducer({
                show: true,
                message: "Report submitted. Thanks for keeping the platform safe.",
                type: "success",
            })
        );
        setSelectedReport("Inappropriate content");
        toggle();
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                        <p className="font-sans font-semibold text-[18px] leading-[27px]">
                            Report thread
                        </p>
                    </div>
                    <div>
                        <Button
                            className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom"
                            type="button"
                            onClick={submitThread}
                        >
                            <p className="font-sans font-semi-normal text-[12px]">Submit</p>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col mt-[24px] p-6 gap-[16px]">
                    <p className="font-semiBold text-[20px] text-black-light">What is wrong with this thread?</p>
                    <div className="flex flex-col">
                        <RadioGroup defaultValue="Inappropriate_content" onValueChange={(value) => setSelectedReport(value)}>
                            <div className="flex-col flex gap-[20px]">
                                <div
                                    className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                                    <RadioGroupItem value="Inappropriate_content" id="option-one"/>
                                    <div className="flex flex-col">
                                        <Label className="font-normal text-[16px] text-black-light font-sans"
                                               htmlFor="option-one">Inappropriate content</Label>
                                        <p className="font-normal text-[12px] text-text-grey">Posts containing nudity, pornography, or other sexually suggestive content</p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                                    <RadioGroupItem value="Abuse & Harassment" id="option-two"/>
                                    <div className="flex flex-col">
                                        <Label className="font-normal text-[16px] text-black-light font-sans"
                                               htmlFor="option-one">Abuse & Harassment</Label>
                                        <p className="font-normal text-[12px] text-text-grey">
                                            Attacks, insults, threats, or other malicious behavior directed towards another user.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                                    <RadioGroupItem value="Hate speech" id="option-three"/>
                                    <div className="flex flex-col">
                                        <Label className="font-normal text-[16px] text-black-light font-sans"
                                               htmlFor="option-one">Hate speech</Label>
                                        <p className="font-normal text-[12px] text-text-grey">
                                            Content that attacks a person or group on the basis of attributes like race, religion, ethnic origin, national origin, sex, disability, sexual orientation, or gender identity.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                                    <RadioGroupItem value="Spam or irrelevant content" id="option-four"/>
                                    <div className="flex flex-col">
                                        <Label className="font-normal text-[16px] text-black-light font-sans"
                                               htmlFor="option-one">Spam or irrelevant content</Label>
                                        <p className="font-normal text-[12px] text-text-grey">
                                            Posts promoting unrelated products or services, excessive self-promotion, or repetitive messages.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                                    <RadioGroupItem value="Illegal activity" id="option-five"/>
                                    <div className="flex flex-col">
                                        <Label className="font-normal text-[16px] text-black-light font-sans"
                                               htmlFor="option-one">Illegal activity</Label>
                                        <p className="font-normal text-[12px] text-text-grey">
                                            Posts promoting or encouraging illegal activity.
                                            Threats of violence: Any content that threatens violence against oneself or others.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                                    <RadioGroupItem value="Misinformation or disinformation" id="option-six"/>
                                    <div className="flex flex-col">
                                        <Label className="font-normal text-[16px] text-black-light font-sans"
                                               htmlFor="option-one">Misinformation or disinformation</Label>
                                        <p className="font-normal text-[12px] text-text-grey">
                                            The sharing of false or misleading information intended to deceive or manipulate others.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ReportThreadModal;