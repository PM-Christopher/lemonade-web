"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hook";
import { sharedApi } from "@/features/shared/api";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import Dropzone from "react-dropzone";
import Image from "next/image";
import upload_image from "@/image/icons/upload_image.png";
import { ImagesLoadingSkeleton } from "@/components/Skeletons";

const MultipleFileUploader = ({
  setField,
  images,
  title,
  type,
  length = "single",
}: {
  setField: any;
  images: string[];
  title: string;
  type: string;
  length: string | null;
}) => {
  const dispatch = useAppDispatch();
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const removeImage = (imageToRemove: string) => {
    setPortfolioImages((prevImages) => prevImages.filter((image) => image !== imageToRemove));
  };

  useEffect(() => {
    if (images && images.length > 0) {
      setPortfolioImages(images);
    }
  }, [images]);

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
      } catch (err: any) {
        setLoading(false);
        dispatch(
          updateToastifyReducer({
            show: true,
            message: err?.response?.data?.message || "error",
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
            className="flex h-[170px] w-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-light_grey p-4 transition hover:bg-gray-100"
          >
            <input {...getInputProps()} />
            <Image src={"/images/upload_image.png"} alt="upload" width={48} height={48} />
            <p className="mt-3 text-center font-sans text-[14px] font-semibold leading-[21px] text-black">
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
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition hover:bg-red-50"
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
