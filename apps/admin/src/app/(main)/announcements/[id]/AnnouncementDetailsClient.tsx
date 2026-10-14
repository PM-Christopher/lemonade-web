"use client";
import React from "react";
import { useHydrated } from "@/hooks/useHydrated";
import MainLayout from "@/components/layouts/MainLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAnnouncementDetailQuery } from "@/features/announcements/queries";
import { capitalizeWords } from "@/utils/helper";

function AnnouncementDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: detail } = useAnnouncementDetailQuery(id, {
    enabled: isLoggedIn,
  });
  const announcement = detail?.announcement;
  const isHydrated = useHydrated();

  // Don't render dynamic content until hydrated
  if (!isHydrated) {
    return (
      <MainLayout>
        <section className={"flex justify-between p-5"}>
          <div className={"flex h-fit w-200 flex-col rounded-xl bg-white"}>
            <div className={"flex flex-col gap-5 p-6"}>
              <div className={"flex items-center gap-6"}>
                <div className={"w-28.75"}>
                  <p className={"text-text-grey text-meta leading-normal font-medium"}>
                    Event Owner:
                  </p>
                </div>
                <div className={"flex gap-1"}>
                  <p className={"text-body-s font-medium"}>Loading...</p>
                </div>
              </div>
              <div className={"flex items-center gap-6"}>
                <div className={"w-28.75"}>
                  <p className={"text-text-grey text-meta leading-normal font-medium"}>
                    Announcement ID:
                  </p>
                </div>
                <p className={"text-body-s font-medium"}>Loading...</p>
              </div>
              <div className={"flex items-center gap-6"}>
                <div className={"w-28.75"}>
                  <p className={"text-text-grey text-meta leading-normal font-medium"}>
                    Date Created:
                  </p>
                </div>
                <div className={"flex gap-1"}>
                  <p className={"text-body-s font-medium"}>Loading...</p>
                </div>
              </div>
              <div className={"flex items-center gap-6"}>
                <div className={"w-28.75"}>
                  <p className={"text-text-grey text-meta leading-normal font-medium"}>Status:</p>
                </div>
                <p className={"text-light-green-70 text-body-s font-medium"}>Loading...</p>
              </div>
            </div>
          </div>
          <div className={"flex h-fit w-195 flex-col gap-4 rounded-xl bg-white"}>
            <div className={"flex items-center justify-between border-b p-6"}>
              <p className={"font-semiBold text-body-l"}>Announcement</p>
              <div className={"border-light-grey-50 cursor-pointer rounded-xl border p-2.5 px-3.5"}>
                <p className={"text-body-s font-medium"}>Edit draft</p>
              </div>
            </div>
            <div className={"flex flex-col gap-4 p-6"}>
              <div className={"flex flex-col"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>Title</p>
                <p className={"font-semiBold text-title-r leading-normal"}>Loading...</p>
              </div>
              <div className={"flex flex-col"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>Body</p>
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  // Parse content safely
  let content = null;
  try {
    content = announcement?.content ? JSON.parse(announcement.content) : null;
  } catch (error) {
    console.error("Error parsing announcement content:", error);
    content = null;
  }

  return (
    <MainLayout>
      <section className={"flex justify-between p-5"}>
        <div className={"flex h-fit w-200 flex-col rounded-xl bg-white"}>
          <div className={"flex flex-col gap-5 p-6"}>
            <div className={"flex items-center gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Event Owner:
                </p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-body-s font-medium"}>
                  {announcement?.created_by?.name || "N/A"}
                </p>
              </div>
            </div>
            <div className={"flex items-center gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Announcement ID:
                </p>
              </div>
              <p className={"text-body-s font-medium"}>AN112332</p>
            </div>
            <div className={"flex items-center gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Date Created:
                </p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-body-s font-medium"}>{announcement?.created_at || "N/A"}</p>
              </div>
            </div>
            <div className={"flex items-center gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>Status:</p>
              </div>
              <p className={"text-light-green-70 text-body-s font-medium"}>
                {announcement?.status ? capitalizeWords(announcement.status) : "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div className={"flex h-fit w-195 flex-col gap-4 rounded-xl bg-white"}>
          <div className={"flex items-center justify-between border-b p-6"}>
            <p className={"font-semiBold text-body-l"}>Announcement</p>
            <div className={"border-light-grey-50 cursor-pointer rounded-xl border p-2.5 px-3.5"}>
              <p className={"text-body-s font-medium"}>Edit draft</p>
            </div>
          </div>
          <div className={"flex flex-col gap-4 p-6"}>
            <div className={"flex flex-col"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>Title</p>
              <p className={"font-semiBold text-title-r leading-normal"}>
                {content?.title || "No title available"}
              </p>
            </div>
            <div className={"flex flex-col"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>Body</p>
              {content?.content ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              ) : (
                <p>No content available</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default AnnouncementDetailsClient;
