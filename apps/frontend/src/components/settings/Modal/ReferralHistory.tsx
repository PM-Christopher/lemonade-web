import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { ChevronRight } from "lucide-react";

import type { ReferralActivity } from "@/features/settings/api";
import { formatNumberWithCommas } from "@/lib/formatNumber";

type ReferralHistoryInterface = {
  toggle: () => void;
  isOpen: boolean;
  activity: ReferralActivity | undefined;
};

// Shows the server-computed referral totals.
const ReferralHistory: React.FC<ReferralHistoryInterface> = ({ isOpen, toggle, activity }) => {
  const { push } = useNavigation();

  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 items-center justify-center bg-gray-800 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="w-160 rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon className="w-2.75" />
            </div>
            <p className="text-body-l font-semibold">Referral activity</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="border-mid-grey flex flex-col rounded-xl border-2 p-4">
            <div className="border-b-mid-grey flex flex-col border-b p-4">
              <p className="text-text-grey text-body-s font-normal">Total Amount Earned</p>
              <p className="tracking-custom text-body-xl font-semibold">
                ₦{formatNumberWithCommas(Number(activity?.total_amount_earned) || 0)}
              </p>
            </div>
            <div className="border-b-mid-grey flex flex-col border-b p-4">
              <p className="text-text-grey text-body-s font-normal">Total referrals</p>
              <p className="tracking-custom text-body-xl font-semibold">
                {activity?.total_referrals ?? 0}
              </p>
            </div>
            <div className="border-b-mid-grey flex flex-col border-b p-4">
              <p className="text-text-grey text-body-s font-normal">Total subscribed referrals</p>
              <p className="tracking-custom text-body-xl font-semibold">
                {activity?.total_subscribed_referrals ?? 0}
              </p>
            </div>
            <div
              className="flex cursor-pointer items-center gap-2 p-3 px-4"
              onClick={() => push(routes.SETTINGS_WALLET)}
            >
              <p className="font-semi-normal text-light-green text-body-l">Go to wallet</p>
              <ChevronRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralHistory;
