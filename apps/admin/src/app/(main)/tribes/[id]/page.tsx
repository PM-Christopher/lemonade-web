"use client";
import MainLayout from "@/components/layouts/MainLayout";
import { RequirePermission } from "@/components/global/RequirePermission";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import MainTribeCard from "@/components/tribes/MainTribeCard";
import TribeDetails from "@/components/tribes/TribeDetails";
import AddThreadForm from "@/components/tribes/AddThreadForm";
import { useTribeDetailQuery } from "@/features/tribes/queries";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import React, { use, useEffect, useRef, useState } from "react";

// Off the initial bundle — only needed once the flag/reactivate control
// fires (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI"), matching
// EventDetailsClient's SuspendModal/DeleteModal pattern.
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
const RemoveMemberModal = dynamic(() => import("@/modals/tribes/RemoveMemberModal"), {
  ssr: false,
});

// A Client Component page (tribes is the one section that stays client-side
// — see the section-permission migration notes) still receives `params` as
// a Promise in Next.js 15; `use()` is the documented way to unwrap it here.
const TribeDetailPage = (props: { params: Promise<{ id: string }> }) => {
  const { id } = use(props.params);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useTribeDetailQuery(id, { enabled: isLoggedIn });

  const [restrictModalOpen, setRestrictModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
  const threads = data?.threads ?? [];
  const members = data?.members ?? [];
  const isRestricted = tribe?.status === "RESTRICTED";

  return (
    <RequirePermission permission={ADMIN_SECTION_PERMISSIONS.tribes}>
      <MainLayout>
        <section className="flex justify-between bg-white">
          <div className="flex h-[780px] w-[888px] flex-col gap-4 overflow-y-auto border-r p-6">
            <p className="text-[16px] font-semibold">Tribe threads</p>
            <AddThreadForm tribeId={id} />
            {threads.length > 0 ? (
              threads.map((thread) => (
                <MainTribeCard key={thread.id} thread={thread} onDelete={setDeleteThreadId} />
              ))
            ) : (
              <p className="text-text-grey text-[14px] font-normal">No threads yet</p>
            )}
          </div>

          <div className="flex h-[780px] w-[788px] flex-col gap-6 overflow-y-auto p-6">
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-semibold">Tribe details</p>
              {isRestricted ? (
                <button
                  className="bg-gradient-green h-11 w-[156px] rounded-xl border text-center"
                  onClick={() => setReactivateModalOpen(true)}
                >
                  <p className="text-[16px] font-medium text-white">Reactivate tribe</p>
                </button>
              ) : (
                <div className="relative inline-block" ref={containerRef}>
                  <div
                    className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <p className="text-[14px] font-medium">Flag tribe</p>
                    <ChevronDown />
                  </div>
                  {dropdownOpen && (
                    <div className="absolute top-full right-0 z-50 w-[207px] rounded-xl bg-white shadow">
                      <ul>
                        <li
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setDropdownOpen(false);
                            setRestrictModalOpen(true);
                          }}
                        >
                          <p className="text-[16px] font-normal">Restrict tribe</p>
                        </li>
                        <li
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setDropdownOpen(false);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <p className="text-red-1 text-[16px] font-normal">Delete tribe</p>
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
                onRemoveMember={(userId, name) => setRemoveMemberTarget({ userId, name })}
              />
            ) : (
              <p className="text-text-grey text-[14px] font-normal">Loading tribe...</p>
            )}
          </div>
        </section>

        <RestrictTribeModal
          isOpen={restrictModalOpen}
          toggle={() => setRestrictModalOpen(false)}
          id={id}
        />
        <DeleteTribeModal
          isOpen={deleteModalOpen}
          toggle={() => setDeleteModalOpen(false)}
          id={id}
        />
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
      </MainLayout>
    </RequirePermission>
  );
};

export default TribeDetailPage;
