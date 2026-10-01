import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { TicketDetails } from "@/interfaces/EventInterface";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { Button } from "@lemonade/ui";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const TicketSummary = ({
  toggle,
  isOpen,
  quantities,
  subtotal,
  total,
}: {
  toggle: () => void;
  proceed: () => void;
  isOpen: boolean;
  quantities: TicketDetails[];
  subtotal: number;
  total: number;
}) => {
  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-end justify-center bg-gray-800 ${isOpen ? "flex" : "hidden"}`}
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
        <div className="mt-6">
          <div className="flex flex-col gap-y-[50px] rounded-xl bg-white px-2.5 py-3">
            <div>
              {quantities?.map(
                (quantity: TicketDetails, index: number) =>
                  quantity.quantity > 0 && (
                    <div className="mt-4 flex justify-between" key={index}>
                      <div>
                        <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                          {quantity.quantity} {quantity.ticket_name}
                        </p>
                      </div>
                      <div>
                        <p className="tracking-custom text-light-black font-sans text-[14px] leading-[21px] font-semibold">
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
              <div className="border-grey-20 my-4 border-t"></div>
              <div className="mt-4 flex justify-between">
                <div>
                  <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                    Subtotal
                  </p>
                </div>
                <div>
                  <p className="tracking-custom text-light-black font-sans text-[14px] leading-[21px] font-semibold">
                    {subtotal === 0 ? <>₦ {subtotal}</> : <>₦ {formatNumberWithCommas(subtotal)}</>}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <div>
                  <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                    Fee
                  </p>
                </div>
                <div>
                  <p className="tracking-custom text-light-black font-sans text-[14px] leading-[21px] font-semibold">
                    ₦ 2,000
                  </p>
                </div>
              </div>
              <div className="border-grey-20 my-4 border-t"></div>
              <div className="mt-4 flex justify-between">
                <div>
                  <p className="tracking-custom text-text-grey font-sans text-[18px] leading-[27px] font-normal">
                    Total
                  </p>
                </div>
                <div>
                  <p className="tracking-custom text-light-black font-sans text-[18px] leading-[27px] font-semibold">
                    {total === 0 ? <>₦ {total}</> : <>₦ {formatNumberWithCommas(total)}</>}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center justify-center gap-4">
                <div className="flex w-[147px] items-center gap-4">
                  <p className="text-mid-green text-[20px] font-bold">
                    {total === 0 ? <>₦ {total}</> : <>₦ {formatNumberWithCommas(total)}</>}
                  </p>
                  <ChevronDown className="text-mid-green cursor-pointer" onClick={toggle} />
                </div>
                <Button className="bg-gradient-green h-12 w-[180px] rounded-xl border-b-2 px-12 py-3.5 shadow-none">
                  <p className="font-semi-normal text-[16px]">Assign ticket</p>
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
