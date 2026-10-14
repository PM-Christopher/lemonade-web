"use client";
import { images as imageAssets } from "@/lib/images";
import React, { useState } from "react";
import { useAppDispatch } from "@/redux/hook";
import { sharedApi } from "@/features/shared/api";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { ImagesLoadingSkeleton } from "@/components/Skeletons";
import { errorMessage } from "@/lib/api-error";

interface FieldValueSetter {
  setFieldValue: (field: string, value: unknown) => unknown;
}

const MultipleFileUploader = ({
  setField,
  images,
  title,
  type,
}: {
  setField: FieldValueSetter;
  images: string[];
  title: string;
  type: string;
  length?: string | null;
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [portfolioImages, setPortfolioImages] = useState<string[]>(images ?? []);
  const [seenImages, setSeenImages] = useState(images);
  if (images && images.length > 0 && images !== seenImages) {
    setSeenImages(images);
    setPortfolioImages(images);
  }

  const removeImage = (imageToRemove: string) => {
    setPortfolioImages((prevImages) => prevImages.filter((image) => image !== imageToRemove));
  };

  const handleFileChange = async (files: File[]) => {
    setLoading(true);
    if (files.length > 0) {
      const formData = new FormData();
      files.map((file) => {
        formData.append("files[]", file);
      });
      try {
        const result = await sharedApi.uploadMultipleFiles(formData);
        setLoading(false);
        if (type === "business") {
          await setField.setFieldValue("gallery", [...result.images]);
          setPortfolioImages((prevImages) => [...prevImages, ...result.images]);
        }
        if (type === "dispute") {
          await setField.setFieldValue("attachments", [...result.images]);
          setPortfolioImages((prevImages) => [...prevImages, ...result.images]);
        }
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Image uploaded",
            type: "success",
          }),
        );
      } catch (err) {
        setLoading(false);
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(err, "error"),
            type: "error",
          }),
        );
      }
    } else {
      setLoading(false);
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
    <div className="mt-4 flex flex-wrap items-center gap-4">
      {/* Dropzone */}
      <Dropzone onDrop={(acceptedFiles) => handleFileChange(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <section
            {...getRootProps()}
            className="bg-light_grey flex h-42.5 w-42.5 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-4 transition hover:bg-gray-100"
          >
            <input {...getInputProps()} />
            <Image src={imageAssets.UPLOAD_IMAGE} alt="upload" width={48} height={48} />
            <p className="text-body-s mt-3 text-center font-sans font-semibold text-black">
              {title}
            </p>
            <p className="text-meta mt-1 text-center leading-normal font-normal text-gray-400">
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
            className="relative h-42.5 w-42.5 transform overflow-hidden rounded-2xl shadow-sm transition duration-300 hover:scale-105 hover:shadow-md"
          >
            <Image
              src={image}
              alt="uploaded_image"
              width={170}
              height={170}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(image)}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition hover:bg-red-50"
            >
              <span className="text-lg font-bold text-red-500">×</span>
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MultipleFileUploader;
