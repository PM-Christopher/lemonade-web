"use client";
import React, { useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { sharedApi } from "@/features/shared/api";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";

export const SingleFileUploader = ({
  setField,
  image,
  title,
  type,
  length = "single",
}: {
  setField: any;
  image?: string;
  title: string;
  type: string;
  length: string | null;
}) => {
  const dispatch = useAppDispatch();
  const [elementImage, setElementImage] = useState("");

  const handleRemoveImage = async () => {
    if (type === "event") {
      await setField.setFieldValue("event_image", "");
    } else if (type === "business") {
      await setField.setFieldValue("image", "");
    }
  };

  useEffect(() => {
    if (image) {
      setElementImage(image);
    }
  }, [image]);

  const handleFileChange = async (files: File[]) => {
    if (files.length > 0) {
      const formData = new FormData();
      formData.append("file", files[0]);
      try {
        const { data } = await sharedApi.uploadFile(formData);
        if (data.status) {
          if (type === "event") {
            await setField.setFieldValue("event_image", data.data.image);
            setElementImage(data.data.image);
          } else if (type === "business") {
            await setField.setFieldValue("image", data.data.image);
            setElementImage(data.data.image);
          }
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Image uploaded",
              type: "success",
            }),
          );
        } else {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error uploading image",
              type: "error",
            }),
          );
        }
      } catch (err: any) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: err?.response?.data?.message || "error",
            type: "error",
          }),
        );
      }
    } else {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Please upload an image to continue",
          type: "error",
        }),
      );
    }
  };

  return (
    <>
      {elementImage === "" ? (
        <Dropzone onDrop={(acceptedFiles) => handleFileChange(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section className="mt-[16px] w-[200px] cursor-pointer rounded-[12px] border-2 border-dashed bg-light_grey px-[16px] py-[39.5px]">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="flex w-[175.05px] flex-col items-center">
                  <Image src={"/images/upload_image.png"} alt="upload" width={56} height={56} />
                  <p className="mt-[12px] w-[155px] text-center font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom">
                    {title}
                  </p>
                  <p className="mt-[4px] w-[175px] items-center text-center font-sans text-[12px] font-normal leading-[14.4px] text-grey-40">
                    Files must be PNG, JPG, or JPEG format, under 2MB.
                  </p>
                </div>
              </div>
            </section>
          )}
        </Dropzone>
      ) : (
        <div className="relative inline-block h-[200px] w-[200px]">
          <Image
            src={elementImage}
            alt="event_image"
            width={200}
            height={200}
            className="h-full w-full rounded" // Use full width/height to ensure scaling
          />

          <div
            className="absolute right-0 top-0 z-10 m-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white shadow" // Ensure X is above image
            onClick={() => {
              setElementImage("");
              handleRemoveImage();
            }}
          >
            <span className="text-xl font-bold text-red-500">X</span>
          </div>
        </div>
      )}
    </>
  );
};
