import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import {Label} from "@/components/ui/label";
import {formatStringUCFirst} from "@/lib/helper";
import {useRequest} from "@/hooks/useRequest";
import {useSelector} from "react-redux";
import CalendarIcon from "@/images/icons/eventCalendarIcon.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useAppDispatch} from "@/redux/hook";
import {filterEvent, resetFilter} from "@/features/events/event.slice";

type FilterEventInterface = {
    toggle: () => void,
    isOpen: boolean
}

const FilterEventModal = ({toggle, isOpen}: FilterEventInterface) => {
    const {authToken} = useSelector((state: any) => state.auth)
    const [clickedCategory , setClickedCategory] = useState("")
    const [timeOptions, setTimeOption] = useState(['This week', 'This Month'])
    const [timeType , setTimeType] = useState("")
    const dispatch = useAppDispatch();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [location, setLocation] = useState("");

    const handleLocationChange = (value: string) => {
        console.log("Selected Location:", value);
        setLocation(value);
    };

    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }
    const { data, loading } = useRequest(`/shared/utilities/event-categories`)

    const handleCategoryClick = (category: string) => {
        if (category === clickedCategory) {
            setClickedCategory("")
        } else {
            setClickedCategory(category)
        }
    }

    const handleTimeType = (selTimeType: string) => {
        if (selTimeType === timeType) {
            setTimeType("")
        } else {
            setTimeType(selTimeType)
        }
    }

    const handleFilterEvent = () => {
        const data = {
            category: clickedCategory,
            period: timeType,
            start_date: from,
            end_date: to,
            location: location,
        }
        dispatch(filterEvent({token: authToken, data})).then((res: any) => {
            toggle()
        })
    }

    const handleResetFilter = () => {
        dispatch(resetFilter())
        setClickedCategory("")
        setTo("")
        setFrom("")
        setTimeType("")
        setLocation("")
        toggle()
    }

    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                        <p>Event filter</p>
                    </div>
                </div>
                <div className="mt-[24px] flex flex-col">
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                            CATEGORY
                        </Label>
                        <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                                {
                                    loading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        data?.categories?.map((category: any, index: number) => (
                                            <div className={`w-fit rounded-[12px] p-[12px] px-[16px] cursor-pointer ${
                                                category?.name === clickedCategory ? 'bg-gradient-green-2 shadow-event-custom' : 'bg-light_grey'
                                            }`} key={index} onClick={() => handleCategoryClick(category?.name)}>
                                                <p className="font-normal text-[14px] text-text-grey">
                                                    {formatStringUCFirst(category?.name)}
                                                </p>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                            TIME & DATE
                        </Label>
                        <div className="mt-2">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {
                                        timeOptions?.map((option: string, index: number) => (
                                            <div className={`w-fit rounded-[12px] p-[12px] px-[16px] cursor-pointer ${
                                                option === timeType ? 'bg-gradient-green-2 shadow-event-custom' : 'bg-light_grey'
                                            }`} key={index} onClick={() => handleTimeType(option)}>
                                                <p className="font-normal text-[14px] text-text-grey">
                                                    {option}
                                                </p>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="flex justify-between items-center gap-[10px]">
                                    <div
                                        className="flex items-center gap-3 bg-light_grey px-[16px] h-[40px] rounded-[12px] w-full">
                                        <div>
                                            <CalendarIcon/>
                                        </div>
                                        <div className="w-full">
                                            <DatePicker
                                                selected={from ? new Date(from) : null}
                                                onChange={(date: Date | null) => {
                                                    if (date) {
                                                        // Update start date
                                                        setFrom(date.toISOString());
                                                        setTimeType("")
                                                    }
                                                }}
                                                showTimeSelect={false}
                                                dateFormat="yyyy-MM-dd"
                                                className="font-sans font-semi-normal text-[12px] shadow-none cursor-pointer w-full bg-light_grey px-[10px]"
                                                placeholderText="From"
                                            />
                                        </div>
                                    </div>
                                    <p>-</p>
                                    <div
                                        className="flex items-center gap-3 bg-light_grey px-[16px] h-[40px] rounded-[12px] w-full">
                                        <div>
                                            <CalendarIcon/>
                                        </div>
                                        <div className="w-full">
                                            <DatePicker
                                                selected={to ? new Date(to) : null}
                                                onChange={(date: Date | null) => {
                                                    if (date) {
                                                        // Update start date
                                                        setTo(date.toISOString());
                                                        setTimeType("")
                                                    }
                                                }}
                                                showTimeSelect={false}
                                                dateFormat="yyyy-MM-dd"
                                                className="font-sans font-semi-normal text-[12px] shadow-none cursor-pointer w-full bg-light_grey px-[10px]"
                                                placeholderText="To"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                            LOCATION
                        </Label>
                        <div className="mt-2">
                            <Select onValueChange={handleLocationChange}>
                                <SelectTrigger className="bg-mid-grey rounded-xl border-0 w-[180px] px-[16px] h-[40px]">
                                    <SelectValue
                                        placeholder={
                                            <span
                                                className="font-sans font-semibold text-[12px] leading-[14.4px] text-text-grey">Location</span>
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent className="form-font">
                                    <SelectItem value="all">All Locations</SelectItem>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="physical">Physical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="mt-[40px] flex gap-[4px]">
                        <button
                            className="w-full px-[14px] p-[10px] rounded-[12px] border-[1px] border-light-grey-50"
                            onClick={handleResetFilter}
                        >
                            <p className="font-sans font-semi-normal text-[16px] text-black-light">Reset filter</p>
                        </button>
                        <button
                            className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom"
                            onClick={handleFilterEvent}
                        >
                            <p className="font-sans font-semi-normal text-[16px] text-white">Apply filter</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilterEventModal;