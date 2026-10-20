import React from "react";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { useTribeHistoryQuery } from "@/features/settings/queries";
import HistorySideMenu, { formatHistoryDate } from "@/components/settings/HistorySideMenu";

type TribeHistorySideMenuInterface = {
  isOpen: boolean;
  toggleMenu: () => void;
};

// Each paid member who joined one of the user's tribes.
const TribeHistorySideMenu: React.FC<TribeHistorySideMenuInterface> = ({ isOpen, toggleMenu }) => {
  const { data } = useTribeHistoryQuery({ enabled: isOpen });
  const history = data?.tribe_history ?? [];

  return (
    <HistorySideMenu title="Tribe history" isOpen={isOpen} toggleMenu={toggleMenu}>
      {history.length === 0 ? (
        <p className="text-text-grey text-body-s pt-4 font-normal">No tribe earnings yet.</p>
      ) : (
        history.map((entry, index) => (
          <div className="flex flex-col border-b pt-4 pb-6" key={index}>
            <p className="font-semi-normal text-body-s">
              ₦{formatNumberWithCommas(Number(entry.amount) || 0)}
              {entry.member ? ` - @${entry.member}` : ""}
              {entry.tribe_name ? ` (${entry.tribe_name})` : ""}
            </p>
            <p className="text-text-grey text-meta leading-normal font-normal">
              {formatHistoryDate(entry.created)}
            </p>
          </div>
        ))
      )}
    </HistorySideMenu>
  );
};

export default TribeHistorySideMenu;
