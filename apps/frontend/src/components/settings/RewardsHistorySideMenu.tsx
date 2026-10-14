import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { useRewardsHistoryQuery } from "@/features/settings/queries";

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
    <>
      <div
        className={`bg-opacity-50 fixed top-0 right-0 z-50 h-full transform bg-gray-800 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="laptop:w-146.25 h-full w-screen bg-white pt-6">
          <div className="flex items-center justify-between px-6">
            <div>
              <p className="tracking-custom text-body-l font-sans font-semibold">Rewards History</p>
            </div>
            <div>
              <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>

          <div className="mt-4 flex flex-col px-6">
            {history.length === 0 ? (
              <p className="text-text-grey text-body-s pt-4 font-normal">No rewards earned yet.</p>
            ) : (
              history.map((entry, index) => (
                <div className="flex flex-col border-b pt-4 pb-6" key={index}>
                  <p className="font-semi-normal text-body-s">
                    N{formatNumberWithCommas(Number(entry.amount) || 0)}
                  </p>
                  <p className="text-text-grey text-meta leading-normal font-normal">
                    {entry.created_at}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className={`fixed inset-0 z-10 transition-all duration-300 ${
            isOpen ? "bg-opacity-50 bg-black backdrop-blur-sm" : "bg-transparent"
          }`}
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default RewardsHistorySideMenu;
