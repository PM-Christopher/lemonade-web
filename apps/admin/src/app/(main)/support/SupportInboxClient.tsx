"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CheckIcon, MessageSquareTextIcon, RotateCcwIcon, SearchIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { AvatarName } from "@/components/global/AvatarName";
import { SupportChatPanel } from "@/components/support/SupportChatPanel";
import { useSupportInboxQuery, useSavedRepliesQuery } from "@/features/support/queries";
import { useUpdateConversationMutation } from "@/features/support/mutations";
import type { SupportConversation } from "@/features/support/api";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import useDebounce from "@/hooks/useDebounce";
import { errorMessage } from "@/lib/api-error";
import { routes } from "@/lib/routes";

dayjs.extend(relativeTime);

const SavedRepliesModal = dynamic(() => import("@/modals/support/SavedRepliesModal"), {
  ssr: false,
});

type Tab = "open" | "unread" | "mine" | "resolved";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "open", label: "Open" },
  { key: "unread", label: "Unread" },
  { key: "mine", label: "Mine" },
  { key: "resolved", label: "Resolved" },
];

// The support inbox: every conversation in one list, with the chat beside it.
function SupportInboxClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [tab, setTab] = useState<Tab>("open");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const { debouncedValue: search } = useDebounce(searchTerm, 300);
  const { data: me } = useCurrentAdminQuery();
  const myId = me ? String(me.id) : null;

  const { data, isLoading } = useSupportInboxQuery(
    {
      status: tab === "resolved" ? "resolved" : "open",
      unread: tab === "unread",
      assignee: tab === "mine" ? "me" : undefined,
      search: search.trim() || undefined,
    },
    { enabled: isLoggedIn },
  );
  const { data: replies } = useSavedRepliesQuery({ enabled: isLoggedIn });
  const updateMutation = useUpdateConversationMutation();
  const conversations = data?.conversations ?? [];
  // The conversation you picked, or the first one while nothing is picked or it has left the list.
  const selected: SupportConversation | undefined =
    conversations.find((item) => item.user.id === selectedId) ?? conversations[0];

  const act = (
    userId: string,
    action: "resolve" | "reopen" | "assign" | "unassign",
    done: string,
  ) =>
    updateMutation.mutate(
      { userId, action },
      {
        onSuccess: () =>
          dispatch(updateToastifyReducer({ show: true, message: done, type: "success" })),
        onError: (error) =>
          dispatch(
            updateToastifyReducer({
              show: true,
              message: errorMessage(error, "That didn't work. Try again."),
              type: "error",
            }),
          ),
      },
    );

  const counts = data?.counts;
  const countFor: Record<Tab, number | undefined> = {
    open: counts?.open,
    unread: counts?.unread,
    mine: counts?.mine,
    resolved: counts?.resolved,
  };

  return (
    <>
      <section className="flex h-[calc(100vh-9rem)] min-h-130 gap-4 p-5">
        <div className="flex w-96 shrink-0 flex-col rounded-xl bg-white">
          <div className="flex flex-col gap-3 border-b p-4">
            <div className="flex items-center justify-between">
              <p className="font-semiBold text-body-l">Support inbox</p>
              <button
                type="button"
                className="text-text-grey flex cursor-pointer items-center gap-1 text-sm"
                onClick={() => setRepliesOpen(true)}
              >
                <MessageSquareTextIcon className="h-4 w-4" /> Saved replies
              </button>
            </div>
            <div className="bg-light_grey border-grey-20 flex h-10 items-center gap-3 rounded-xl border px-3">
              <SearchIcon className="text-grey-40 h-3 w-3" />
              <input
                type="text"
                aria-label="Search conversations"
                className="text-body-s w-full bg-transparent focus:outline-none"
                placeholder="Search name, email or message"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="bg-mid-grey flex gap-1 rounded-xl p-1">
              {TABS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`text-body-s flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg py-1 whitespace-nowrap ${tab === item.key ? "bg-white font-semibold" : "text-text-grey"}`}
                >
                  {item.label}
                  {typeof countFor[item.key] === "number" && countFor[item.key] ? (
                    <span
                      className={`rounded-full px-1.5 text-xs ${item.key === "unread" ? "bg-red-1 text-white" : "bg-white"}`}
                    >
                      {countFor[item.key]}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <li key={conversation.user.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(conversation.user.id)}
                  className={`border-grey-20 flex w-full cursor-pointer flex-col gap-1 border-b p-4 text-left ${selected?.user.id === conversation.user.id ? "bg-light-tint" : "hover:bg-light-grey"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <AvatarName name={conversation.user.name} image={conversation.user.image} />
                    <span className="text-text-grey text-meta shrink-0">
                      {conversation.last_message.at
                        ? dayjs(conversation.last_message.at).fromNow()
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-body-s line-clamp-1 ${conversation.unread > 0 ? "font-semibold" : "text-text-grey"}`}
                    >
                      {conversation.last_message.from === "admin" ? "You: " : ""}
                      {conversation.last_message.text}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="bg-red-1 text-meta rounded-full px-1.5 leading-normal font-medium text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  {conversation.assignee && (
                    <p className="text-text-grey text-meta">
                      {conversation.assignee.id === myId
                        ? "Assigned to you"
                        : `With ${conversation.assignee.name}`}
                    </p>
                  )}
                </button>
              </li>
            ))}
            {conversations.length === 0 && (
              <li className="text-text-grey text-body-s p-8 text-center">
                {isLoading
                  ? "Loading..."
                  : tab === "resolved"
                    ? "No resolved conversations."
                    : "You're all caught up."}
              </li>
            )}
          </ul>
        </div>

        <div className="flex min-w-0 flex-1 flex-col rounded-xl bg-white">
          {selected ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                <div className="min-w-0">
                  <p className="text-body-l truncate font-semibold">{selected.user.name}</p>
                  <p className="text-text-grey text-body-s flex items-center gap-2">
                    {selected.user.email}
                    <Link
                      href={routes.USER_DETAIL(selected.user.id)}
                      className="text-light-green-70 font-medium"
                    >
                      View profile
                    </Link>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selected.assignee?.id === myId ? (
                    <button
                      type="button"
                      disabled={updateMutation.isPending}
                      className="cursor-pointer rounded-xl border px-3 py-2 text-sm"
                      onClick={() => act(selected.user.id, "unassign", "Handed back to the team")}
                    >
                      Release
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={updateMutation.isPending}
                      className="cursor-pointer rounded-xl border px-3 py-2 text-sm"
                      onClick={() => act(selected.user.id, "assign", "It's yours now")}
                    >
                      {selected.assignee ? "Take over" : "Assign to me"}
                    </button>
                  )}
                  {selected.status === "open" ? (
                    <button
                      type="button"
                      disabled={updateMutation.isPending}
                      className="bg-gradient-green flex cursor-pointer items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                      onClick={() => act(selected.user.id, "resolve", "Marked as resolved")}
                    >
                      <CheckIcon className="h-4 w-4" /> Resolve
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={updateMutation.isPending}
                      className="flex cursor-pointer items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium"
                      onClick={() => act(selected.user.id, "reopen", "Reopened")}
                    >
                      <RotateCcwIcon className="h-4 w-4" /> Reopen
                    </button>
                  )}
                </div>
              </div>
              <SupportChatPanel userId={selected.user.id} savedReplies={replies?.replies ?? []} />
            </>
          ) : (
            <p className="text-text-grey text-body-s m-auto">
              {conversations.length === 0 ? "Nothing to answer right now." : "Pick a conversation."}
            </p>
          )}
        </div>
      </section>
      <SavedRepliesModal isOpen={repliesOpen} toggle={() => setRepliesOpen(false)} />
    </>
  );
}

export default SupportInboxClient;
