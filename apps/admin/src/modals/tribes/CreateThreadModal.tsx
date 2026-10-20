"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { ImageIcon, ListChecksIcon, PlusIcon, VideoIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContentBare, DialogTitle, Input, Textarea } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { tribesApi } from "@/features/tribes/api";
import { useAddTribeThreadMutation } from "@/features/tribes/mutations";
import { addTribeThreadSchema, type AddTribeThreadInput } from "@/features/tribes/schema";
import { errorMessage } from "@/lib/api-error";

const LOCAL_FORMAT = "YYYY-MM-DDTHH:mm";

interface CreateThreadModalProps {
  isOpen: boolean;
  toggle: () => void;
  tribeId: string;
}

// Post a thread to a tribe as the admin team.
function CreateThreadModal({ isOpen, toggle, tribeId }: CreateThreadModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const addThreadMutation = useAddTribeThreadMutation(tribeId);
  const imageInput = useRef<HTMLInputElement | null>(null);
  const videoInput = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagText, setTagText] = useState("");
  const [addingTag, setAddingTag] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pollOn, setPollOn] = useState(false);
  const [pollTitle, setPollTitle] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollStart, setPollStart] = useState(() => dayjs().format(LOCAL_FORMAT));
  const [pollEnd, setPollEnd] = useState(() => dayjs().add(1, "day").format(LOCAL_FORMAT));
  const [pollError, setPollError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddTribeThreadInput>({
    resolver: zodResolver(addTribeThreadSchema),
    defaultValues: { topic: "", thoughts: "" },
  });

  const toast = (message: string) =>
    dispatch(updateToastifyReducer({ show: true, message, type: "error" }));

  const upload = async (file: File | undefined, kind: "image" | "video") => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { image } = await tribesApi.uploadImage(formData);
      if (kind === "image") setImages((current) => [...current, image]);
      else setVideos((current) => [...current, image]);
    } catch {
      toast("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = () => {
    const tag = tagText.trim();
    if (tag && !tags.includes(tag)) setTags((current) => [...current, tag]);
    setTagText("");
    setAddingTag(false);
  };

  const close = () => {
    reset();
    setImages([]);
    setVideos([]);
    setTags([]);
    setTagText("");
    setAddingTag(false);
    setPollOn(false);
    setPollTitle("");
    setPollOptions(["", ""]);
    setPollError(null);
    toggle();
  };

  const onSubmit = (data: AddTribeThreadInput) => {
    const options = pollOptions.map((option) => option.trim()).filter(Boolean);

    if (pollOn) {
      if (!pollTitle.trim()) return setPollError("Add a poll question.");
      if (options.length < 2) return setPollError("Add at least two options.");
      if (!dayjs(pollEnd).isAfter(dayjs(pollStart)))
        return setPollError("The end must be after the start.");
    }

    setPollError(null);
    addThreadMutation.mutate(
      {
        ...data,
        media: images,
        videos,
        tags,
        ...(pollOn && {
          polls: true,
          thread_polls: {
            title: pollTitle.trim(),
            options,
            start_at: dayjs(pollStart).toISOString(),
            end_at: dayjs(pollEnd).toISOString(),
          },
        }),
      },
      {
        onSuccess: close,
        onError: (error) => toast(errorMessage(error, "Something went wrong")),
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Create thread</DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[90vh] w-170 max-w-[94vw] flex-col overflow-hidden rounded-xl bg-white"
        >
          <div className="flex items-center justify-between p-4">
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={close}>
              <XIcon />
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="bg-gradient-green h-9 rounded-lg px-4 disabled:opacity-60"
            >
              <p className="text-body-s font-medium text-white">
                {isSubmitting ? "Posting..." : "Post"}
              </p>
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
            <Input
              placeholder="Topic"
              className="text-body-s border-0 px-0 font-semibold shadow-none focus-visible:ring-0"
              {...register("topic")}
            />
            {errors.topic && (
              <p className="text-red-1 text-meta leading-normal">{errors.topic.message}</p>
            )}
            <Textarea
              placeholder="Share your thoughts..."
              className="min-h-48 resize-none border-0 px-0 shadow-none focus-visible:ring-0"
              {...register("thoughts")}
            />
            {errors.thoughts && (
              <p className="text-red-1 text-meta leading-normal">{errors.thoughts.message}</p>
            )}
            {(images.length > 0 || videos.length > 0) && (
              <div className="flex flex-wrap gap-3">
                {images.map((src) => (
                  <div key={src} className="relative">
                    <Image
                      unoptimized
                      src={src}
                      alt=""
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      aria-label="Remove image"
                      className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white"
                      onClick={() => setImages((current) => current.filter((item) => item !== src))}
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {videos.map((src) => (
                  <div key={src} className="relative">
                    <video src={src} className="h-32 w-32 rounded-xl object-cover" muted />
                    <button
                      type="button"
                      aria-label="Remove video"
                      className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white"
                      onClick={() => setVideos((current) => current.filter((item) => item !== src))}
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {pollOn && (
              <div className="border-grey-20 flex flex-col gap-2 rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-body-s font-semibold">Poll</p>
                  <button type="button" aria-label="Remove poll" onClick={() => setPollOn(false)}>
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
                <Input
                  aria-label="Poll question"
                  placeholder="Poll question"
                  value={pollTitle}
                  onChange={(event) => setPollTitle(event.target.value)}
                />
                {pollOptions.map((option, index) => (
                  <Input
                    key={index}
                    aria-label={`Option ${index + 1}`}
                    placeholder={`Option ${index + 1}`}
                    maxLength={100}
                    value={option}
                    onChange={(event) =>
                      setPollOptions((current) =>
                        current.map((item, at) => (at === index ? event.target.value : item)),
                      )
                    }
                  />
                ))}
                {pollOptions.length < 6 && (
                  <button
                    type="button"
                    className="text-light-green-70 text-body-s w-fit cursor-pointer font-medium"
                    onClick={() => setPollOptions((current) => [...current, ""])}
                  >
                    + Add option
                  </button>
                )}
                <div className="flex gap-3">
                  <label className="text-text-grey text-meta flex flex-1 flex-col gap-1">
                    Starts
                    <input
                      type="datetime-local"
                      className="text-body-s rounded-lg border px-2 py-1 text-black"
                      value={pollStart}
                      onChange={(event) => setPollStart(event.target.value)}
                    />
                  </label>
                  <label className="text-text-grey text-meta flex flex-1 flex-col gap-1">
                    Ends
                    <input
                      type="datetime-local"
                      className="text-body-s rounded-lg border px-2 py-1 text-black"
                      value={pollEnd}
                      onChange={(event) => setPollEnd(event.target.value)}
                    />
                  </label>
                </div>
                {pollError && <p className="text-red-1 text-meta leading-normal">{pollError}</p>}
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-mid-grey text-body-s flex items-center gap-1 rounded-full px-3 py-1"
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`Remove tag ${tag}`}
                      onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="bg-light-grey flex items-center gap-5 px-4 py-3">
            <button
              type="button"
              aria-label="Add image"
              className="cursor-pointer"
              onClick={() => imageInput.current?.click()}
            >
              <ImageIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Add video"
              className="cursor-pointer"
              onClick={() => videoInput.current?.click()}
            >
              <VideoIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Add poll"
              className="cursor-pointer"
              onClick={() => setPollOn(true)}
            >
              <ListChecksIcon className="h-5 w-5" />
            </button>
            {addingTag ? (
              <input
                autoFocus
                value={tagText}
                placeholder="Tag name"
                className="text-body-s rounded-lg border px-2 py-1 outline-none"
                onChange={(event) => setTagText(event.target.value)}
                onBlur={addTag}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
              />
            ) : (
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1"
                onClick={() => setAddingTag(true)}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="text-body-s font-medium">Add tags</span>
              </button>
            )}
            {isUploading && <span className="text-text-grey text-meta">Uploading...</span>}
            <input
              ref={imageInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                void upload(event.target.files?.[0], "image");
                event.target.value = "";
              }}
            />
            <input
              ref={videoInput}
              type="file"
              accept="video/*"
              hidden
              onChange={(event) => {
                void upload(event.target.files?.[0], "video");
                event.target.value = "";
              }}
            />
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
}

export default CreateThreadModal;
