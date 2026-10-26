import React, { useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatCount } from "@/lib/formatNumber";
import { naira } from "@/views/transactions/transactionFormat";
import UpdateBalance from "@/modals/wallet-management/UpdateBalance";
import TribeHistoryModal from "@/modals/users/TribeHistoryModal";
import PayoutHistoryModal from "@/modals/users/PayoutHistoryModal";
import ReferralHistory from "@/modals/wallet-management/ReferralHistory";
import AffiliateHistory from "@/modals/wallet-management/AffiliateHistory";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/features/user/queries";
import type { AccountInfoResponse } from "@/features/user/api";

const WalletView = ({ userDetail }: { userDetail: AccountInfoResponse | undefined }) => {
  const params = useParams();

  const id = params.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUpdateOpen, setIsUpdateOpen] = React.useState<boolean>(false);

  const [updateType, setUpdateType] = React.useState<string>("add");
  const [tribeHistoryOpen, setTribeHistoryOpen] = React.useState(false);
  const [payoutOpen, setPayoutOpen] = React.useState(false);
  const [referralOpen, setReferralOpen] = React.useState(false);
  const [affiliateOpen, setAffiliateOpen] = React.useState(false);

  const reloadFunc = () => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: userKeys.accountInfo(id, "wallet") });
    }
  };
  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: Event) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as EventListener);
    };
  }, []);

  const toggleUpdateBalance = () => {
    setIsUpdateOpen(!isUpdateOpen);
  };

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-6" ref={containerRef}>
        <div className="relative inline-block">
          <button
            onClick={handleToggleDropdown}
            className="border-light-grey-50 flex h-11 w-fit items-center justify-between gap-2 rounded-xl border bg-transparent px-3.5 py-3"
          >
            <p className="font-semiBold text-black-light text-meta leading-normal">
              Update balance
            </p>
            <ChevronDown className="text-black-light w-5" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-51.75 rounded-xl bg-white shadow">
              <ul>
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setUpdateType("add");
                    toggleUpdateBalance();
                  }}
                >
                  <p className={"text-body-l font-normal"}>Add to balance</p>
                </li>
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setUpdateType("deduct");
                    toggleUpdateBalance();
                  }}
                >
                  <p className={"text-body-l font-normal"}>Deduct from balance</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className={"flex flex-col p-6"}>
        <div className={"border-mid-grey flex flex-col rounded-xl border p-4"}>
          <button
            type="button"
            aria-label="View payout history"
            className={
              "border-b-grey-20 flex cursor-pointer justify-between border-b p-4 text-left"
            }
            onClick={() => setPayoutOpen(true)}
          >
            <div className={"flex flex-col gap-2"}>
              <p className={"text-text-grey text-body-s font-normal"}>Total Amount Earned</p>
              <p className={"font-semiBold text-black-light text-body-xl"}>
                {naira(userDetail?.total_amount)}
              </p>
            </div>
            <ChevronRight className={"text-text-grey"} />
          </button>
          <button
            type="button"
            aria-label="View referral history"
            className={
              "border-b-grey-20 flex cursor-pointer justify-between border-b p-4 text-left"
            }
            onClick={() => setReferralOpen(true)}
          >
            <div className={"flex flex-col gap-2"}>
              <p className={"text-text-grey text-body-s font-normal"}>Referral Earning</p>
              <p className={"font-semiBold text-black-light text-body-xl"}>
                {naira(userDetail?.referral_earning)}
              </p>
            </div>
            <ChevronRight className={"text-text-grey"} />
          </button>
          <button
            type="button"
            aria-label="View affiliate history"
            className={
              "border-b-grey-20 flex cursor-pointer justify-between border-b p-4 text-left"
            }
            onClick={() => setAffiliateOpen(true)}
          >
            <div className={"flex flex-col gap-2"}>
              <p className={"text-text-grey text-body-s font-normal"}>Affiliate Earning</p>
              <p className={"font-semiBold text-black-light text-body-xl"}>
                {naira(userDetail?.affiliate_earning)}
              </p>
            </div>
            <ChevronRight className={"text-text-grey"} />
          </button>
          <button
            type="button"
            className={"flex cursor-pointer justify-between p-4 text-left"}
            onClick={() => setTribeHistoryOpen(true)}
            aria-label="View tribe history"
          >
            <div className={"flex flex-col gap-2"}>
              <p className={"text-text-grey text-body-s font-normal"}>Monetized Tribes</p>
              <p className={"font-semiBold text-black-light text-body-xl"}>
                {formatCount(userDetail?.monetized_tribes)}
              </p>
            </div>
            <ChevronRight className={"text-text-grey"} />
          </button>
        </div>
      </div>

      <PayoutHistoryModal isOpen={payoutOpen} toggle={() => setPayoutOpen(false)} userId={id} />
      <ReferralHistory
        isOpen={referralOpen}
        toggle={() => setReferralOpen(false)}
        affiliateId={id ?? ""}
      />
      <AffiliateHistory
        isOpen={affiliateOpen}
        toggle={() => setAffiliateOpen(false)}
        affiliateId={id ?? ""}
      />
      <TribeHistoryModal
        isOpen={tribeHistoryOpen}
        toggle={() => setTribeHistoryOpen(false)}
        userId={id}
      />
      <UpdateBalance
        isOpen={isUpdateOpen}
        toggle={toggleUpdateBalance}
        updateType={updateType}
        userId={id}
        reload={reloadFunc}
        balance={userDetail?.wallet_balance}
      />
    </div>
  );
};

export default WalletView;
