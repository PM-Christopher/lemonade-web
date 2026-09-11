import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import * as yup from "yup";
import {useFormik} from "formik";
import {login} from "@/features/authentication/authApi";
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/redux/hook";
import {sendInvite} from "@/features/connect/connect.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {getDistanceFromLatLonInKm} from "@/lib/helper";

type ConnectInterface = {
    toggle: () => void,
    isOpen: boolean,
    users: any
    reloadFunc: any,
    authUser: any
}

const ConnectModal: React.FC<ConnectInterface> = ({toggle, isOpen, users, reloadFunc, authUser}) => {
    const dispatch = useAppDispatch()
    const [currentIndex, setCurrentIndex] = useState(0);
    const user = users[currentIndex];
    const { authToken } = useSelector((state: any) => state.auth)
    const connectSchema = yup.object({
        message: yup
            .string()
    });

    const formik = useFormik({
        initialValues: {
            message: "",
        },
        validationSchema: connectSchema,
        onSubmit: async (values) => {
            sendConnect(values)
        },
    })

    const sendConnect = (values: {message: string})  => {
        let data = {...values, invitee_id: user?.id}
        dispatch(sendInvite({token: authToken, data})).then(res => {
            if (res.payload.status) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: res.payload.message || "Invite sent Successfully",
                        type: "success",
                    })
                );
                formik.resetForm()
                toggle()
                reloadFunc()
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: res.payload.message,
                        type: "error",
                    })
                );
                formik.resetForm()
            }
        })
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    if (!user) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300
    ${isOpen ? "visible bg-gray-800/50 opacity-100" : "invisible opacity-0"}`}
        >
            <form
                onSubmit={formik.handleSubmit}
                className="w-screen h-screen laptop:w-[480px] laptop:h-auto bg-white rounded-none laptop:rounded-2xl shadow-2xl
               p-6 laptop:max-h-[90vh] overflow-y-auto hide-scrollbar transform transition-all duration-300
               scale-100 laptop:scale-95 hover:scale-100"
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={toggle}
                            className="p-2 rounded-full hover:bg-gray-100 transition-all"
                        >
                            <CloseIcon className="w-[12px]" />
                        </button>
                        <p className="font-semibold text-[16px] text-gray-800">Connect</p>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-6 flex flex-col items-center text-center space-y-2">
                    {/* Profile Avatar */}
                    <div className="relative w-[40px] h-[40px]">
                        <Image src="/images/lemon.png" alt="lemon" width={40} height={40} />
                        <p className="absolute bottom-2 left-2 text-black text-[12px] font-semibold">
                            L{user?.short_lemon_id}
                        </p>
                    </div>

                    {/* User Info */}
                    <p className="font-semibold text-[18px] text-gray-900">{user?.long_lemon_id}</p>
                    <p className="text-[14px] text-gray-700">{user?.username}</p>
                    <p className="text-[12px] text-gray-500">{user?.industry}</p>

                    {/* Distance */}
                    <div className="mt-3 flex gap-2 items-center text-[12px] text-mid-green">
                        <LocationIcon />
                        <p>
                            {getDistanceFromLatLonInKm(
                                authUser?.connect_info?.latitude,
                                authUser?.connect_info?.longitude,
                                user?.connect_info?.latitude,
                                user?.connect_info?.longitude
                            )}{" "}
                            kms away
                        </p>
                    </div>

                    {/* Already Connected */}
                    {user?.hasConnected ? (
                        <p className="mt-6 text-[12px] text-text-grey">
                            You are already connected!
                        </p>
                    ) : (
                        <>
                            {/* Invite Message */}
                            <div className="grid gap-2 mt-6 w-full">
                                <div className="flex justify-between text-gray-500 text-[13px]">
                                    <Label htmlFor="message">Invite message</Label>
                                    <span>100 characters</span>
                                </div>
                                <textarea
                                    id="message"
                                    name="message"
                                    onChange={formik.handleChange}
                                    value={formik.values.message}
                                    placeholder="Write a short friendly invite..."
                                    className="h-[120px] w-full rounded-xl bg-light_grey border-0 p-3 px-4 text-sm text-gray-700
                         resize-none focus:ring-2 focus:ring-green-400 outline-none transition-all"
                                />
                            </div>

                            {/* Send Button */}
                            <div className="mt-6 w-full">
                                <Button
                                    type="submit"
                                    className="h-[48px] w-full bg-gradient-green rounded-xl shadow-custom-bottom hover:brightness-110 transition-all"
                                >
                                    <p className="font-medium text-[16px]">Send Invite</p>
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between w-full px-2">
                        <Button
                            variant="outline"
                            disabled={currentIndex === 0}
                            onClick={handlePrev}
                            className="hover:bg-gray-100 transition-all"
                        >
                            ← Previous
                        </Button>
                        <Button
                            variant="outline"
                            disabled={currentIndex === users.length - 1}
                            onClick={handleNext}
                            className="hover:bg-gray-100 transition-all"
                        >
                            Next →
                        </Button>
                    </div>
                </div>
            </form>
        </div>

    );
}

export default ConnectModal;