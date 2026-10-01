import React from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { formatThousandSeparator } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useDeletePromotionMutation } from "@/features/events/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { Promotion } from "@/features/events/api";

function PromotionsCard({
  promotion,
  setPromotionId,
  toggle,
}: {
  promotion: Promotion;
  promotionId: number;
  setPromotionId: (promotionId: number) => void;
  toggle: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const deletePromotionMutation = useDeletePromotionMutation();

  const handleDeletePromotion = (id: number) => {
    if (isLoggedIn && id) {
      deletePromotionMutation.mutate(id, {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Promotion deleted successfully",
              type: "success",
            }),
          );
        },
      });
    }
  };

  const handleEditPromotion = (id: number) => {
    setPromotionId(id);
    toggle();
  };

  return (
    <div className={"flex flex-col gap-4 rounded-xl bg-white p-6"}>
      <div className={"flex justify-between"}>
        <p className={"font-semiBold text-[16px]"}>{promotion?.name}</p>
        <div className={"flex gap-1"}>
          <PencilIcon
            className={"cursor-pointer"}
            onClick={() => handleEditPromotion(promotion?.id)}
          />
          <TrashIcon
            className={"text-red-1 cursor-pointer"}
            onClick={() => handleDeletePromotion(promotion?.id)}
          />
        </div>
      </div>
      <p className={"font-semiBold text-[20px]"}>N{formatThousandSeparator(promotion?.price)}</p>
      <div className={"flex flex-col gap-2"}>
        {promotion?.breakdown?.map((item: string, index: number) => (
          <p key={index} className={"text-light-black text-[14px] font-normal"}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default PromotionsCard;
