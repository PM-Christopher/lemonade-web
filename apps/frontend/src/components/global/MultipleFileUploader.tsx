"use client";
import React, { useState } from "react";
import { useAppDispatch } from "@/redux/hook";
import { sharedApi } from "@/features/shared/api";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { ImagesLoadingSkeleton } from "@/components/Skeletons";

interface FormikSetField {
  setFieldValue: (field: string, value: unknown) => unknown;
}

const MultipleFileUploader = ({
  setField,
  images,
  title,
  type,
}: {
  setField: FormikSetField;
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
        const { data } = await sharedApi.uploadMultipleFiles(formData);
        if (data.status) {
          setLoading(false);
          if (type === "business") {
            await setField.setFieldValue("gallery", [...data.data.images]);
            setPortfolioImages((prevImages) => [...prevImages, ...data.data.images]);
          }
          if (type === "dispute") {
            await setField.setFieldValue("attachments", [...data.data.images]);
            setPortfolioImages((prevImages) => [...prevImages, ...data.data.images]);
          }
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Image uploaded",
              type: "success",
            }),
          );
        } else {
          setLoading(false);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error uploading image",
              type: "error",
            }),
          );
        }
      } catch (err) {
        const legacyError = err as { response?: { data?: { message?: string } } };
        setLoading(false);
        dispatch(
          updateToastifyReducer({
            show: true,
            message: legacyError?.response?.data?.message || "error",
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
            className="bg-light_grey flex h-[170px] w-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-4 transition hover:bg-gray-100"
          >
            <input {...getInputProps()} />
            <Image src={"/images/upload_image.png"} alt="upload" width={48} height={48} />
            <p className="mt-3 text-center font-sans text-[14px] leading-[21px] font-semibold text-black">
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
            className="relative h-[170px] w-[170px] transform overflow-hidden rounded-2xl shadow-sm transition duration-300 hover:scale-105 hover:shadow-md"
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
