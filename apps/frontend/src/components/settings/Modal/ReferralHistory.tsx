import React, { useMemo } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRequest } from "@/hooks/useRequest";

type ReferralHistoryInterface = {
  toggle: () => void;
  isOpen: boolean;
};

interface ReferralEntry {
  amount?: number;
  type?: string;
}

interface ReferralHistoryData {
  referral_history?: ReferralEntry[];
}

const ReferralHistory: React.FC<ReferralHistoryInterface> = ({ isOpen, toggle }) => {
  const router = useRouter();
  const { data } = useRequest<ReferralHistoryData>(`/user/wallet/referral-history`);

  const { totalEarned, total_referrals, total_subscribed } = useMemo(() => {
    if (!data?.referral_history) return { totalEarned: 0, total_referrals: 0, total_subscribed: 0 };

    const totalEarned = data.referral_history.reduce(
      (acc: number, cur: ReferralEntry) => acc + (cur.amount || 0),
      0,
    );

    const total_referrals = data?.referral_history?.length;

    const total_subscribed = data?.referral_history?.filter(
      (ref: ReferralEntry) => ref?.type?.toLowerCase() === "subscription",
    )?.length;

    return { totalEarned, total_referrals, total_subscribed };
  }, [data]);

  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 items-center justify-center bg-gray-800 ${
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
        <div className="mt-6">
          <div className="border-mid-grey flex flex-col rounded-xl border-2 p-4">
            <div className="border-b-mid-grey flex flex-col border-b p-4">
              <p className="text-text-grey text-[14px] font-normal">Total Amount Earned</p>
              <p className="tracking-custom text-[18px] font-semibold">
                ₦{Number(totalEarned)?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="border-b-mid-grey flex flex-col border-b p-4">
              <p className="text-text-grey text-[14px] font-normal">Total referrals</p>
              <p className="tracking-custom text-[18px] font-semibold">{total_referrals ?? 0}</p>
            </div>
            <div className="border-b-mid-grey flex flex-col border-b p-4">
              <p className="text-text-grey text-[14px] font-normal">Total subscribed referrals</p>
              <p className="tracking-custom text-[18px] font-semibold">{total_subscribed ?? 0}</p>
            </div>
            <div
              className="flex cursor-pointer items-center gap-2 p-3 px-4"
              onClick={() => router.push("/settings/wallet")}
            >
              <p className="font-semi-normal text-light-green text-[16px]">Go to wallet</p>
              <ChevronRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralHistory;
