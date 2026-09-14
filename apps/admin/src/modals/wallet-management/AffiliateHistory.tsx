import React from "react";
import { XIcon } from "lucide-react";
import { affiliateHistoryData } from "@/data/walletData";

type AffiliateHistoryInterface = {
  isOpen: boolean;
  toggle: () => void;
  data: any;
};

const AffiliateHistory: React.FC<AffiliateHistoryInterface> = ({ isOpen, toggle, data }) => {
  if (!isOpen) return null;
  return (
    <>
      <div
        className={
          "fixed inset-0 z-50 flex transform justify-end bg-gray-800 bg-opacity-50 transition-transform"
        }
        style={{
          display: "flex",
          justifyContent: "end",
          padding: "20px",
        }}
      >
        <div className="flex h-full flex-col rounded-[12px] bg-white" style={{ width: "585px" }}>
          <div
            className="flex items-center justify-between"
            style={{
              paddingTop: "24px",
              paddingBottom: "8px",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <div>
              <p className="tracking-custom font-sans text-[16px] font-semibold leading-[24px]">
                Affiliate history
              </p>
            </div>
            <div>
              <XIcon className="cursor-pointer" onClick={toggle} />
            </div>
          </div>
          <div className={"mt-[16px] flex flex-col px-[24px]"}>
            {affiliateHistoryData.map((item: any, index: number) => (
              <div className={"flex justify-between px-[16px] pb-[24px] pt-[16px]"} key={index}>
                <div className={"flex flex-col"}>
                  <p className={"text-[14px] font-medium"}>{item.amount}</p>
                  <p className={"text-[12px] font-normal text-text-grey"}>{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AffiliateHistory;
