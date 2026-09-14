import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { TicketDetails } from "@/interfaces/EventInterface";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const TicketSummary = ({
  toggle,
  isOpen,
  quantities,
  subtotal,
  total,
  proceed,
}: {
  toggle: () => void;
  proceed: () => void;
  isOpen: boolean;
  quantities: any;
  subtotal: number;
  total: number;
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <motion.div
        className="w-[480px] rounded-tl-lg rounded-tr-lg bg-white p-6 shadow-lg"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[16px] font-bold">Summary</p>
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col gap-y-[50px] rounded-[12px] bg-white px-[10px] py-[12px]">
            <div>
              {quantities?.map(
                (quantity: TicketDetails, index: number) =>
                  quantity.quantity > 0 && (
                    <div className="mt-[16px] flex justify-between" key={index}>
                      <div>
                        <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom text-text-grey">
                          {quantity.quantity} {quantity.ticket_name}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-[14px] font-semibold leading-[21px] tracking-custom text-light-black">
                          {quantity.price * quantity.quantity === 0 ? (
                            <>₦ {quantity.price * quantity.quantity}</>
                          ) : (
                            <>₦ {formatNumberWithCommas(quantity.price * quantity.quantity)}</>
                          )}
                        </p>
                      </div>
                    </div>
                  ),
              )}
              <div className="my-4 border-t-[1px] border-grey-20"></div>
              <div className="mt-[16px] flex justify-between">
                <div>
                  <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom text-text-grey">
                    Subtotal
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[14px] font-semibold leading-[21px] tracking-custom text-light-black">
                    {subtotal === 0 ? <>₦ {subtotal}</> : <>₦ {formatNumberWithCommas(subtotal)}</>}
                  </p>
                </div>
              </div>
              <div className="mt-[24px] flex justify-between">
                <div>
                  <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom text-text-grey">
                    Fee
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[14px] font-semibold leading-[21px] tracking-custom text-light-black">
                    ₦ 2,000
                  </p>
                </div>
              </div>
              <div className="my-4 border-t-[1px] border-grey-20"></div>
              <div className="mt-[16px] flex justify-between">
                <div>
                  <p className="font-sans text-[18px] font-normal leading-[27px] tracking-custom text-text-grey">
                    Total
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[18px] font-semibold leading-[27px] tracking-custom text-light-black">
                    {total === 0 ? <>₦ {total}</> : <>₦ {formatNumberWithCommas(total)}</>}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[20px] flex items-center justify-between">
              <div className="flex items-center justify-center gap-[16px]">
                <div className="flex w-[147px] items-center gap-[16px]">
                  <p className="text-[20px] font-bold text-mid-green">
                    {total === 0 ? <>₦ {total}</> : <>₦ {formatNumberWithCommas(total)}</>}
                  </p>
                  <ChevronDown className="cursor-pointer text-mid-green" onClick={toggle} />
                </div>
                <Button className="h-[48px] w-[180px] rounded-[12px] border-b-[2px] bg-gradient-green px-[48px] py-[14px] shadow-none">
                  <p className="text-[16px] font-semi-normal">Assign ticket</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketSummary;
