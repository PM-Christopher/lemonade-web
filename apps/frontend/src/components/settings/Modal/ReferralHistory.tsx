import React, { useMemo } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRequest } from "@/hooks/useRequest";

type ReferralHistoryInterface = {
  toggle: () => void;
  isOpen: boolean;
};

const ReferralHistory: React.FC<ReferralHistoryInterface> = ({ isOpen, toggle }) => {
  const router = useRouter();
  const { data } = useRequest(`/user/wallet/referral-history`);

  const { totalEarned, total_referrals, total_subscribed } = useMemo(() => {
    if (!data?.referral_history) return { totalEarned: 0, total_referrals: 0, total_subscribed: 0 };

    const totalEarned = data.referral_history.reduce(
      (acc: any, cur: any) => acc + (cur.amount || 0),
      0,
    );

    const total_referrals = data?.referral_history?.length;

    const total_subscribed = data?.referral_history?.filter(
      (ref: any) => ref?.type?.toLowerCase() === "subscription",
    )?.length;

    return { totalEarned, total_referrals, total_subscribed };
  }, [data]);

  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="w-[640px] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon className="w-[11.25px]" />
            </div>
            <p className="text-[16px] font-semibold">Referral activity</p>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col rounded-[12px] border-[2px] border-mid-grey p-[16px]">
            <div className="flex flex-col border-b-[1px] border-b-mid-grey p-[16px]">
              <p className="text-[14px] font-normal text-text-grey">Total Amount Earned</p>
              <p className="text-[18px] font-semibold tracking-custom">
                ₦{Number(totalEarned)?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="flex flex-col border-b-[1px] border-b-mid-grey p-[16px]">
              <p className="text-[14px] font-normal text-text-grey">Total referrals</p>
              <p className="text-[18px] font-semibold tracking-custom">{total_referrals ?? 0}</p>
            </div>
            <div className="flex flex-col border-b-[1px] border-b-mid-grey p-[16px]">
              <p className="text-[14px] font-normal text-text-grey">Total subscribed referrals</p>
              <p className="text-[18px] font-semibold tracking-custom">{total_subscribed ?? 0}</p>
            </div>
            <div
              className="flex cursor-pointer items-center gap-[8px] p-[12px] px-[16px]"
              onClick={() => router.push("/settings/wallet")}
            >
              <p className="text-[16px] font-semi-normal text-light-green">Go to wallet</p>
              <ChevronRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralHistory;
