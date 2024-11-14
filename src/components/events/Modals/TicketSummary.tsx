import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import {TicketDetails} from "@/interfaces/EventInterface";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {Button} from "@/components/ui/button";
import {ChevronDown} from "lucide-react";
import {motion} from "framer-motion"

const  TicketSummary = ({toggle, isOpen, quantities, subtotal, total, proceed}: {toggle: () => void, proceed: () => void, isOpen: boolean, quantities: any, subtotal: number, total: number}) => {
    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-end justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <motion.div
                className="bg-white rounded-tr-lg rounded-tl-lg shadow-lg w-[480px] p-6"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="flex justify-between items-center">
                    <p className="font-bold text-[16px]">Summary</p>
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="bg-white px-[10px] py-[12px] rounded-[12px] flex flex-col gap-y-[50px]">
                        <div>
                            {
                                quantities?.map((quantity: TicketDetails, index: number) => (
                                    quantity.quantity > 0 && (
                                        <div className="flex justify-between mt-[16px]" key={index}>
                                            <div>
                                                <p className="font-sans font-normal text-text-grey tracking-custom leading-[21px] text-[14px]">
                                                    {quantity.quantity} {quantity.ticket_name}</p>
                                            </div>
                                            <div>
                                                <p className="font-sans font-semibold text-light-black tracking-custom leading-[21px] text-[14px]">
                                                    {
                                                        quantity.price * quantity.quantity === 0 ? (
                                                            <>
                                                                ₦ {quantity.price * quantity.quantity}
                                                            </>
                                                        ) : (
                                                            <>
                                                                ₦ {formatNumberWithCommas(quantity.price * quantity.quantity)}
                                                            </>
                                                        )
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )
                                ))
                            }
                            <div className="border-t-[1px] border-grey-20 my-4"></div>
                            <div className="flex justify-between mt-[16px]">
                                <div>
                                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[21px] text-[14px]">Subtotal</p>
                                </div>
                                <div>
                                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[21px] text-[14px]">
                                        {
                                            subtotal === 0 ? (
                                                <>
                                                    ₦ {subtotal}
                                                </>
                                            ) : (
                                                <>
                                                    ₦ {formatNumberWithCommas(subtotal)}
                                                </>
                                            )
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-[24px]">
                                <div>
                                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[21px] text-[14px]">Fee</p>
                                </div>
                                <div>
                                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[21px] text-[14px]">₦
                                        2,000</p>
                                </div>
                            </div>
                            <div className="border-t-[1px] border-grey-20 my-4"></div>
                            <div className="flex justify-between mt-[16px]">
                                <div>
                                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[27px] text-[18px]">Total</p>
                                </div>
                                <div>
                                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[27px] text-[18px]">
                                        {
                                            total === 0 ? (
                                                <>
                                                    ₦ {total}
                                                </>
                                            ) : (
                                                <>
                                                    ₦ {formatNumberWithCommas(total)}
                                                </>
                                            )
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-[20px] items-center">
                            <div className="flex items-center justify-center gap-[16px]">
                                <div className="flex gap-[16px] items-center w-[147px]">
                                    <p className="text-[20px] font-bold text-mid-green">
                                        {
                                            total === 0 ? (
                                                <>
                                                    ₦ {total}
                                                </>
                                            ) : (
                                                <>
                                                    ₦ {formatNumberWithCommas(total)}
                                                </>
                                            )
                                        }
                                    </p>
                                    <ChevronDown className="text-mid-green cursor-pointer" onClick={toggle} />
                                </div>
                                <Button
                                    className="px-[48px] py-[14px] bg-gradient-green w-[180px] h-[48px] rounded-[12px] border-b-[2px] shadow-none">
                                    <p className="font-semi-normal text-[16px]">Assign ticket</p>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default TicketSummary;