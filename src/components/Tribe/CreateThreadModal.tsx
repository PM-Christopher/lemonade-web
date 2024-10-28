"use client"
import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import {Button} from "@/components/ui/button";
import ImageIcon from "@/image/icons/image.svg";
import VideoIcon from "@/image/icons/video-camera.svg";
import PollIcon from "@/image/icons/votes.svg";
import {TribeInterface} from "@/interfaces/TribeInterface";
import * as yup from "yup";
import {useFormik} from "formik";
import {login} from "@/features/authentication/authApi";
import {FormikButton} from "@/components/global/FormikButton";
import {useSelector} from "react-redux";
import {createThread} from "@/features/tribes/tribe.slice";
import {useAppDispatch} from "@/redux/hook";

type CreateThreadInterface = {
    toggle: () => void,
    isOpen: boolean,
    tribe_id: number
}

const CreateThreadModal: React.FC<CreateThreadInterface> = ({toggle, isOpen, tribe_id}) => {
    const {authToken} = useSelector((state: any) => state.auth)
    const dispatch = useAppDispatch()

    const createThreadSchema = yup.object({
        topic: yup
            .string()
            .required("Topic is required"),
        thoughts: yup
            .string()
            .required("Thoughts is required"),
        media: yup.array().nullable(),
        tags: yup.array().nullable(),
    });

    const formik = useFormik({
        initialValues: {
            topic: "",
            thoughts: "",
            media: [],
            tags: []
        },
        validationSchema: createThreadSchema,
        onSubmit: async (values) => {
            await handleCreateThread(values)
        },
    })

    const handleCreateThread = async (values: any) => {
        console.log({values})
        dispatch(createThread({token: authToken, id: tribe_id, data: values}))
    }

    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col bg-white rounded-[12px]">
                    <div className="shadow-lg w-[800px] p-6 h-[300px]">
                        <div className="flex justify-between items-center">
                            <div className="cursor-pointer" onClick={toggle}>
                                <CloseIcon/>
                            </div>
                            <div>
                                <FormikButton loading={formik.isSubmitting} title="Post" error={formik.isValid} />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="grid gap-2">
                                <input
                                    id="tribe-name"
                                    type="text"
                                    className="font-sans font-semibold text-[18px] border-0 shadow-none focus:outline-none focus:border-0 focus:ring-0 focus:border-transparent"
                                    placeholder="Topic"
                                    onChange={(e) => {
                                        formik.setFieldValue("topic", e.target.value)
                                    }}
                                    value={formik.values.topic}
                                />
                            </div>
                            <div className="grid gap-2 mt-4">
                                    <textarea
                                        id="tribe-name"
                                        className="font-sans h-[160px] font-normal text-[16px] border-0 shadow-none focus:outline-none focus:ring-0 focus:border-transparent resize-none"
                                        placeholder="Share your thoughts..."
                                        value={formik.values.thoughts}
                                        onChange={(e) => {
                                            formik.setFieldValue("thoughts", e.target.value)
                                        }}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="bg-mid-grey flex p-4 gap-6 items-center rounded-bl-[12px] rounded-br-[12px]">
                        <ImageIcon/>
                        <VideoIcon/>
                        <PollIcon/>
                        <div className="flex ml-4">
                            <p>+ Add tags</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateThreadModal;