"use client";
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import ImageIcon from "@/images/icons/image.svg";
import VideoIcon from "@/images/icons/video-camera.svg";
import CloseRedIcon from "@/images/icons/closeRedIcon.svg";
import PollIcon from "@/images/icons/votes.svg";
import * as yup from "yup";
import { useFormik } from "formik";
import { FormikButton } from "@/components/global/FormikButton";
import { useCreateThreadMutation } from "@/features/tribes/mutations";
import { useAppDispatch } from "@/redux/hook";
import { useMediaQuery } from "react-responsive";
import { tribesApi } from "@/features/tribes/api";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type CreateThreadInterface = {
  toggle: () => void;
  isOpen: boolean;
  tribe_id: any;
  // CreateTribeThread (backend) looks the tribe up by its raw id, not its
  // slug — unlike the threads/pinnedThreads queries, which are slug-keyed.
  // Both identifiers are needed here for that reason (see
  // features/tribes/mutations.ts's useCreateThreadMutation comment).
  tribe_slug: string;
};

const CreateThreadModal: React.FC<CreateThreadInterface> = ({
  toggle,
  isOpen,
  tribe_id,
  tribe_slug,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const dispatch = useAppDispatch();
  const createThreadMutation = useCreateThreadMutation(tribe_slug);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const [pollTitle, setPollTitle] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>([""]);
  const [pollStart, setPollStart] = useState("");
  const [pollEnd, setPollEnd] = useState("");
  const [poll, setPoll] = useState(false);

  const createThreadSchema = yup.object({
    topic: yup.string().required("Topic is required"),
    thoughts: yup.string().required("Thoughts is required"),
    media: yup.array().nullable(),
    videos: yup.array().nullable(),
    tags: yup.array().nullable(),
    polls: yup.boolean(),
  });
  const formik = useFormik({
    initialValues: {
      topic: "",
      thoughts: "",
      media: [],
      videos: [],
      tags: [],
      polls: false,
    },
    validationSchema: createThreadSchema,
    onSubmit: async (values) => {
      await handleCreateThread(values);
    },
  });

  const handleImageInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleVideoInput = () => {
    if (videoFileInputRef.current) {
      videoFileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

      const formData = new FormData();
      const oversizedFiles: string[] = [];

      Array.from(files).forEach((file) => {
        if (file.size > maxSizeInBytes) {
          oversizedFiles.push(file.name);
        } else {
          formData.append("files[]", file);
        }
      });

      if (oversizedFiles.length > 0) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `The following files exceed 2MB: ${oversizedFiles.join(", ")}`,
            type: "error",
          }),
        );
      }

      if (formData.has("files[]")) {
        try {
          const { data } = await tribesApi.uploadMultiple(formData);

          if (data.success) {
            setMediaFiles((prev) => [...prev, ...data.data.images]);
            await formik.setFieldValue("media", data.data.images);
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "Images uploaded",
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
              message: err?.response?.data?.message || "Error",
              type: "error",
            }),
          );
        }
      }
    }
    // Reset file input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (imageToRemove: string) => {
    setMediaFiles((prevImages) =>
      prevImages.filter((image) => image !== imageToRemove),
    );
  };

  const handleVideoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        formData.append(`files[]`, file); // Add each file to the `file[]` key
      });
      try {
        const { data } = await tribesApi.uploadMultiple(formData);
        if (data.success) {
          setVideoFiles((prev) => [...prev, ...data.data.images]);
          await formik.setFieldValue("videos", data.data.images);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Videos uploaded",
              type: "success",
            }),
          );
        } else {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error uploading video",
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
    }
  };

  const removeVideo = (videoToRemove: string) => {
    setVideoFiles((prevVideos) =>
      prevVideos.filter((video) => video !== videoToRemove),
    );
  };

  const handleCreateThread = async (values: any) => {
    const hasPolls = values.polls || false;
    let thread_polls = null;
    if (poll) {
      thread_polls = {
        title: pollTitle,
        options: pollOptions,
        start_at: pollStart,
        end_at: pollEnd,
      };
    }
    const data = { ...values, polls: hasPolls, thread_polls };
    createThreadMutation.mutate(
      { tribeId: tribe_id, data },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Thread created",
              type: "success",
            }),
          );
          formik.resetForm();
          toggle();
        },
        onError: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error creating thread",
              type: "error",
            }),
          );
        },
      },
    );
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const removePollOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  const handlePolls = () => {
    setPoll(!poll);
    formik.setFieldValue("polls", !poll);
  };

  const addDefaultOption = () => {
    setPollOptions([""]);
  };

  useEffect(() => {
    if (pollOptions.length === 0) {
      addDefaultOption();
    }
  }, [pollOptions]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Create thread</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex h-screen w-screen flex-col rounded-[12px] bg-white laptop:h-full laptop:w-[800px]">
            <div className={`p-6`}>
              <div className="flex items-center justify-between">
                <div className="cursor-pointer" onClick={toggle}>
                  <CloseIcon />
                </div>
                <div>
                  <FormikButton
                    loading={formik.isSubmitting}
                    title="Post"
                    error={formik.isValid}
                  />
                </div>
              </div>
              <div className="mt-2">
                <div className="grid gap-2">
                  <input
                    id="tribe-name"
                    type="text"
                    className="border-0 font-sans text-[18px] font-semibold shadow-none focus:border-0 focus:border-transparent focus:outline-none focus:ring-0"
                    placeholder="Topic"
                    onChange={(e) => {
                      formik.setFieldValue("topic", e.target.value);
                    }}
                    value={formik.values.topic}
                  />
                  {formik.touched.topic && formik.errors.topic ? (
                    <p className="text-[12px] text-[#FF8D8D]">
                      {formik.errors.topic}
                    </p>
                  ) : null}
                </div>
                <div className="mt-4 grid gap-2">
                  <textarea
                    id="tribe-name"
                    className="h-[160px] resize-none border-0 font-sans text-[16px] font-normal shadow-none focus:border-transparent focus:outline-none focus:ring-0"
                    placeholder="Share your thoughts..."
                    value={formik.values.thoughts}
                    onChange={(e) => {
                      formik.setFieldValue("thoughts", e.target.value);
                    }}
                  />
                  {formik.touched.thoughts && formik.errors.thoughts ? (
                    <p className="text-[12px] text-[#FF8D8D]">
                      {formik.errors.thoughts}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-[40px]">
                  <div className={"flex gap-2"}>
                    {mediaFiles &&
                      mediaFiles.length > 0 &&
                      mediaFiles.map((media: any, index: number) => (
                        <div
                          key={index}
                          className="relative inline-block h-[200px] w-[200px]"
                        >
                          <Image
                            src={media}
                            alt="event_image"
                            width={200}
                            height={200}
                            className="h-full w-full rounded"
                          />

                          <div
                            className="absolute right-2 top-2 z-10 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-white shadow"
                            onClick={() => removeImage(media)}
                          >
                            <span className="font-semibold text-black">X</span>
                          </div>
                        </div>
                      ))}
                  </div>
                  {videoFiles &&
                    videoFiles.length > 0 &&
                    videoFiles.map((media: any, index: number) => (
                      <div
                        className="relative inline-block h-[200px] w-[200px]"
                        key={index}
                      >
                        <video
                          src={media}
                          controls
                          width={200}
                          height={200}
                          className="h-full w-full rounded"
                        />

                        <div
                          className="absolute right-2 top-2 z-10 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-white shadow"
                          onClick={() => removeVideo(media)}
                        >
                          <span className="font-semibold text-black">X</span>
                        </div>
                      </div>
                    ))}
                  {poll && (
                    <div className="grid gap-3">
                      <input
                        id="tribe-name"
                        type="text"
                        className="border-0 font-sans text-[18px] font-semibold shadow-none focus:border-0 focus:border-transparent focus:outline-none focus:ring-0"
                        placeholder="Poll title"
                        onChange={(e) => {
                          setPollTitle(e.target.value);
                        }}
                        value={pollTitle}
                      />

                      <div className="flex flex-col gap-2">
                        {pollOptions.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              className="w-[300px] rounded-md border border-gray-300 px-3 py-2 font-sans text-[16px] shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={`Option ${index + 1}`}
                              onChange={(e) =>
                                updatePollOption(index, e.target.value)
                              }
                              value={option}
                            />
                            {pollOptions.length > 1 && index > 0 && (
                              <CloseRedIcon
                                className="cursor-pointer"
                                onClick={() => removePollOption(index)}
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="w-[100px] rounded-md bg-gradient-green py-2 font-sans font-semibold text-white shadow-sm hover:bg-indigo-600"
                        onClick={addPollOption}
                      >
                        Add Option
                      </button>

                      <div className="mt-2 flex gap-2">
                        <DatePicker
                          selected={pollStart ? new Date(pollStart) : null}
                          onChange={(date: Date | null) => {
                            if (date) {
                              // Update start date
                              setPollStart(date.toISOString());
                              // Adjust end date if it's before the new start date
                              if (pollEnd && new Date(pollEnd) < date) {
                                setPollEnd(date.toISOString());
                              }
                            }
                          }}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="yyyy-MM-dd HH:mm"
                          className="w-[200px] cursor-pointer rounded-[10px] font-sans text-[12px] font-semi-normal shadow-none"
                          placeholderText="Poll start date and time"
                        />

                        <DatePicker
                          selected={pollEnd ? new Date(pollEnd) : null}
                          onChange={(date: Date | null) => {
                            if (date) {
                              // Ensure end date is not before start date
                              setPollEnd(date.toISOString());
                            }
                          }}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="yyyy-MM-dd HH:mm"
                          className="w-[200px] cursor-pointer rounded-[10px] font-sans text-[12px] font-semi-normal shadow-none"
                          placeholderText="Poll end date and time"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isMobile ? (
              <div className="fixed bottom-0 flex w-full items-center gap-6 rounded-bl-[12px] rounded-br-[12px] bg-mid-grey p-4">
                <ImageIcon
                  className="cursor-pointer"
                  onClick={handleImageInput}
                />
                <VideoIcon
                  className="cursor-pointer"
                  onClick={handleVideoInput}
                />
                <PollIcon className="cursor-pointer" onClick={handlePolls} />
                <div className="ml-4 flex cursor-pointer">
                  <p>+ Add tags</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6 rounded-bl-[12px] rounded-br-[12px] bg-mid-grey p-4">
                <ImageIcon
                  className="cursor-pointer"
                  onClick={handleImageInput}
                />
                <VideoIcon
                  className="cursor-pointer"
                  onClick={handleVideoInput}
                />
                <PollIcon className="cursor-pointer" onClick={handlePolls} />
                <div className="ml-4 flex cursor-pointer">
                  <p>+ Add tags</p>
                </div>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple={true}
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <input
            type="file"
            accept="video/*"
            ref={videoFileInputRef}
            style={{ display: "none" }}
            onChange={handleVideoChange}
          />
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default CreateThreadModal;
