"use client";
import { images } from "@/lib/images";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  DotIcon,
  HeartIcon,
  MessageCircleIcon,
  MoreVerticalIcon,
  PinIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import dayjs from "dayjs";
import { TribeThread } from "@/features/tribes/api";

interface MainTribeCardProps {
  thread: TribeThread;
  onDelete?: (threadId: string) => void;
  onPin?: (threadId: string) => void;
  onViewProfile?: (thread: TribeThread) => void;
}

const PREVIEW_LENGTH = 200;

// One thread with its media and a menu for profile, pin and delete.
const MainTribeCard = ({ thread, onDelete, onPin, onViewProfile }: MainTribeCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLong = thread.thoughts.length > PREVIEW_LENGTH;
  const thoughts =
    isLong && !expanded
      ? `${thread.thoughts.slice(0, PREVIEW_LENGTH).trimEnd()}...`
      : thread.thoughts;

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (action: () => void) => {
    setMenuOpen(false);
    action();
  };

  return (
    <div className="border-grey-20 flex flex-col gap-2 border-b pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            unoptimized
            src={thread.user?.profile_image || images.DEFAULT_TRIBE}
            alt={thread.user?.fullname ?? "member"}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
          <div className="flex items-center gap-2">
            <p className="text-body-s font-normal">{thread.user?.fullname ?? "Admin"}</p>
            <DotIcon className="text-light-grey-50 px-0" />
            <p className="text-text-grey text-meta leading-normal font-normal">
              {dayjs(thread.created_at).format("DD MMM, YYYY")}
            </p>
            {thread.pinned && <PinIcon className="text-light-green h-3.5 w-3.5" />}
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Thread actions"
            className="cursor-pointer"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </button>
          {menuOpen && (
            <ul className="absolute top-full right-0 z-40 mt-2 flex w-52 flex-col gap-1 rounded-xl bg-white p-3 shadow-lg">
              {thread.user && onViewProfile && (
                <li>
                  <button
                    type="button"
                    className="text-body-l flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-100"
                    onClick={() => choose(() => onViewProfile(thread))}
                  >
                    <UserIcon className="h-5 w-5" /> View profile
                  </button>
                </li>
              )}
              {onPin && (
                <li>
                  <button
                    type="button"
                    className="text-body-l flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-100"
                    onClick={() => choose(() => onPin(thread.id))}
                  >
                    <PinIcon className="h-5 w-5" /> {thread.pinned ? "Unpin thread" : "Pin thread"}
                  </button>
                </li>
              )}
              {onDelete && (
                <li>
                  <button
                    type="button"
                    className="text-red-1 text-body-l flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-100"
                    onClick={() => choose(() => onDelete(thread.id))}
                  >
                    <Trash2Icon className="h-5 w-5" /> Delete thread
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
      <p className="text-body-s font-medium">{thread.topic}</p>
      <p className="text-light-black text-body-s font-sans font-normal whitespace-pre-line">
        {thoughts}
      </p>
      {isLong && (
        <button
          type="button"
          className="text-light-green text-body-s w-fit cursor-pointer font-medium"
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? "see less" : "see more"}
        </button>
      )}
      {(thread.media?.length ?? 0) > 0 || (thread.videos?.length ?? 0) > 0 ? (
        <div className="flex flex-col gap-2">
          {thread.media?.map((src) => (
            <Image
              key={src}
              unoptimized
              src={src}
              alt={thread.topic}
              width={640}
              height={400}
              className="max-h-96 w-full rounded-xl object-cover"
            />
          ))}
          {thread.videos?.map((src) => (
            <video key={src} src={src} controls className="max-h-96 w-full rounded-xl" />
          ))}
        </div>
      ) : null}
      {thread.poll && (
        <div className="bg-light-grey flex flex-col gap-2 rounded-xl p-3">
          <p className="text-body-s font-semibold">{thread.poll.title}</p>
          {thread.poll.options.map((option) => (
            <div
              key={option.id}
              className="text-body-s flex justify-between rounded-lg bg-white px-3 py-2"
            >
              <span>{option.content}</span>
              <span className="text-text-grey">{option.votes_count ?? 0} votes</span>
            </div>
          ))}
        </div>
      )}
      <div className="text-text-grey text-meta flex items-center gap-4">
        <span className="flex items-center gap-1">
          <HeartIcon className="h-3.5 w-3.5" /> {thread.likes_count ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircleIcon className="h-3.5 w-3.5" /> {thread.comments_count ?? 0}
        </span>
      </div>
      {(thread.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2">
          {thread.tags?.map((tag) => (
            <span key={tag} className="bg-mid-grey text-meta rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainTribeCard;
