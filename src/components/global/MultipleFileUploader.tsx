"use client"
import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "@/redux/hook";
import {axiosInstance} from "@/lib/axiosInstane";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import Dropzone from "react-dropzone";
import Image from "next/image";
import upload_image from "@/image/icons/upload_image.png";
import {CircleSpinner, RingSpinner} from "react-spinner-overlay";

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
        <>
            {
               loading ? (
                   <div className="w-full h-[200px] bg-grey-20 opacity-50 backdrop-blur-lg rounded-[8px] flex justify-center items-center">
                       {/* Your content goes here */}
                       <RingSpinner color="#6B9D00" loading={loading} size={150} />
                   </div>
               ) : (
                   <div className="flex flex-wrap items-center gap-[4px] mt-[16px]">
                       <Dropzone onDrop={acceptedFiles => handleFileChange(acceptedFiles)}>
                           {({getRootProps, getInputProps}) => (
                               <section
                                   className="border-dashed border-2 w-[165.5px] h-[165.5px] p-[16px] rounded-[12px] bg-light_grey cursor-pointer">
                                   <div {...getRootProps()}>
                                       <input {...getInputProps()} />
                                       <div className="flex flex-col items-center w-[133.5px]">
                                           <Image src={upload_image} alt="upload" width={48} height={48}/>
                                           <p className="mt-[12px] font-semi-normal font-sans text-[14px] leading-[21px] tracking-custom text-center">
                                               {title}
                                           </p>
                                           <p className="mt-[4px] font-sans font-normal text-[12px] leading-[14.4px] text-grey-40 items-center text-center">
                                               PNG, JPG, JPEG, less than 2MB
                                           </p>
                                       </div>
                                   </div>
                               </section>
                           )}
                       </Dropzone>

                       {portfolioImages.length > 0 && (
                           portfolioImages.map((image) => (
                               <div className="relative inline-block">
                                   <Image
                                       src={image}
                                       alt="event_image"
                                       width={165.5}
                                       height={165.5}
                                       className="rounded-[12px] w-[165.5px] h-[165.5px]"
                                   />

                                   <div
                                       className="absolute top-0 right-0 m-2 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer shadow" onClick={() => removeImage(image)}>
                                       <span className="text-red-500 text-xl font-bold">X</span>
                                   </div>
                               </div>
                           ))
                       )}
                   </div>
               )
            }
        </>
    );
}

export default MultipleFileUploader;