"use client"
import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {Label} from "@/components/ui/label";
import EyeIcon from "@/images/icons/eyeIcon.svg"
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/redux/hook";
import * as yup from "yup";
import {useFormik} from "formik";
import { changePassword } from "@/features/authentication/authSlice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {FormikButton} from "@/components/global/FormikButton";

type UpdatePasswordInterface = {
    toggle: () => void,
    isOpen: boolean,
    user: any
}

const UpdatePasswordModal: React.FC<UpdatePasswordInterface> = ({toggle, isOpen, user}) => {
    const { authToken: token } = useSelector((state: any) => state.auth)
    const dispatch = useAppDispatch()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const passwordSchema = yup.object({
            password: yup
                .string()
                .required("Password is required"),
        new_password: yup
            .string()
            .required("New Password is required"),
        new_password_confirmation: yup
            .string()
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            new_password: "",
            new_password_confirmation: ""
        },
        validationSchema: passwordSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            dispatch(changePassword({token, data: values})).then((res) => {
                if (res.payload.status) {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: `Password updated successfully`,
                            type: "success",
                        })
                    );
                    toggle()
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: res.payload.message || `Something went wrong`,
                            type: "error",
                        })
                    );
                }
            }).catch((error: any) => {
                console.log({error})
            })
        },
    })

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <form onSubmit={formik.handleSubmit}>
                <div className="bg-white rounded-none laptop:rounded-lg shadow-lg w-screen laptop:w-[480px] h-screen laptop:h-full p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="cursor-pointer" onClick={toggle}>
                                <CloseIcon className="w-[11.25px]"/>
                            </div>
                            <p className="font-semibold text-[16px]">Update password</p>
                        </div>
                        <div className="hidden laptop:block">
                            <FormikButton title="Save password" error={formik.isValid} loading={formik.isSubmitting} classes="max-w-[135px] p-2 max-h-[39px] rounded-[12px] border-[1px] shadow-custom-bottom" />
                        </div>
                    </div>
                    <div className="mt-[24px]">
                        <div className="flex flex-col gap-y-[500px]">
                            <div className="flex flex-col">
                                <div className="grid gap-1 mt-[24px]">
                                    <Label htmlFor="current-password"
                                           className="font-normal font-sans text-[14px] leading-[16.8px] text-text-grey">Current
                                        password</Label>
                                    <div
                                        className="flex justify-between items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full h-[48px]">
                                        <div className="w-full">
                                            <input
                                                id="current-password"
                                                type={showCurrentPassword ? "text" : "password"}
                                                className="rounded-xl h-[48px] text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full"
                                                placeholder=""
                                                value={formik.values.password}
                                                onChange={(e) => {
                                                    formik.setFieldValue("password", e.target.value)
                                                }}
                                            />
                                        </div>
                                        <EyeIcon onClick={toggleCurrentPasswordVisibility}/>
                                    </div>
                                </div>
                                <div className="grid gap-1 mt-[24px]">
                                    <Label htmlFor="new-password"
                                           className="font-normal font-sans text-[14px] leading-[16.8px] text-text-grey">New
                                        Password</Label>
                                    <div
                                        className="flex justify-between items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full h-[48px]">
                                        <div className="w-full">
                                            <input
                                                id="new-password"
                                                type={showCurrentPassword ? "text" : "password"}
                                                className="rounded-xl h-[48px] text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full"
                                                placeholder=""
                                                value={formik.values.new_password}
                                                onChange={(e) => {
                                                    formik.setFieldValue("new_password", e.target.value)
                                                }}
                                            />
                                        </div>
                                        <EyeIcon onClick={toggleNewPasswordVisibility}/>
                                    </div>
                                    <p className="font-normal text-grey-40 text-[12px]">Password must be at least 8
                                        character
                                        long</p>
                                </div>
                                <div className="grid gap-1 mt-[24px]">
                                    <Label htmlFor="confirm-password"
                                           className="font-normal font-sans text-[14px] leading-[16.8px] text-text-grey">Confirm
                                        password</Label>
                                    <div
                                        className="flex justify-between items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full h-[48px]">
                                        <div className="w-full">
                                            <input
                                                id="confirm-password"
                                                type={showCurrentPassword ? "text" : "password"}
                                                className="rounded-xl h-[48px] text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full"
                                                placeholder=""
                                                value={formik.values.new_password_confirmation}
                                                onChange={(e) => {
                                                    formik.setFieldValue("new_password_confirmation", e.target.value)
                                                }}
                                            />
                                        </div>
                                        <EyeIcon onClick={toggleConfirmPasswordVisibility}/>
                                    </div>
                                </div>
                            </div>
                            <div className="block laptop:hidden">
                                <FormikButton title="Save password" error={formik.isValid} loading={formik.isSubmitting}
                                              classes="w-full laptop:max-w-[135px] p-2 h-[48px] laptop:max-h-[39px] rounded-[12px] border-[1px] shadow-custom-bottom"/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UpdatePasswordModal;