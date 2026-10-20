"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { SearchIcon, XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle, FormattedText } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TribeDetails from "@/components/tribes/TribeDetails";
import { images } from "@/lib/images";
import { useUserTribeQuery } from "@/features/user/queries";
import type { UserTribeDetail } from "@/features/user/api";

interface UserTribeModalProps {
  isOpen: boolean;
  toggle: () => void;
  userId: string;
  tribeId: string | number | undefined;
}

// The tribe's details panel takes the admin tribe shape; map the user's tribe onto it.
const toAdminTribe = (tribe: UserTribeDetail) => ({
  id: tribe.id,
  image: tribe.image,
  name: tribe.name,
  category: tribe.category,
  members_count: tribe.members_count,
  threads_count: tribe.threads_count,
  description: tribe.description,
  created_at: tribe.created_at,
  status: "ACTIVE" as const,
  monetized: tribe.monetized,
  access_fee: tribe.membership_fee,
  creator: tribe.creator ? { ...tribe.creator, is_admin: false } : null,
});

// A user's tribe: its threads and members, read-only.
function UserTribeModal({ isOpen, toggle, userId, tribeId }: UserTribeModalProps) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useUserTribeQuery(userId, tribeId, { enabled: isLoggedIn && isOpen });
  const [search, setSearch] = useState("");
  const tribe = data?.tribe_info;

  const term = search.trim().toLowerCase();
  const threads = (tribe?.threads ?? []).filter(
    (thread) =>
      !term ||
      thread.topic?.toLowerCase().includes(term) ||
      thread.thoughts?.toLowerCase().includes(term),
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{tribe?.name ?? "Tribe"}</DialogTitle>
        <div className="flex h-[88vh] w-288 max-w-[96vw] flex-col rounded-xl bg-white">
          <div className="border-b-grey-20 flex items-center justify-between border-b p-5">
            <p className="text-body-l font-sans font-semibold">{tribe?.name ?? "Tribe"}</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </button>
          </div>
          <div className="flex min-h-0 flex-1">
            <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto border-r p-5">
              <div className="bg-light-grey flex h-10 items-center gap-3 rounded-xl px-4">
                <SearchIcon className="w-3" />
                <input
                  aria-label="Search threads"
                  className="text-body-s w-full bg-transparent outline-none"
                  placeholder="Search tribe"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              {threads.length > 0 ? (
                threads.map((thread) => (
                  <article key={thread.id} className="border-b pb-4">
                    <div className="flex items-center gap-2">
                      <Image
                        unoptimized
                        src={thread.user?.profile_image || images.AVATAR_1}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <p className="text-body-s font-semibold">
                        {thread.user?.fullname ?? "Unknown"}
                      </p>
                      <p className="text-text-grey text-meta">
                        {dayjs(thread.created_at).format("D MMM, YYYY")}
                      </p>
                    </div>
                    <p className="text-body-s mt-2 font-semibold">{thread.topic}</p>
                    <FormattedText
                      text={thread.thoughts}
                      className="text-body-s mt-1 font-normal"
                    />
                  </article>
                ))
              ) : (
                <p className="text-text-grey text-body-s font-normal">No threads found.</p>
              )}
            </div>
            <div className="w-90 shrink-0 overflow-y-auto p-5">
              {tribe && (
                <>
                  <p className="text-body-s mb-3 font-semibold">Tribe details</p>
                  <TribeDetails
                    tribe={toAdminTribe(tribe)}
                    members={tribe.members.map((member) => ({
                      id: member.id,
                      user_id: member.user_id,
                      created_at: "",
                      user: member.user
                        ? {
                            id: member.user.id,
                            fullname: member.user.fullname,
                            username: member.user.username,
                            profile_image: member.user.profile_image,
                          }
                        : null,
                    }))}
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-body-s font-medium">Private Tribe</p>
                      <p className="text-text-grey text-meta font-normal">
                        Available to only added members.
                      </p>
                    </div>
                    <span
                      role="img"
                      aria-label={tribe.private ? "Private" : "Open"}
                      className={`inline-flex h-5 w-9 items-center rounded-full px-0.5 ${
                        tribe.private ? "bg-light-green justify-end" : "justify-start bg-gray-300"
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full bg-white" />
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default UserTribeModal;
