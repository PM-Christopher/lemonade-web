import React from 'react';
import ChevronRightIcon from "@/images/icons/chevronRight.svg";
import Link from "next/link";
import {GuestListCardProps} from "@/interfaces/EventInterface";
import {formatStringUCFirst} from "@/lib/helper";

type SideMenuInterface = {
    toggleMenu: () => void,
    isOpen: boolean,
    setSelectedGuest: (guest: any) => void;
}


const GuestListCard = ({guest, data}: { guest: GuestListCardProps, data: SideMenuInterface }) => {
    const handleSelectGuest = () => {
        data.setSelectedGuest(guest)
    }

    return (
        <div className="px-[24px] cursor-pointer" onClick={handleSelectGuest}>
            <div
                className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-[1px] hover:border-gray-300 hover:shadow-md">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="truncate text-[15px] font-semibold text-gray-900">
                            {guest?.name}
                        </p>

                        <span className="h-1 w-1 rounded-full bg-gray-300"/>

                        <p className="truncate text-[12px] font-medium text-gray-500">
                            {guest?.ticket_name}
                        </p>
                    </div>

                    <div className="mt-2">
                        <span
                            className={["inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold", guest?.checked_in
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                : "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
                            ].join(" ")}
                        >
                            <span
                                className={["h-1.5 w-1.5 rounded-full", guest?.checked_in ? "bg-emerald-500" : "bg-amber-500",].join(" ")}/>
                            {guest?.checked_in ? "Checked in" : "Not checked in"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ChevronRightIcon
                        className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-600"/>
                </div>
            </div>

        </div>
    );
};

export default GuestListCard;