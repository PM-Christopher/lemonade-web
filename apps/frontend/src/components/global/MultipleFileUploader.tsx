"use client"
import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "@/redux/hook";
import {axiosInstance} from "@/lib/axiosInstane";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import Dropzone from "react-dropzone";
import Image from "next/image";
import upload_image from "@/image/icons/upload_image.png";
import {CircleSpinner, RingSpinner} from "react-spinner-overlay";
import {ImagesLoadingSkeleton} from "@/components/Skeletons";

const MultipleFileUploader = ({ setField, images, title, type, length="single" }: {setField: any, images: string[], title: string, type: string, length: string|null}) => {
    const dispatch = useAppDispatch()
    const [portfolioImages, setPortfolioImages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const removeImage = (imageToRemove: string) => {
        setPortfolioImages(prevImages => prevImages.filter(image => image !== imageToRemove));
    };

    useEffect(() => {
        if(images && images.length > 0) {
            setPortfolioImages(images)
        }
    }, [images])

    const handleFileChange = async (files: File[]) => {
        setLoading(true)
        if (files.length > 0) {
            const formData = new FormData()
            files.map((file) => {
                formData.append("files[]", file)
            })
            try {
                const { data } = await axiosInstance.post("/upload-multiple", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(data.status) {
                    setLoading(false)
                    if (type === "business") {
                        await setField.setFieldValue("gallery", [...data.data.images])
                        setPortfolioImages(prevImages => [...prevImages, ...data.data.images])
                    }
                    if (type === "dispute") {
                        await setField.setFieldValue("attachments", [...data.data.images])
                        setPortfolioImages(prevImages => [...prevImages, ...data.data.images])
                    }
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Image uploaded",
                            type: "success",
                        })
                    );
                } else {
                    setLoading(false)
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Error uploading image",
                            type: "error",
                        })
                    );
                }
            } catch (err: any) {
                setLoading(false)
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: err?.response?.data?.message || "error",
                        type: "error",
                    })
                );
            }
        } else {
            setLoading(false)
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
        <div className="flex flex-wrap items-center gap-4 mt-4">
            {/* Dropzone */}
            <Dropzone onDrop={acceptedFiles => handleFileChange(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                    <section
                        {...getRootProps()}
                        className="flex flex-col items-center justify-center w-[170px] h-[170px] p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-light_grey cursor-pointer hover:bg-gray-100 transition"
                    >
                        <input {...getInputProps()} />
                        <Image src={"/images/upload_image.png"} alt="upload" width={48} height={48} />
                        <p className="mt-3 text-center font-sans font-semibold text-[14px] leading-[21px] text-black">
                            {title}
                        </p>
                        <p className="mt-1 text-center text-[12px] font-normal text-gray-400">
                            PNG, JPG, JPEG, less than 2MB
                        </p>
                    </section>
                )}
            </Dropzone>

            {/* Loading Skeleton */}
            {loading ? (
                <ImagesLoadingSkeleton count={4} />
            ) : (
                portfolioImages.length > 0 &&
                portfolioImages.map((image) => (
                    <div
                        key={image}
                        className="relative w-[170px] h-[170px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition transform hover:scale-105 duration-300"
                    >
                        <Image
                            src={image}
                            alt="uploaded_image"
                            width={170}
                            height={170}
                            className="object-cover w-full h-full"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(image)}
                            className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition"
                        >
                            <span className="text-red-500 font-bold text-lg">×</span>
                        </button>
                    </div>
                ))
            )}
        </div>

    );
}

export default MultipleFileUploader;