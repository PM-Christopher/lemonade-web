"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import PromotionsCard from "@/components/events/PromotionsCard";
import { listPromotions } from "@/data/tableData";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePromotionListQuery } from "@/features/events/queries";

// Off the initial bundle — only needed once "New promotion" is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const CreatePromotionModal = dynamic(
  () => import("@/modals/events/CreatePromotionModal"),
  {
    ssr: false,
  },
);

function AddPromotionsClient() {
  const [promotionModal, setPromotionModal] = useState(false);
  const [promotionId, setPromotionId] = useState(0);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: promotionData } = usePromotionListQuery({
    enabled: isLoggedIn,
  });

  const togglePromotionModal = () => {
    if (promotionId !== 0) {
      setPromotionId(0);
    }
    setPromotionModal(!promotionModal);
  };

  const storePromotionId = (promotionId: number) => {
    setPromotionId(promotionId);
  };

  return (
    <MainLayout>
      <section className="mt-[24px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"text-[16px] font-semiBold"}>
            {promotionData?.promotions?.length || 0} Promotions
          </p>
          <div className={"flex justify-between gap-[12px]"}>
            <div>
              <Button
                className={
                  "flex h-[40px] rounded-[12px] border-step-color bg-gradient-green"
                }
              >
                <PlusIcon className={"h-[15px] w-[15px] text-white"} />
                <p
                  className={"text-[16px] font-medium text-white"}
                  onClick={togglePromotionModal}
                >
                  Add promotion
                </p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"grid grid-cols-3 gap-[24px] px-[20px]"}>
          {promotionData?.promotions.map((promotion: any, index: number) => (
            <PromotionsCard
              promotion={promotion}
              key={index}
              promotionId={promotion?.id}
              setPromotionId={setPromotionId}
              toggle={togglePromotionModal}
            />
          ))}
        </div>
      </section>
      <CreatePromotionModal
        isOpen={promotionModal}
        toggle={togglePromotionModal}
        promotionId={promotionId}
      />
    </MainLayout>
  );
}

export default AddPromotionsClient;
