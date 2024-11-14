"use client"
import React, {useEffect, useRef, useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import ImageIcon from "@/images/icons/image.svg";
import VideoIcon from "@/images/icons/video-camera.svg";
import CloseRedIcon from "@/images/icons/closeRedIcon.svg"
import PollIcon from "@/images/icons/votes.svg";
import * as yup from "yup";
import {useFormik} from "formik";
import {FormikButton} from "@/components/global/FormikButton";
import {useSelector} from "react-redux";
import {createThread} from "@/features/tribes/tribe.slice";
import {useAppDispatch} from "@/redux/hook";
import {useMediaQuery} from "react-responsive";
import {axiosInstance} from "@/lib/axiosInstane";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import DatePicker from "react-datepicker";

type CreateThreadInterface = {
    toggle: () => void,
    isOpen: boolean,
    tribe_id: number
}

const CreateThreadModal: React.FC<CreateThreadInterface> = ({toggle, isOpen, tribe_id}) => {
    const {authToken} = useSelector((state: any) => state.auth)
    const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
    const dispatch = useAppDispatch()
    const [mediaFiles, setMediaFiles] = useState<string[]>([])
    const [videoFiles, setVideoFiles] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const videoFileInputRef = useRef<HTMLInputElement | null>(null);
    const [pollTitle, setPollTitle] = useState("")
    const [pollOptions, setPollOptions] = useState<string[]>([""])
    const [pollStart, setPollStart] = useState("");
    const [pollEnd, setPollEnd] = useState("");
    const [poll, setPoll] = useState(false)

    const createThreadSchema = yup.object({
        topic: yup
            .string()
            .required("Topic is required"),
        thoughts: yup
            .string()
            .required("Thoughts is required"),
        media: yup.array().nullable(),
        videos: yup.array().nullable(),
        tags: yup.array().nullable(),
        polls: yup.boolean()
    })
    const formik = useFormik({
        initialValues: {
            topic: "",
            thoughts: "",
            media: [],
            videos: [],
            tags: [],
            polls: false
        },
        validationSchema: createThreadSchema,
        onSubmit: async (values) => {
            await handleCreateThread(values)
        },
    })

    const handleImageInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleVideoInput = () => {
        if (videoFileInputRef.current) {
            videoFileInputRef.current.click();
        }
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const formData = new FormData()
            Array.from(files).forEach((file, index) => {
                formData.append(`files[]`, file); // Add each file to the `file[]` key
            });
            try {
                const { data } = await axiosInstance.post("/upload-multiple", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(data.status) {
                    setMediaFiles((prev) => [...prev, ...data.data.images]);
                    await formik.setFieldValue("media", data.data.images)
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Images uploaded",
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
        }
    }

    const removeImage = (imageToRemove: string) => {
        setMediaFiles(prevImages => prevImages.filter(image => image !== imageToRemove));
    };

    const handleVideoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const formData = new FormData()
            Array.from(files).forEach((file, index) => {
                formData.append(`files[]`, file); // Add each file to the `file[]` key
            });
            try {
                const { data } = await axiosInstance.post("/upload-multiple", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(data.status) {
                    setVideoFiles((prev) => [...prev, ...data.data.images]);
                    await formik.setFieldValue("videos", data.data.images)
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Videos uploaded",
                            type: "success",
                        })
                    );
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Error uploading video",
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
        }
    }

    const removeVideo = (videoToRemove: string) => {
        setVideoFiles(prevVideos => prevVideos.filter(video => video !== videoToRemove));
    };

    const handleCreateThread = async (values: any) => {
        const hasPolls = values.polls || false
        let thread_polls = null;
        if (poll) {
            thread_polls = {
                title: pollTitle,
                options: pollOptions,
                start_at: pollStart,
                end_at: pollEnd
            }
        }
        const data = {...values, polls: hasPolls, thread_polls}
        dispatch(createThread({token: authToken, id: tribe_id, data })).then((res:any) => {
            if (res.payload.status) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Thread created",
                        type: "success",
                    })
                );
                formik.resetForm()
                toggle()
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Error uploading image",
                        type: "error",
                    })
                );
            }
        }).catch((error) => {

        })
    }

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
        setPoll(!poll)
        formik.setFieldValue("polls", !poll)
    }

    const addDefaultOption = () => {
        setPollOptions([""]);
    };

    useEffect(() => {
        if (pollOptions.length === 0) {
            addDefaultOption();
        }
    }, [pollOptions]);

    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col bg-white rounded-[12px] w-screen laptop:w-[800px] h-screen laptop:h-full">
                    <div className={`p-6`}>
                        <div className="flex justify-between items-center">
                            <div className="cursor-pointer" onClick={toggle}>
                                <CloseIcon/>
                            </div>
                            <div>
                                <FormikButton loading={formik.isSubmitting} title="Post" error={formik.isValid}/>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="grid gap-2">
                                <input
                                    id="tribe-name"
                                    type="text"
                                    className="font-sans font-semibold text-[18px] border-0 shadow-none focus:outline-none focus:border-0 focus:ring-0 focus:border-transparent"
                                    placeholder="Topic"
                                    onChange={(e) => {
                                        formik.setFieldValue("topic", e.target.value)
                                    }}
                                    value={formik.values.topic}
                                />
                            </div>
                            <div className="grid gap-2 mt-4">
                                    <textarea
                                        id="tribe-name"
                                        className="font-sans h-[160px] font-normal text-[16px] border-0 shadow-none focus:outline-none focus:ring-0 focus:border-transparent resize-none"
                                        placeholder="Share your thoughts..."
                                        value={formik.values.thoughts}
                                        onChange={(e) => {
                                            formik.setFieldValue("thoughts", e.target.value)
                                        }}
                                    />
                            </div>
                            <div className="flex gap-2">
                                {
                                    mediaFiles && mediaFiles.length > 0 && (
                                        mediaFiles.map((media: any, index: number) => (
                                            <div className="relative inline-block w-[200px] h-[200px]">
                                                <Image
                                                    src={media}
                                                    alt="event_image"
                                                    width={200}
                                                    height={200}
                                                    className="rounded w-full h-full"
                                                />

                                                <div
                                                    className="absolute top-2 right-2 w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center cursor-pointer shadow z-10"
                                                    onClick={() => removeImage(media)}
                                                >
                                                    <span className="text-black font-semibold">X</span>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                                {
                                    videoFiles && videoFiles.length > 0 && (
                                        videoFiles.map((media: any, index: number) => (
                                            <div className="relative inline-block w-[200px] h-[200px]" key={index}>
                                                <video
                                                    src={media}
                                                    controls
                                                    width={200}
                                                    height={200}
                                                    className="rounded w-full h-full"
                                                />

                                                <div
                                                    className="absolute top-2 right-2 w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center cursor-pointer shadow z-10"
                                                    onClick={() => removeVideo(media)}
                                                >
                                                    <span className="text-black font-semibold">X</span>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                                {
                                    poll && (
                                        <div className="grid gap-3">
                                            <input
                                                id="tribe-name"
                                                type="text"
                                                className="font-sans font-semibold text-[18px] border-0 shadow-none focus:outline-none focus:border-0 focus:ring-0 focus:border-transparent"
                                                placeholder="Poll title"
                                                onChange={(e) => {
                                                    setPollTitle(e.target.value)
                                                }}
                                                value={pollTitle}
                                            />

                                            <div className="flex flex-col gap-2">
                                                {pollOptions.map((option, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            className="w-[300px] font-sans text-[16px] border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                            placeholder={`Option ${index + 1}`}
                                                            onChange={(e) => updatePollOption(index, e.target.value)}
                                                            value={option}
                                                        />
                                                        {pollOptions.length > 1 && (
                                                            index > 0 && (
                                                                <CloseRedIcon
                                                                    className="cursor-pointer"
                                                                    onClick={() => removePollOption(index)}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                className="font-sans w-[100px] font-semibold text-white bg-gradient-green hover:bg-indigo-600  py-2 rounded-md shadow-sm"
                                                onClick={addPollOption}
                                            >
                                                Add Option
                                            </button>

                                            <div className="flex gap-2 mt-2">
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
                                                    className="font-sans font-semi-normal text-[12px] shadow-none rounded-[10px] cursor-pointer w-[200px]"
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
                                                    className="font-sans font-semi-normal text-[12px] shadow-none rounded-[10px] cursor-pointer w-[200px]"
                                                    placeholderText="Poll end date and time"
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    {
                        isMobile ? (
                            <div
                                className="bg-mid-grey flex p-4 gap-6 items-center rounded-bl-[12px] rounded-br-[12px] fixed bottom-0 w-full">
                                <ImageIcon className="cursor-pointer" onClick={handleImageInput}/>
                                <VideoIcon className="cursor-pointer" onClick={handleVideoInput}/>
                                <PollIcon className="cursor-pointer" onClick={handlePolls}/>
                                <div className="flex ml-4 cursor-pointer">
                                    <p>+ Add tags</p>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="bg-mid-grey flex p-4 gap-6 items-center rounded-bl-[12px] rounded-br-[12px]">
                                <ImageIcon className="cursor-pointer" onClick={handleImageInput}/>
                                <VideoIcon className="cursor-pointer" onClick={handleVideoInput}/>
                                <PollIcon className="cursor-pointer" onClick={handlePolls}/>
                                <div className="flex ml-4 cursor-pointer">
                                    <p>+ Add tags</p>
                                </div>
                            </div>
                        )
                    }
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple={true}
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                />
                <input
                    type="file"
                    accept="video/*"
                    ref={videoFileInputRef}
                    style={{display: 'none'}}
                    onChange={handleVideoChange}
                />
            </form>
        </div>
    );
}

export default CreateThreadModal;