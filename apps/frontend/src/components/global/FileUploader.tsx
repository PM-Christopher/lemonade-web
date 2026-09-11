"use client"
import React, {useCallback, useEffect, useState} from 'react'
import Dropzone from 'react-dropzone'
import Image from "next/image";
import {axiosInstance} from "@/lib/axiosInstane";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useAppDispatch} from "@/redux/hook";

export const SingleFileUploader = ({ setField, image, title, type, length="single" }: {setField: any, image?: string, title: string, type: string, length: string|null}) => {
    const dispatch = useAppDispatch()
    const [elementImage, setElementImage] = useState("")

    const handleRemoveImage = async () => {
        if (type === "event") {
            await setField.setFieldValue("event_image", "")
        } else if (type === "business") {
            await setField.setFieldValue("image", "")
        }
    }

    useEffect(() => {
        if(image) {
            setElementImage(image)
        }
    }, [image])

    const handleFileChange = async (files: File[]) => {
        if (files.length > 0) {
            const formData = new FormData()
            formData.append("file", files[0])
            try {
                const { data } = await axiosInstance.post("/upload", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(data.status) {
                    if (type === "event") {
                        await setField.setFieldValue("event_image", data.data.image)
                        setElementImage(data.data.image)
                    } else if (type === "business") {
                        await setField.setFieldValue("image", data.data.image)
                        setElementImage(data.data.image)
                    }
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Image uploaded",
                            type: "success",
                        })
                    );
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Error uploading image",
                            type: "error",
                        })
                    );
                }
            } catch (err: any) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: err?.response?.data?.message || "error",
                        type: "error",
                    })
                );
            }
        } else {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Please upload an image to continue",
                    type: "error",
                })
            );
        }
    };


    return (
        <>
            {
                elementImage === "" ? (
                    <Dropzone onDrop={acceptedFiles => handleFileChange(acceptedFiles)}>
                        {({getRootProps, getInputProps}) => (
                            <section
                                className="border-dashed border-2 w-[200px] py-[39.5px] px-[16px] rounded-[12px] bg-light_grey mt-[16px] cursor-pointer">
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center w-[175.05px]">
                                        <Image src={"/images/upload_image.png"} alt="upload" width={56} height={56}/>
                                        <p className="mt-[12px] text-center w-[155px] font-semi-normal font-sans text-[14px] leading-[21px] tracking-custom">
                                            {title}
                                        </p>
                                        <p className="mt-[4px] font-sans font-normal text-[12px] leading-[14.4px] text-grey-40 items-center w-[175px] text-center">Files
                                            must be PNG, JPG, or JPEG format, under 2MB.</p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                ) : (
                    <div className="relative inline-block w-[200px] h-[200px]">
                        <Image
                            src={elementImage}
                            alt="event_image"
                            width={200}
                            height={200}
                            className="rounded w-full h-full" // Use full width/height to ensure scaling
                        />

                        <div
                            className="absolute top-0 right-0 m-2 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer shadow z-10" // Ensure X is above image
                            onClick={() => {
                                setElementImage("")
                                handleRemoveImage()
                            }}>
                            <span className="text-red-500 text-xl font-bold">X</span>
                        </div>
                    </div>
                )
            }
        </>
    );
}