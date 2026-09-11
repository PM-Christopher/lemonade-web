import React, {useEffect, useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {Button} from "@/components/ui/button";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {getPaymentSetting, updatePaymentSetting} from "@/features/events/event.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type PaymentSettingsInterface = {
    toggle: () => void,
    option: boolean
}

const PaymentSettingsModal: React.FC<PaymentSettingsInterface> = ({toggle, option}) => {
    const dispatch = useAppDispatch();
    const { payment_setting } = useSelector((state: RootState) => state.event);
    const { authToken } = useSelector((state: any) => state.auth);
    const [paymentType, setPaymentType] = useState(payment_setting?.type || "")

    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    };

    const handleUpdate = () => {
        if (paymentType === null) {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Please select a payment type",
                    type: "error",
                })
            );
        }
        dispatch(updatePaymentSetting({token: authToken, data: {type: paymentType}})).then((res: any) => {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Payment setting updated successfully",
                    type: "success",
                })
            );
        })
    }

    useEffect(() => {
        dispatch(getPaymentSetting({token: authToken}))
    }, []);

    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${option ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                        <p className="font-sans font-semibold text-[18p] leading-[27px] tracking-custom">Payment
                            settings</p>
                    </div>
                    <div>
                        <Button
                            className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom"
                            onClick={handleUpdate}
                        >
                            <p className="font-sans font-semi-normal text-[12px]">Save Changes</p>
                        </Button>
                    </div>
                </div>
                <div className="mt-10">
                    <RadioGroup value={paymentType} onValueChange={(val) => setPaymentType(val)}>
                        <div className="flex gap-2">
                            <RadioGroupItem
                                value="weekly"
                                id="weekly"
                                className="text-green-500 border-light-grey-60 border-[2.5px] checked:border-step-color checked:bg-gradient-green focus:border-step-color"
                            />
                            <div className="flex flex-col">
                                <Label htmlFor="weekly"
                                       className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom text-black-light">Weekly
                                    payment</Label>
                                <span
                                    className="font-normal font-sans text-[12px] leading-[16.8px] text-text-grey">Ticket earnings will be transferred in batch to the account details every Friday</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <RadioGroupItem
                                value="monthly"
                                id="monthly"
                                className="text-green-500 border-light-grey-60 border-[2.5px] checked:border-step-color checked:bg-gradient-green focus:border-step-color"
                            />
                            <div className="flex flex-col">
                                <Label htmlFor="monthly"
                                       className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom text-black-light">Monthly
                                    payment</Label>
                                <span
                                    className="font-normal font-sans text-[12px] leading-[16.8px] text-text-grey">Ticket earnings will be transferred in batch to the account details on the last Friday of the <br /> month</span>
                            </div>
                        </div>
                    </RadioGroup>
                </div>
            </div>
        </div>
    );
}

export default PaymentSettingsModal;