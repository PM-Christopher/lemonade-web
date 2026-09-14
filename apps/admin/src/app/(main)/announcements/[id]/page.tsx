"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAnnouncementDetailQuery } from "@/features/announcements/queries";
import { capitalizeWords } from "@/utils/helper";

function AnnouncementDetailsPage({}) {
  const params = useParams();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const id = params.id
    ? Array.isArray(params.id)
      ? parseInt(params.id[0])
      : parseInt(params.id)
    : undefined;
  const { data: detail } = useAnnouncementDetailQuery(id, { enabled: isLoggedIn });
  const announcement = detail?.announcement;

  // Add hydration protection
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set hydrated state after component mounts
    setIsHydrated(true);
  }, []);

  // Don't render dynamic content until hydrated
  if (!isHydrated) {
    return (
      <MainLayout>
        <section className={"flex justify-between p-[20px]"}>
          <div className={"flex h-fit w-[800px] flex-col rounded-[12px] bg-white"}>
            <div className={"flex flex-col gap-[20px] p-[24px]"}>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>Event Owner:</p>
                </div>
                <div className={"flex gap-[4px]"}>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>Announcement ID:</p>
                </div>
                <p className={"text-[14px] font-medium"}>Loading...</p>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>Date Created:</p>
                </div>
                <div className={"flex gap-[4px]"}>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>Status:</p>
                </div>
                <p className={"text-[14px] font-medium text-light-green-70"}>Loading...</p>
              </div>
            </div>
          </div>
          <div className={"flex h-fit w-[780px] flex-col gap-[16px] rounded-[12px] bg-white"}>
            <div className={"flex items-center justify-between border-b-[1px] p-[24px]"}>
              <p className={"text-[16px] font-semiBold"}>Announcement</p>
              <div
                className={
                  "cursor-pointer rounded-[12px] border-[1px] border-light-grey-50 p-[10px] px-[14px]"
                }
              >
                <p className={"text-[14px] font-medium"}>Edit draft</p>
              </div>
            </div>
            <div className={"flex flex-col gap-[16px] p-[24px]"}>
              <div className={"flex flex-col"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Title</p>
                <p className={"text-[20px] font-semiBold"}>Loading...</p>
              </div>
              <div className={"flex flex-col"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Body</p>
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
      <section className={"flex justify-between p-[20px]"}>
        <div className={"flex h-fit w-[800px] flex-col rounded-[12px] bg-white"}>
          <div className={"flex flex-col gap-[20px] p-[24px]"}>
            <div className={"flex items-center gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Event Owner:</p>
              </div>
              <div className={"flex gap-[4px]"}>
                <p className={"text-[14px] font-medium"}>
                  {announcement?.created_by?.name || "N/A"}
                </p>
              </div>
            </div>
            <div className={"flex items-center gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Announcement ID:</p>
              </div>
              <p className={"text-[14px] font-medium"}>AN112332</p>
            </div>
            <div className={"flex items-center gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Date Created:</p>
              </div>
              <div className={"flex gap-[4px]"}>
                <p className={"text-[14px] font-medium"}>{announcement?.created_at || "N/A"}</p>
              </div>
            </div>
            <div className={"flex items-center gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Status:</p>
              </div>
              <p className={"text-[14px] font-medium text-light-green-70"}>
                {announcement?.status ? capitalizeWords(announcement.status) : "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div className={"flex h-fit w-[780px] flex-col gap-[16px] rounded-[12px] bg-white"}>
          <div className={"flex items-center justify-between border-b-[1px] p-[24px]"}>
            <p className={"text-[16px] font-semiBold"}>Announcement</p>
            <div
              className={
                "cursor-pointer rounded-[12px] border-[1px] border-light-grey-50 p-[10px] px-[14px]"
              }
            >
              <p className={"text-[14px] font-medium"}>Edit draft</p>
            </div>
          </div>
          <div className={"flex flex-col gap-[16px] p-[24px]"}>
            <div className={"flex flex-col"}>
              <p className={"text-[12px] font-medium text-text-grey"}>Title</p>
              <p className={"text-[20px] font-semiBold"}>
                {content?.title || "No title available"}
              </p>
            </div>
            <div className={"flex flex-col"}>
              <p className={"text-[12px] font-medium text-text-grey"}>Body</p>
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

export default AnnouncementDetailsPage;
