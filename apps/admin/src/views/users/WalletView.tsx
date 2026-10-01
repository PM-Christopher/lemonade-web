import React, { useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import UpdateBalance from "@/modals/wallet-management/UpdateBalance";
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
      <div className="px-[24px] pt-[24px]" ref={containerRef}>
        <div className="relative inline-block">
          <button
            onClick={handleToggleDropdown}
            className="border-light-grey-50 flex h-[44px] w-fit items-center justify-between gap-[8px] rounded-[12px] border-[1px] bg-transparent px-[14px] py-[12px]"
          >
            <p className="font-semiBold text-black-light text-[12px]">Update balance</p>
            <ChevronDown className="text-black-light w-[20px]" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-[207px] rounded-[12px] bg-white shadow">
              <ul>
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setUpdateType("add");
                    toggleUpdateBalance();
                  }}
                >
                  <p className={"text-[16px] font-normal"}>Add to balance</p>
                </li>
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setUpdateType("deduct");
                    toggleUpdateBalance();
                  }}
                >
                  <p className={"text-[16px] font-normal"}>Deduct from balance</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className={"flex flex-col p-[24px]"}>
        <div className={"border-mid-grey flex flex-col rounded-[12px] border-[1px] p-[16px]"}>
          <div
            className={
              "border-b-grey-20 flex cursor-pointer justify-between border-b-[1px] p-[16px]"
            }
          >
            <div className={"flex flex-col gap-[8px]"}>
              <p className={"text-text-grey text-[14px] font-normal"}>Total Amount Earned</p>
              <p className={"font-semiBold text-black-light text-[18px]"}>
                ₦ {formatNumberWithCommas(userDetail?.total_amount || 0)}{" "}
              </p>
            </div>
            <ChevronRight className={"text-text-grey"} />
          </div>
          <div
            className={
              "border-b-grey-20 flex cursor-pointer justify-between border-b-[1px] p-[16px]"
            }
          >
            <div className={"flex flex-col gap-[8px]"}>
              <p className={"text-text-grey text-[14px] font-normal"}>Referral Earning</p>
              <p className={"font-semiBold text-black-light text-[18px]"}>
                ₦{formatNumberWithCommas(userDetail?.referral_earning || 0)}
              </p>
            </div>
            <ChevronRight className={"text-text-grey"} />
          </div>
          <div className={"flex cursor-pointer justify-between p-[16px]"}>
            <div className={"flex flex-col gap-[8px]"}>
              <p className={"text-text-grey text-[14px] font-normal"}>Affiliate Earning</p>
              <p className={"font-semiBold text-black-light text-[18px]"}>
                ₦{formatNumberWithCommas(userDetail?.affiliate_earning || 0)}
              </p>
            </div>
            <ChevronRight className={"text-text-grey"} />
          </div>
        </div>
      </div>

      <UpdateBalance
        isOpen={isUpdateOpen}
        toggle={toggleUpdateBalance}
        updateType={updateType}
        reload={reloadFunc}
        balance={userDetail?.total_amount}
      />
    </div>
  );
};

export default WalletView;
