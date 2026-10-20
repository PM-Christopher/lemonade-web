"use client";
import { images } from "@/lib/images";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { FallbackImage } from "@/components/global/FallbackImage";
import { sharedApi } from "@/features/shared/api";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";
import { errorMessage } from "@/lib/api-error";

interface FieldValueSetter {
  setFieldValue: (field: string, value: unknown) => unknown;
}

export const SingleFileUploader = ({
  setField,
  image,
  title,
  type,
}: {
  setField: FieldValueSetter;
  image?: string;
  title: string;
  type: string;
  length?: string | null;
}) => {
  const dispatch = useAppDispatch();
  const [elementImage, setElementImage] = useState(image ?? "");
  const [seenImage, setSeenImage] = useState(image);
  if (image && image !== seenImage) {
    setSeenImage(image);
    setElementImage(image);
  }

  const handleRemoveImage = async () => {
    if (type === "event") {
      await setField.setFieldValue("event_image", "");
    } else if (type === "business") {
      await setField.setFieldValue("image", "");
    }
  };

  const handleFileChange = async (files: File[]) => {
    if (files.length > 0) {
      const formData = new FormData();
      formData.append("file", files[0]);
      try {
        const result = await sharedApi.uploadFile(formData);
        if (type === "event") {
          await setField.setFieldValue("event_image", result.image);
          setElementImage(result.image);
        } else if (type === "business") {
          await setField.setFieldValue("image", result.image);
          setElementImage(result.image);
        }
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Image uploaded",
            type: "success",
          }),
        );
      } catch (err) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(err, "error"),
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
            <section className="bg-light_grey mt-4 w-50 cursor-pointer rounded-xl border-2 border-dashed px-4 py-10">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="flex w-43.75 flex-col items-center">
                  <Image src={images.UPLOAD_IMAGE} alt="upload" width={56} height={56} />
                  <p className="font-semi-normal tracking-custom text-body-s mt-3 w-38.75 text-center font-sans">
                    {title}
                  </p>
                  <p className="text-grey-40 text-meta mt-1 w-43.75 items-center text-center font-sans font-normal">
                    Files must be PNG, JPG, or JPEG format, under 2MB.
                  </p>
                </div>
              </div>
            </section>
          )}
        </Dropzone>
      ) : (
        <div className="relative inline-block h-50 w-50">
          <FallbackImage
            src={elementImage}
            fallbackSrc={images.DEFAULT_EVENT}
            alt="event_image"
            width={200}
            height={200}
            className="h-full w-full rounded" // Use full width/height to ensure scaling
          />

          <div
            className="absolute top-0 right-0 z-10 m-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white shadow" // Ensure X is above image
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
