import React from "react";
import { XIcon } from "lucide-react";
import { payoutHistoryData } from "@/data/walletData";

type PayoutHistoryInterface = {
  isOpen: boolean;
  toggle: () => void;
  data: any;
};

const PayoutHistory: React.FC<PayoutHistoryInterface> = ({ isOpen, toggle, data }) => {
  if (!isOpen) return null;

  const renderStyle = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-warning text-warning-bold";
      case "Successful":
        return "bg-light-green-60 text-light-green-70";
      case "Failed":
        return "bg-red-accent-1 text-red-1";
    }
  };

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
                Payout history
              </p>
            </div>
            <div>
              <XIcon className="cursor-pointer" onClick={toggle} />
            </div>
          </div>
          <div className={"mt-[16px] flex flex-col px-[24px]"}>
            {payoutHistoryData.map((item: any, index: number) => (
              <div key={index} className={"flex justify-between px-[16px] pb-[24px] pt-[16px]"}>
                <div className={"flex flex-col"}>
                  <p className={"text-[14px] font-medium"}>{item.amount}</p>
                  <p className={"text-[12px] font-normal text-text-grey"}>{item.date}</p>
                </div>
                <p
                  className={`h-fit rounded-[8px] px-[8px] py-[4px] text-[12px] font-medium ${renderStyle(item.status)}`}
                >
                  {item.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PayoutHistory;
