import React from "react";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { useRewardsHistoryQuery } from "@/features/settings/queries";
import HistorySideMenu, { formatHistoryDate } from "@/components/settings/HistorySideMenu";

type RewardsHistorySideMenuInterface = {
  isOpen: boolean;
  toggleMenu: () => void;
};

const RewardsHistorySideMenu: React.FC<RewardsHistorySideMenuInterface> = ({
  isOpen,
  toggleMenu,
}) => {
  const { data } = useRewardsHistoryQuery({ enabled: isOpen });
  const history = data?.affiliate_history ?? [];

  return (
    <HistorySideMenu title="Rewards History" isOpen={isOpen} toggleMenu={toggleMenu}>
      {history.length === 0 ? (
        <p className="text-text-grey text-body-s pt-4 font-normal">No rewards earned yet.</p>
      ) : (
        history.map((entry, index) => (
          <div className="flex flex-col border-b pt-4 pb-6" key={index}>
            <p className="font-semi-normal text-body-s">
              ₦{formatNumberWithCommas(Number(entry.amount) || 0)}
            </p>
            <p className="text-text-grey text-meta leading-normal font-normal">
              {formatHistoryDate(entry.created_at)}
            </p>
          </div>
        ))
      )}
    </HistorySideMenu>
  );
};

export default RewardsHistorySideMenu;
