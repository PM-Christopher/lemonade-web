"use client"
import React, {useCallback} from 'react'
import Dropzone from 'react-dropzone'
import upload_image from "@/image/icons/upload_image.png"
import Image from "next/image";

export const SingleFileUploader: React.FC = ({}) => {
    return (
        <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
                <section className="border-dashed border-2 w-[200px] py-[39.5px] px-[16px] rounded-[12px] bg-light_grey mt-[16px] cursor-pointer">
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center w-[175.05px]">
                            <Image src={upload_image} alt="upload" />
                            <p className="mt-[12px] font-semi-normal font-sans text-[14px] leading-[21px] tracking-custom">Upload event image</p>
                            <p className="mt-[4px] font-sans font-normal text-[12px] leading-[14.4px] text-grey-40 items-center">Files must be PNG, JPG, or JPEG format, under 2MB.</p>
                        </div>
                    </div>
                </section>
            )}
        </Dropzone>
    );
}