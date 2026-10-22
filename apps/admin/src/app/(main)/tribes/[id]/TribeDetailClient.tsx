"use client";
import MainTribeCard from "@/components/tribes/MainTribeCard";
import TribeDetails from "@/components/tribes/TribeDetails";
import { useTribeDetailQuery } from "@/features/tribes/queries";
import { usePinTribeThreadMutation } from "@/features/tribes/mutations";
import type { TribeThread, TribeThreadAuthor } from "@/features/tribes/api";
import { useSelector } from "react-redux";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import { RootState } from "@/redux/store";
import { ChevronDown, PinIcon, SearchIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { errorMessage } from "@/lib/api-error";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";

// Lazy-loaded; only needed once a moderation control is used.
const RestrictTribeModal = dynamic(() => import("@/modals/tribes/RestrictTribeModal"), {
  ssr: false,
});
const DeleteTribeModal = dynamic(() => import("@/modals/tribes/DeleteTribeModal"), {
  ssr: false,
});
const TribeStatusModal = dynamic(() => import("@/modals/tribes/TribeStatusModal"), {
  ssr: false,
});
const DeleteThreadModal = dynamic(() => import("@/modals/tribes/DeleteThreadModal"), {
  ssr: false,
});
const CreateThreadModal = dynamic(() => import("@/modals/tribes/CreateThreadModal"), {
  ssr: false,
});
const MemberInfoModal = dynamic(() => import("@/modals/tribes/MemberInfoModal"), {
  ssr: false,
});
const RemoveMemberModal = dynamic(() => import("@/modals/tribes/RemoveMemberModal"), {
  ssr: false,
});

// Tribe threads, details and moderation actions.
const TribeDetailClient = ({ id }: { id: string }) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useTribeDetailQuery(id, { enabled: isLoggedIn });

  const [restrictModalOpen, setRestrictModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createThreadOpen, setCreateThreadOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<TribeThreadAuthor | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"popular" | "newest">("newest");
  const dispatch = useDispatch<AppDispatch>();
  const pinMutation = usePinTribeThreadMutation(id);
  const [deleteThreadId, setDeleteThreadId] = useState<string | undefined>(undefined);
  const [removeMemberTarget, setRemoveMemberTarget] = useState<
    { userId: string; name: string } | undefined
  >(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tribe = data?.tribe;
  const allThreads = data?.threads ?? [];
  const term = search.trim().toLowerCase();
  const popularity = (thread: TribeThread) =>
    (thread.likes_count ?? 0) + (thread.comments_count ?? 0);
  const threads = allThreads
    .filter(
      (thread) =>
        term === "" ||
        thread.topic.toLowerCase().includes(term) ||
        thread.thoughts.toLowerCase().includes(term),
    )
    .sort((a, b) => (sort === "popular" ? popularity(b) - popularity(a) : 0));
  const pinned = allThreads.filter((thread) => thread.pinned);

  const pinThread = (threadId: string) =>
    pinMutation.mutate(threadId, {
      onError: (error) =>
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Couldn't pin that thread."),
            type: "error",
          }),
        ),
    });
  const members = data?.members ?? [];
  const isRestricted = tribe?.status === "RESTRICTED";

  return (
    <>
      <section className="flex justify-between bg-white">
        <div className="flex h-195 w-2/3 shrink-0 flex-col gap-4 overflow-y-auto border-r p-6">
          {pinned.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {pinned.map((thread: TribeThread) => (
                <div
                  key={thread.id}
                  className="bg-light-grey text-body-s flex w-56 shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2"
                >
                  <span className="truncate">{thread.topic}</span>
                  <PinIcon className="text-text-grey h-3.5 w-3.5 shrink-0" />
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <div className="bg-light-grey border-grey-20 flex h-10 flex-1 items-center gap-3 rounded-xl border px-3">
              <SearchIcon className="text-grey-40 h-3.5 w-3.5" />
              <input
                type="text"
                aria-label="Search tribe"
                className="text-body-s w-full bg-transparent focus:outline-none"
                placeholder="Search Tribe"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Select value={sort} onValueChange={(value) => setSort(value as "popular" | "newest")}>
              <SelectTrigger
                aria-label="Sort threads"
                className="font-semiBold text-text-grey text-meta h-10 w-36 rounded-xl uppercase"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {threads.length > 0 ? (
            threads.map((thread) => (
              <MainTribeCard
                key={thread.id}
                thread={thread}
                onDelete={setDeleteThreadId}
                onPin={pinThread}
                onViewProfile={(item) => setProfileUser(item.user)}
              />
            ))
          ) : (
            <p className="text-text-grey text-body-s font-normal">No threads yet</p>
          )}
        </div>

        <div className="flex h-195 min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
          <div className="flex items-center justify-between">
            <p className="text-body-l font-semibold">Tribe details</p>
            {isRestricted ? (
              <button
                className="bg-gradient-green h-11 w-39 rounded-xl border text-center"
                onClick={() => setReactivateModalOpen(true)}
              >
                <p className="text-body-l font-medium text-white">Reactivate Tribe</p>
              </button>
            ) : (
              <div className="relative inline-block" ref={containerRef}>
                <div
                  className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <p className="text-body-s font-medium">Flag Tribe</p>
                  <ChevronDown />
                </div>
                {dropdownOpen && (
                  <div className="absolute top-full right-0 z-50 w-51.75 rounded-xl bg-white shadow">
                    <ul>
                      <li
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          setRestrictModalOpen(true);
                        }}
                      >
                        <p className="text-body-l font-normal">Restrict Tribe</p>
                      </li>
                      <li
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <p className="text-red-1 text-body-l font-normal">Delete Tribe</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          {tribe ? (
            <TribeDetails
              tribe={tribe}
              members={members}
              onCreateThread={() => setCreateThreadOpen(true)}
              onRemoveMember={(userId, name) => setRemoveMemberTarget({ userId, name })}
            />
          ) : (
            <p className="text-text-grey text-body-s font-normal">Loading tribe...</p>
          )}
        </div>
      </section>

      <CreateThreadModal
        isOpen={createThreadOpen}
        toggle={() => setCreateThreadOpen(false)}
        tribeId={id}
      />
      <MemberInfoModal
        isOpen={profileUser !== null}
        toggle={() => setProfileUser(null)}
        user={profileUser}
      />
      <RestrictTribeModal
        isOpen={restrictModalOpen}
        toggle={() => setRestrictModalOpen(false)}
        id={id}
      />
      <DeleteTribeModal isOpen={deleteModalOpen} toggle={() => setDeleteModalOpen(false)} id={id} />
      <TribeStatusModal
        isOpen={reactivateModalOpen}
        toggle={() => setReactivateModalOpen(false)}
        id={id}
      />
      <DeleteThreadModal
        isOpen={Boolean(deleteThreadId)}
        toggle={() => setDeleteThreadId(undefined)}
        tribeId={id}
        threadId={deleteThreadId}
      />
      <RemoveMemberModal
        isOpen={Boolean(removeMemberTarget)}
        toggle={() => setRemoveMemberTarget(undefined)}
        tribeId={id}
        userId={removeMemberTarget?.userId}
        memberName={removeMemberTarget?.name}
      />
    </>
  );
};

export default TribeDetailClient;
