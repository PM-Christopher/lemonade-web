"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { PlusIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import PromotionsCard from "@/components/events/PromotionsCard";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePromotionListQuery } from "@/features/events/queries";
import type { Promotion } from "@/features/events/api";

// Off the initial bundle — only needed once "New promotion" is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const CreatePromotionModal = dynamic(() => import("@/modals/events/CreatePromotionModal"), {
  ssr: false,
});

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

  return (
    <MainLayout>
      <section className="mt-6 flex flex-col gap-5">
        <div className={"flex justify-between px-5"}>
          <p className={"font-semiBold text-[16px]"}>
            {promotionData?.promotions?.length || 0} Promotions
          </p>
          <div className={"flex justify-between gap-3"}>
            <div>
              <Button className={"border-step-color bg-gradient-green flex h-10 rounded-xl"}>
                <PlusIcon className={"h-[15px] w-[15px] text-white"} />
                <p className={"text-[16px] font-medium text-white"} onClick={togglePromotionModal}>
                  Add promotion
                </p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"grid grid-cols-3 gap-6 px-5"}>
          {promotionData?.promotions.map((promotion: Promotion, index: number) => (
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
