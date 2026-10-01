"use client";
import React, { useEffect, useMemo, useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import SearchIcon from "@/images/icons/search.svg";
import PinnedIcon from "@/images/icons/pinnedIcon.svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import ThreadCard from "@/components/tribe/ThreadCard";
import TribeDetailsCard from "@/components/tribe/TribeDetailsCard";
import JoinTribeModal from "@/components/tribe/JoinTribeModal";
import { Thread } from "@/interfaces/TribeInterface";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import EditIcon from "@/images/icons/edit.svg";
import { useMediaQuery } from "react-responsive";
import ShareTribeModal from "@/components/tribe/ShareTribeModal";
import UserInfoModal from "@/components/tribe/UserInfoModal";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import {
  useTribeQuery,
  useThreadsQuery,
  usePinnedThreadsQuery,
  tribeKeys,
} from "@/features/tribes/queries";
import {
  useFilterThreadsMutation,
  usePinThreadMutation,
  useViewProfileMutation,
} from "@/features/tribes/mutations";
import { useVerifyTransactionMutation } from "@/features/transaction/mutations";
import DeleteThreadModal from "@/components/tribe/DeleteThreadModal";
import AddMemberModal from "@/components/tribe/AddMemberModal";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import useDebounce from "@/hooks/useDebounce";
import useNxtSearchParams from "@/hooks/useSearchParams";
import PadlockIcon from "@/images/icons/padlockIconFilled.svg";
import JoinedTribeModal from "@/components/tribe/JoinedTribeModal";
import { ThreadsSkeleton } from "@/components/Skeletons";

// Off the initial bundle — both are only needed once a user opens the
// corresponding modal (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy
// leaf UI").
const CreateThreadModal = dynamic(() => import("@/components/tribe/CreateThreadModal"), {
  ssr: false,
});
const ReportThreadModal = dynamic(() => import("@/components/tribe/ReportThreadModal"), {
  ssr: false,
});

const TribeClient = ({ id }: { id: string }) => {
  const [createThreadModalOpen, setCreateThreadModalOpen] = useState(false);
  const [joinTribeModalOpen, setJoinTribeModalOpen] = useState(false);
  const [shareTribeModalOpen, setShareTribeModalOpen] = useState(false);
  const [userInfoModal, setUserInfoModal] = useState(false);
  const [reportThreadModal, setReportThreadModal] = useState(false);
  const [deleteThreadModal, setDeleteThreadModal] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [joinedTribeModal, setJoinedTribeModal] = useState(false);

  const [threadId, setThreadId] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data: tribeData, isLoading: tribeLoading } = useTribeQuery(id);
  const tribe = tribeData?.tribe ?? null;
  const { data: threadsData, isLoading: dataLoading } = useThreadsQuery(id);
  const threads = useMemo(() => threadsData?.threads ?? [], [threadsData?.threads]);
  const { data: pinnedThreadsData } = usePinnedThreadsQuery(id);
  const pinnedThreads = pinnedThreadsData?.threads ?? [];

  const viewProfileMutation = useViewProfileMutation();
  const user = viewProfileMutation.data?.user;
  const filterThreadsMutation = useFilterThreadsMutation(id);
  const pinThreadMutation = usePinThreadMutation(id);
  const verifyTransactionMutation = useVerifyTransactionMutation();

  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSearchParams, nxtSearchParams } = useNxtSearchParams();

  const query = nxtSearchParams?.get("search");
  const data = useMemo(() => {
    const q = query?.toLowerCase()?.trim();
    if (!q) return threads;
    return threads.filter((thread: Thread) => {
      return (
        thread?.topic?.toLowerCase().includes(q) || thread?.thoughts?.toLowerCase().includes(q)
      );
    });
  }, [threads, query]);
  const [searchValue, setSearchValue] = useState("");
  const { debouncedValue } = useDebounce(searchValue, 500);
  useEffect(() => {
    setSearchParams({ search: debouncedValue });
    // setSearchParams's identity changes on every navigation (it depends
    // on useSearchParams()'s live searchParams — see
    // hooks/useSearchParams.ts), so including it here would re-run this
    // effect after every push and push again, in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const trxref = searchParams.get("trxref");

  useEffect(() => {
    if (trxref) {
      verifyTransactionMutation.mutate(
        { trx_ref: trxref },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tribeKeys.detail(id) });
            // Remove trxref from URL
            const params_ = new URLSearchParams(searchParams);
            params_.delete("trxref");
            params_.delete("reference");
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "Joined tribe successfully",
                type: "success",
              }),
            );
            setJoinedTribeModal(true);
            // Update the URL without reloading
            router.replace(`?${params_.toString()}`);
          },
          onError: (err) => {
            console.error("Payment verification failed:", err);
          },
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trxref]);

  const toggleAddMember = () => {
    setAddUserModal(!addUserModal);
  };

  const activateCreateThreadModal = () => {
    setCreateThreadModalOpen(!createThreadModalOpen);
  };

  const switchUserId = (id: number) => {
    viewProfileMutation.mutate(id);
    activateUserInfoModal();
  };

  const setPinThread = (id: number) => {
    const current = threads.find((t) => t.id === id);
    pinThreadMutation.mutate({
      threadId: id,
      wasPinned: current?.pinned ?? false,
    });
  };

  const activateJoinTribeModal = () => {
    setJoinTribeModalOpen(!joinTribeModalOpen);
  };

  const activateShareTribeModal = () => {
    setShareTribeModalOpen(!shareTribeModalOpen);
  };

  const activateUserInfoModal = () => {
    setUserInfoModal(!userInfoModal);
  };

  const activateReportThreadModal = () => {
    setReportThreadModal(!reportThreadModal);
  };

  const sortThreads = (value: string) => {
    if (!tribe) return;
    filterThreadsMutation.mutate({ tribeId: tribe.id, filter: value });
  };

  const toggleThreadId = (id: number) => {
    setThreadId(id);
    activateReportThreadModal();
  };

  const toggleDeleteThreadModal = (id: number) => {
    setThreadId(id);
    activateDeleteThreadModal();
  };

  const activateDeleteThreadModal = () => {
    setDeleteThreadModal(!deleteThreadModal);
  };

  const handleScroll = (id: number) => {
    const itemId = `pinned-${id}`;
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleJoinedTribeModal = () => {
    setJoinedTribeModal(!joinedTribeModal);
  };

  return (
    <MainLayout>
      <div className="bg-light_grey pb-10">
        <div className="tablet:flex-row tablet:items-center flex flex-col justify-between gap-4 border-t border-b bg-white p-5 px-10">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => router.push("/tribe")}
          >
            <div>
              <ChevronLeft />
            </div>
            <div>
              <p className="font-sans text-[16px] leading-[24px] font-semibold">
                {tribe?.tribe_name}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div className="bg-light_grey tablet:w-[300px] flex h-10 w-[247px] items-center gap-3 rounded-xl px-4">
              <div>
                <SearchIcon />
              </div>
              <div className="w-full">
                <input
                  id="search"
                  type="text"
                  className="bg-light_grey w-full rounded-xl border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                  placeholder="Search thread"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <Select onValueChange={sortThreads}>
              <SelectTrigger
                aria-label="Sort threads"
                className="bg-mid-grey h-10 w-[180px] rounded-xl border-0 px-4"
              >
                <SelectValue
                  placeholder={
                    <span className="text-text-grey font-sans text-[12px] leading-[14.4px] font-semibold">
                      Select Option
                    </span>
                  }
                />
              </SelectTrigger>
              <SelectContent className="form-font">
                <SelectItem value="popular">Popularity</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-around">
          {/* Left Content Section */}
          <div className="laptop:px-10 flex w-full max-w-[1000px] flex-col px-4">
            {/* Pinned Threads */}
            {pinnedThreads?.length > 0 && (
              <div className="bg-grey-20 flex flex-wrap items-center justify-start gap-3 rounded-lg p-3">
                {pinnedThreads.map((pinned, index) => (
                  <button
                    key={pinned.id ?? index}
                    onClick={() => handleScroll(pinned.id)}
                    className="hover:bg-grey-10 flex items-center gap-2 rounded-md bg-white px-3 py-2 transition"
                  >
                    <p className="max-w-[150px] truncate text-sm font-semibold text-gray-800">
                      {pinned.topic}
                    </p>
                    <PinnedIcon className="w-3 text-gray-600" />
                  </button>
                ))}
              </div>
            )}

            {/* Threads Section */}
            <div
              className={`mt-4 flex flex-col gap-4 rounded-xl bg-white shadow-sm ${
                tribe?.has_joined ? "overflow-y-auto" : "overflow-hidden"
              } hide-scrollbar max-h-[100vh] p-4`}
            >
              {dataLoading || data === undefined ? (
                <ThreadsSkeleton count={4} />
              ) : data.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No threads found...</div>
              ) : (
                <div className="flex flex-col gap-6">
                  {data.map((thread: Thread, index: number) => (
                    <ThreadCard
                      key={thread.id ?? `thread-${index}`}
                      tribe_id={tribe?.id}
                      tribe={tribe}
                      thread={thread}
                      toggle={activateUserInfoModal}
                      switchUserId={switchUserId}
                      pinThread={setPinThread}
                      toggleThreadId={toggleThreadId}
                      toggleDeleteThread={toggleDeleteThreadModal}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Monetized Tribe Overlay */}
            {tribe && !tribe.has_joined && tribe.monetized && (
              <div className="fixed bottom-0 left-0 z-50 flex h-[130px] w-full flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-md">
                <div className="flex items-center gap-2 text-gray-700">
                  <PadlockIcon />
                  <p>Paid Tribe</p>
                </div>
                <button
                  onClick={activateJoinTribeModal}
                  className="text-light-green text-sm font-medium underline transition hover:text-green-700"
                >
                  Unlock Tribe content
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar (Desktop only) */}
          {!isMobile && (
            <aside className="tablet:block hidden">
              <TribeDetailsCard
                share={activateShareTribeModal}
                toggle={activateCreateThreadModal}
                tribe={tribe}
                toggleAddMember={toggleAddMember}
                toggleJoin={activateJoinTribeModal}
                threads={threads}
                loading={tribeLoading}
              />
            </aside>
          )}

          {/* Modals */}
          <CreateThreadModal
            tribe_id={tribe?.id}
            tribe_slug={id}
            toggle={activateCreateThreadModal}
            isOpen={createThreadModalOpen}
          />
          <JoinTribeModal
            toggle={activateJoinTribeModal}
            isOpen={joinTribeModalOpen}
            tribe={tribe}
          />
          <JoinedTribeModal
            toggle={toggleJoinedTribeModal}
            isOpen={joinedTribeModal}
            tribe={tribe}
          />
          <ShareTribeModal
            toggle={activateShareTribeModal}
            isOpen={shareTribeModalOpen}
            tribe={tribe}
          />
          {Boolean(user) && (
            <UserInfoModal
              toggle={activateUserInfoModal}
              isOpen={userInfoModal}
              user={user}
              tribe={tribe}
            />
          )}
          <ReportThreadModal
            toggle={activateReportThreadModal}
            isOpen={reportThreadModal}
            threadId={threadId}
          />
          <DeleteThreadModal
            toggle={activateDeleteThreadModal}
            isOpen={deleteThreadModal}
            threadId={threadId}
            setThreadId={setThreadId}
            tribeId={id}
          />
          <AddMemberModal isOpen={addUserModal} toggle={toggleAddMember} id={id} />
        </div>
      </div>
      {isMobile && (
        <div
          className="bg-gradient-green shadow-custom-bottom fixed right-4 bottom-[150px] flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full p-4 text-white"
          onClick={activateCreateThreadModal}
        >
          <EditIcon className="h-[19px] w-[19px]" />
        </div>
      )}
    </MainLayout>
  );
};

export default TribeClient;
