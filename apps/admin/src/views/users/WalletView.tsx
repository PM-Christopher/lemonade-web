import React, { useRef, useEffect, MouseEvent } from "react";
import { CalendarIcon, ChevronDown, ChevronRight } from "lucide-react";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import UpdateBalance from "@/modals/wallet-management/UpdateBalance";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/features/user/queries";

const WalletView = ({ userDetail }: any) => {
  const params = useParams();

  const id = params.id
    ? Array.isArray(params.id)
      ? parseInt(params.id[0])
      : parseInt(params.id)
    : undefined;
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
            className="flex h-[44px] w-fit items-center justify-between gap-[8px] rounded-[12px] border-[1px] border-light-grey-50 bg-transparent px-[14px] py-[12px]"
          >
            <p className="text-[12px] font-semiBold text-black-light">Update balance</p>
            <ChevronDown className="w-[20px] text-black-light" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-[207px] rounded-[12px] bg-white shadow">
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
        <div className={"flex flex-col rounded-[12px] border-[1px] border-mid-grey p-[16px]"}>
          <div
            className={
              "flex cursor-pointer justify-between border-b-[1px] border-b-grey-20 p-[16px]"
            }
          >
            <div className={"flex flex-col gap-[8px]"}>
              <p className={"text-[14px] font-normal text-text-grey"}>Total Amount Earned</p>
              <p className={"text-[18px] font-semiBold text-black-light"}>
                ₦ {formatNumberWithCommas(userDetail?.total_amount || 0)}{" "}
              </p>
            </div>
            <ChevronRight className={"text-text-grey"} />
          </div>
          <div
            className={
              "flex cursor-pointer justify-between border-b-[1px] border-b-grey-20 p-[16px]"
            }
          >
            <div className={"flex flex-col gap-[8px]"}>
              <p className={"text-[14px] font-normal text-text-grey"}>Referral Earning</p>
              <p className={"text-[18px] font-semiBold text-black-light"}>
                ₦{formatNumberWithCommas(userDetail?.referral_earning || 0)}
              </p>
            </div>
            <ChevronRight className={"text-text-grey"} />
          </div>
          <div className={"flex cursor-pointer justify-between p-[16px]"}>
            <div className={"flex flex-col gap-[8px]"}>
              <p className={"text-[14px] font-normal text-text-grey"}>Affiliate Earning</p>
              <p className={"text-[18px] font-semiBold text-black-light"}>
                ₦{formatNumberWithCommas(userDetail.affiliate_earning || 0)}
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
        userDetails={userDetail}
        reload={reloadFunc}
        balance={userDetail?.total_amount}
      />
    </div>
  );
};

export default WalletView;
