"use client";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useEffect, useMemo, useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import SearchIcon from "@/images/icons/search.svg";
import PinnedIcon from "@/images/icons/pinnedIcon.svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import ThreadCard from "@/components/tribe/ThreadCard";
import TribeDetailsCard from "@/components/tribe/TribeDetailsCard";
import TribeDetailsSheet from "@/components/tribe/TribeDetailsSheet";
import RemoveMemberModal, { type MemberToRemove } from "@/components/tribe/RemoveMemberModal";
import DeleteTribeModal from "@/components/tribe/DeleteTribeModal";
import { Info as InfoCircle } from "lucide-react";
import JoinTribeModal from "@/components/tribe/JoinTribeModal";
import { Thread } from "@/interfaces/TribeInterface";
import MainLayout from "@/components/layouts/MainLayout";
import EditIcon from "@/images/icons/edit.svg";
import { useMediaQuery } from "react-responsive";
import ShareTribeModal from "@/components/tribe/ShareTribeModal";
import UserInfoModal, { type TribeUserInfo } from "@/components/tribe/UserInfoModal";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
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
  useChangeTribeTypeMutation,
  createThreadMutationKey,
} from "@/features/tribes/mutations";
import { usePaymentReturn } from "@/features/transaction/usePaymentReturn";
import DeleteThreadModal from "@/components/tribe/DeleteThreadModal";
import AddMemberModal from "@/components/tribe/AddMemberModal";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { errorMessage } from "@/lib/api-error";
import useDebounce from "@/hooks/useDebounce";
import useNxtSearchParams from "@/hooks/useSearchParams";
import PadlockIcon from "@/images/icons/padlockIconFilled.svg";
import JoinedTribeModal from "@/components/tribe/JoinedTribeModal";
import { ThreadsSkeleton } from "@/components/Skeletons";
import { Clock, Flame, History } from "lucide-react";

const SORT_OPTIONS = [
  { value: "popular", label: "Popular", Icon: Flame },
  { value: "newest", label: "Newest", Icon: Clock },
  { value: "oldest", label: "Oldest", Icon: History },
];

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
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<MemberToRemove | null>(null);
  const [deleteTribeOpen, setDeleteTribeOpen] = useState(false);

  const [threadId, setThreadId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data: tribeData, isLoading: tribeLoading } = useTribeQuery(id);
  const tribe = tribeData?.tribe ?? null;
  // A paid tribe's threads are for members, so a non-member only gets the summary.
  const canViewContent = tribe !== null && (!tribe.monetized || tribe.has_joined);
  const { data: threadsData, isLoading: dataLoading } = useThreadsQuery(id, {
    enabled: canViewContent,
  });
  const threads = useMemo(() => threadsData?.threads ?? [], [threadsData?.threads]);
  const { data: pinnedThreadsData } = usePinnedThreadsQuery(id, { enabled: canViewContent });
  const pinnedThreads = pinnedThreadsData?.threads ?? [];

  const viewProfileMutation = useViewProfileMutation();
  const user = viewProfileMutation.data?.user;
  const filterThreadsMutation = useFilterThreadsMutation(id);
  const pinThreadMutation = usePinThreadMutation(id);
  const changeTribeTypeMutation = useChangeTribeTypeMutation(id);
  const [sortBy, setSortBy] = useState("newest");
  const uploadingThread = useIsMutating({ mutationKey: createThreadMutationKey(id) }) > 0;

  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const { push } = useNavigation();
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
  }, [debouncedValue, setSearchParams]);

  usePaymentReturn(() => {
    queryClient.invalidateQueries({ queryKey: tribeKeys.detail(id) });
    dispatch(
      updateToastifyReducer({
        show: true,
        message: apiMessage("Joined tribe successfully"),
        type: "success",
      }),
    );
    setJoinedTribeModal(true);
  });

  const toggleAddMember = () => {
    setAddUserModal(!addUserModal);
  };

  const activateCreateThreadModal = () => {
    setCreateThreadModalOpen((open) => !open);
  };

  const switchUserId = (id: string) => {
    viewProfileMutation.mutate(id);
    activateUserInfoModal();
  };

  const setPinThread = (id: string) => {
    const current = threads.find((t) => t.id === id);
    pinThreadMutation.mutate(
      {
        threadId: id,
        wasPinned: current?.pinned ?? false,
      },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage(current?.pinned ? "Thread unpinned" : "Thread pinned"),
              type: "success",
            }),
          );
        },
        onError: (error) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: errorMessage(error, "Could not pin thread"),
              type: "error",
            }),
          );
        },
      },
    );
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

  const togglePrivate = () => {
    changeTribeTypeMutation.mutate(undefined, {
      onError: (error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Could not update the tribe"),
            type: "error",
          }),
        );
      },
    });
  };

  const sortThreads = (value: string) => {
    if (!tribe) return;
    setSortBy(value);
    filterThreadsMutation.mutate({ tribeId: tribe.id, filter: value });
  };

  const toggleThreadId = (id: string) => {
    setThreadId(id);
    activateReportThreadModal();
  };

  const toggleDeleteThreadModal = (id: string) => {
    setThreadId(id);
    activateDeleteThreadModal();
  };

  const activateDeleteThreadModal = () => {
    setDeleteThreadModal(!deleteThreadModal);
  };

  const handleScroll = (id: string) => {
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
        <div className="tablet:flex-row tablet:items-center flex flex-col justify-between gap-4 bg-white p-5 px-10">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => push(routes.TRIBE)}
          >
            <div>
              <ChevronLeft />
            </div>
            <div>
              <p className="text-body-l font-sans font-semibold">{tribe?.tribe_name}</p>
            </div>
          </div>
          {isMobile && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Tribe details"
                className="text-text-grey cursor-pointer"
                onClick={() => setDetailsSheetOpen(true)}
              >
                <InfoCircle className="h-5 w-5" />
              </button>
              {tribe && !tribe.has_joined && !tribe.owner && (
                <button
                  type="button"
                  className="bg-gradient-green h-9 rounded-xl px-5 text-sm font-semibold text-white"
                  onClick={activateJoinTribeModal}
                >
                  Join
                </button>
              )}
            </div>
          )}
          <div className="laptop:w-124 flex w-full items-center gap-2.5">
            <div className="bg-light_grey flex h-10 min-w-0 flex-1 items-center gap-3 rounded-xl px-4">
              <div>
                <SearchIcon />
              </div>
              <div className="w-full">
                <input
                  id="search"
                  type="text"
                  className="bg-light_grey text-body-s w-full rounded-xl border-0 focus:border-transparent focus:ring-0 focus:outline-none"
                  placeholder="Search thread"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <Select value={sortBy} onValueChange={sortThreads}>
                <SelectTrigger
                  aria-label="Sort threads"
                  className="bg-mid-grey text-text-grey text-meta h-10! w-full rounded-xl border-0 px-4 font-sans font-semibold uppercase"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="form-font">
                  {SORT_OPTIONS.map(({ value, label, Icon }) => (
                    <SelectItem key={value} value={value}>
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {uploadingThread && (
          <div className="mx-auto mt-4 flex w-full max-w-250 flex-col gap-2 rounded-lg bg-white p-3 px-4 shadow-sm">
            <p className="text-text-grey text-body-s font-normal">Uploading thread...</p>
            <div className="bg-grey-20 h-1 w-full overflow-hidden rounded-full">
              <div className="bg-light-green h-full w-1/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-around">
          {/* Left Content Section */}
          <div className="laptop:px-10 flex w-full max-w-250 flex-col px-4">
            {/* Pinned Threads */}
            {pinnedThreads?.length > 0 && (
              <div className="bg-grey-20 flex flex-wrap items-center justify-start gap-3 rounded-lg p-3">
                {pinnedThreads.map((pinned, index) => (
                  <button
                    key={pinned.id ?? index}
                    onClick={() => handleScroll(pinned.id)}
                    className="hover:bg-grey-10 flex items-center gap-2 rounded-md bg-white px-3 py-2 transition"
                  >
                    <p className="max-w-37.5 truncate text-sm font-semibold text-gray-800">
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
                canViewContent ? "overflow-y-auto" : "overflow-hidden"
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
              <div className="fixed bottom-0 left-0 z-50 flex h-32.5 w-full flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-md">
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
                togglePrivate={togglePrivate}
                isUpdatingPrivacy={changeTribeTypeMutation.isPending}
                onRemoveMember={setMemberToRemove}
                onDeleteTribe={() => setDeleteTribeOpen(true)}
              />
            </aside>
          )}
          {isMobile && (
            <TribeDetailsSheet
              isOpen={detailsSheetOpen}
              onClose={() => setDetailsSheetOpen(false)}
              share={activateShareTribeModal}
              toggle={() => {
                setDetailsSheetOpen(false);
                activateCreateThreadModal();
              }}
              tribe={tribe}
              toggleAddMember={() => {
                setDetailsSheetOpen(false);
                toggleAddMember();
              }}
              toggleJoin={() => {
                setDetailsSheetOpen(false);
                activateJoinTribeModal();
              }}
              threads={threads}
              loading={tribeLoading}
              togglePrivate={togglePrivate}
              isUpdatingPrivacy={changeTribeTypeMutation.isPending}
              onRemoveMember={setMemberToRemove}
              onDeleteTribe={() => {
                setDetailsSheetOpen(false);
                setDeleteTribeOpen(true);
              }}
              onSearch={() => {
                setDetailsSheetOpen(false);
                document.getElementById("search")?.focus();
              }}
            />
          )}
          {tribe && (
            <DeleteTribeModal
              isOpen={deleteTribeOpen}
              toggle={() => setDeleteTribeOpen(false)}
              tribeId={String(tribe.id)}
              tribeSlug={id}
              isPaid={Boolean(tribe.monetized)}
            />
          )}
          <RemoveMemberModal
            tribeSlug={id}
            member={memberToRemove}
            onClose={() => setMemberToRemove(null)}
          />

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
              user={user as TribeUserInfo | null}
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
          className="bg-gradient-green fixed right-4 bottom-37.5 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full p-4 text-white"
          onClick={activateCreateThreadModal}
        >
          <EditIcon className="h-4.75 w-4.75" />
        </div>
      )}
    </MainLayout>
  );
};

export default TribeClient;
