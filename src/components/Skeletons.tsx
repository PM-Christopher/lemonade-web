import Image from "next/image";
import React from "react";

export const TribesSkeleton = ({count}: { count: number }) => {
    return (
        <div className="flex overflow-x-auto mt-3 space-x-2 scrollbar-hide py-4 shadow-none">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col bg-light-yellow p-3 sm:p-4 rounded-2xl w-[422px] shadow-none h-[180px] sm:h-[200px] animate-pulse flex-shrink-0"
                >
                    {/* Image placeholder */}
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-300"/>
                    </div>

                    {/* Text placeholders */}
                    <div className="mt-2 flex justify-between flex-1">
                        <div className="flex-1 min-w-0">
                            <div className="h-2.5 sm:h-3 bg-gray-300 rounded w-1/2 mb-2"/>
                            <div className="h-2.5 sm:h-3 bg-gray-300 rounded w-3/4"/>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"/>
                        </div>
                    </div>

                    {/* Footer placeholders */}
                    <div className="mt-auto pt-2 flex justify-between">
                        <div className="flex gap-1.5 sm:gap-2">
                            <div className="flex items-center gap-1">
                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-300 rounded"/>
                                <div className="w-5 h-2.5 sm:w-6 sm:h-3 bg-gray-300 rounded"/>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-300 rounded"/>
                                <div className="w-5 h-2.5 sm:w-6 sm:h-3 bg-gray-300 rounded"/>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-8 h-2.5 sm:w-10 sm:h-3 bg-gray-300 rounded"/>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-300 rounded"/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export const TribeDetailsSkeleton = () => {
    return (
        <div className="flex flex-col gap-2 p-4 py-4 bg-white w-[496px] h-fit rounded-[12px] animate-pulse">
            {/* Header */}
            <div>
                <p className="font-sans font-semibold text-[16px] leading-[24px]">Tribe details</p>
            </div>

            {/* Tribe Image */}
            <div className="flex justify-center mt-10">
                <div className="w-[96px] h-[96px] bg-gray-200 rounded-[24px]"></div>
            </div>

            {/* Tribe Info */}
            <div className="flex flex-col items-center gap-2 mt-4">
                <div className="w-[150px] h-6 bg-gray-200 rounded"></div>
                <div className="w-[100px] h-4 bg-gray-200 rounded"></div>

                {/* Members & Threads */}
                <div className="flex gap-1 justify-center items-center mt-1">
                    <div className="w-[80px] h-3 bg-gray-200 rounded"></div>
                    <div className="w-[60px] h-3 bg-gray-200 rounded"></div>
                </div>

                {/* Tribe Description */}
                <div className="flex flex-col items-center w-[311px] mt-4 gap-2">
                    <div className="w-full h-20 bg-gray-200 rounded"></div>
                    <div className="w-[180px] h-4 bg-gray-200 rounded"></div>
                </div>

                {/* Actions (Share / Add Member) */}
                <div className="flex gap-[16px] mt-4">
                    {/* Share */}
                    <div className="flex flex-col items-center gap-2">
                        <div
                            className="bg-light_grey p-[24px] rounded-[16px] w-[64px] h-[64px] flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="w-[60px] h-4 bg-gray-200 rounded"></div>
                    </div>

                    {/* Add member */}
                    <div className="flex flex-col items-center gap-2">
                        <div
                            className="bg-light_grey p-[24px] rounded-[16px] w-[64px] h-[64px] flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="w-[60px] h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Button */}
            <div className="flex justify-center my-2">
                <div className="w-[200px] h-[60px] bg-gray-200 rounded-[37px]"></div>
            </div>

            {/* Monetized Section */}
            <div className="flex justify-between items-center my-4">
                <div className="flex flex-col gap-1">
                    <div className="w-[120px] h-4 bg-gray-200 rounded"></div>
                    <div className="w-[180px] h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-[60px] h-4 bg-gray-200 rounded"></div>
            </div>

            {/* Members List */}
            <div className="flex flex-col p-3 bg-light_grey rounded-[12px] gap-4">
                <div className="w-[80px] h-4 bg-gray-200 rounded"></div>
                {Array.from({length: 4}).map((_, index) => (
                    <div key={index} className="flex justify-between items-center gap-2">
                        <div className="flex gap-2 items-center">
                            <div className="w-[20px] h-[20px] bg-gray-200 rounded-[6px]"></div>
                            <div className="w-[80px] h-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-[20px] h-4 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const SubscriptionsSkeleton = ({count, dataList}: { count: number, dataList: number }) => {
    return (
        <>
            {Array.from({length: count}).map((_, i) => (
                <div className="flex flex-col items-center animate-pulse" key={i}>
                    {/* Header Section */}
                    <div className="w-[260px] pt-[16px] px-[48px] rounded-tl-[16px] rounded-tr-[16px] bg-grey-20">
                        <div className="h-[24px] w-[120px] bg-light-grey-70 rounded-md mx-auto mb-2"></div>
                        <div className="h-[20px] w-[100px] bg-light-grey-70 rounded-md mx-auto"></div>
                    </div>

                    {/* Card Section */}
                    <div className="w-[311px] rounded-[12px] border-[2px] border-light-grey-60 mt-1">
                        <div className="rounded-tl-[12px] rounded-tr-[12px] bg-grey-20 p-[12px]">
                            <div className="h-[20px] w-[140px] bg-light-grey-70 rounded-md"></div>
                        </div>

                        <div className="bg-white p-4 flex flex-col rounded-bl-[12px] rounded-br-[12px] gap-[20px]">
                            {Array.from({length: dataList}).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex gap-2 items-center">
                                        <div className="h-[20px] w-[20px] bg-light-grey-70 rounded-md"></div>
                                        <div className="h-[14px] w-[120px] bg-light-grey-70 rounded-md"></div>
                                    </div>
                                    <div className="h-[14px] w-[40px] bg-light-grey-70 rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Button Section */}
                    <div className="h-[48px] w-[250px] bg-light-grey-70 rounded-[12px] mt-[56px]"></div>
                </div>
            ))}
        </>
    )
}

export const TribeListSkeleton = ({count}: { count: number }) => {
    return (
        <div className="space-y-3 animate-pulse">
            {Array.from({length: count}).map((_, i) => (
                <div
                    key={i}
                    className="bg-mid-grey rounded-[16px] mb-2 border-[1px] border-grey-30 overflow-hidden"
                >
                    {/* Top Section */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-[16px]">
                        <div className="flex gap-2 items-center">
                            {/* Tribe Image */}
                            <div className="w-[40px] h-[40px] bg-gray-200 rounded-full"></div>

                            {/* Tribe Info */}
                            <div className="flex flex-col gap-1">
                                <div className="w-[100px] h-[12px] bg-gray-200 rounded"></div>
                                <div className="w-[140px] h-[10px] bg-gray-100 rounded"></div>
                            </div>
                        </div>

                        {/* Join Button */}
                        <div
                            className="flex items-center gap-1 border-[1px] px-[16px] p-[6px] rounded-[12px] border-gray-200">
                            <div className="w-[40px] h-[10px] bg-gray-200 rounded"></div>
                            <div className="w-[16px] h-[16px] bg-gray-100 rounded-full"></div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex justify-between items-center p-4 bg-mid-grey rounded-b-[16px] py-6">
                        <div className="w-[60px] h-[10px] bg-gray-200 rounded"></div>
                        <div className="w-[80px] h-[10px] bg-gray-200 rounded"></div>
                        <div className="flex gap-2 items-center">
                            <div className="w-[16px] h-[16px] bg-gray-200 rounded"></div>
                            <div className="w-[70px] h-[10px] bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export const ThreadsSkeleton = ({count}: { count: number }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div className="p-4 py-4 w-full h-full grid gap-[50px] animate-pulse" key={i}>
                    {/* Header Section */}
                    <div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                {/* Avatar */}
                                <div
                                    className="w-[48px] h-[48px] rounded-[16px] bg-gray-200 border border-gray-300"></div>

                                {/* Username */}
                                <div className="w-[80px] h-[12px] bg-gray-200 rounded"></div>

                                {/* Verified Icon Placeholder */}
                                <div className="w-[13px] h-[13px] bg-gray-200 rounded-full"></div>

                                {/* Dot */}
                                <div className="w-[3px] h-[3px] bg-gray-300 rounded-full"></div>

                                {/* Date */}
                                <div className="w-[60px] h-[10px] bg-gray-200 rounded"></div>
                            </div>

                            {/* More Icon */}
                            <div className="w-[20px] h-[20px] bg-gray-200 rounded-full"></div>
                        </div>

                        {/* Topic */}
                        <div className="mt-[8px] w-[60%] h-[14px] bg-gray-200 rounded"></div>

                        {/* Thoughts */}
                        <div className="mt-[20px] space-y-2">
                            <div className="w-full h-[12px] bg-gray-200 rounded"></div>
                            <div className="w-[90%] h-[12px] bg-gray-200 rounded"></div>
                            <div className="w-[80%] h-[12px] bg-gray-200 rounded"></div>
                        </div>

                        {/* Media Carousel Placeholder */}
                        <div className="mt-4 w-full h-[180px] bg-gray-200 rounded-[12px]"></div>

                        {/* Poll Section */}
                        <div className="flex flex-col gap-3 mt-6">
                            <div className="w-[120px] h-[16px] bg-gray-200 rounded"></div>
                            {Array.from({length: 3}).map((_, i) => (
                                <div key={i}
                                     className="relative w-full h-[40px] bg-gray-200 rounded-[8px] overflow-hidden"></div>
                            ))}
                            <div className="w-[80px] h-[10px] bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* Like / Comment Buttons */}
                    <div className="flex gap-4 mt-2">
                        <div className="rounded-[12px] bg-gray-200 w-[64px] h-[30px]"></div>
                        <div className="rounded-[12px] bg-gray-200 w-[64px] h-[30px]"></div>
                    </div>

                    {/* Comments Section Placeholder */}
                    <div className="mt-4 space-y-4">
                        {Array.from({length: 2}).map((_, i) => (
                            <div key={i} className="flex gap-2">
                                <div className="w-[32px] h-[32px] bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="w-[40%] h-[10px] bg-gray-200 rounded"></div>
                                    <div className="w-[80%] h-[10px] bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="w-full border-b border-gray-200 mt-4"></div>
                </div>
            ))}
        </>
    )
}

export const EventsSkeleton = ({count}: { count: number }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col h-[280px] w-full sm:w-[200px] rounded-2xl overflow-hidden shadow-sm animate-pulse"
                >
                    {/* Image placeholder */}
                    <div className="flex-shrink-0 h-[200px] bg-gray-300 rounded-t-2xl"/>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between p-3">
                        {/* Title placeholder */}
                        <div className="mb-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"/>
                            <div className="h-4 bg-gray-300 rounded w-1/2"/>
                        </div>

                        {/* Date & time placeholders */}
                        <div className="flex items-center gap-1 mt-auto">
                            <div className="w-4 h-4 bg-gray-300 rounded"/>
                            <div className="w-16 h-3 bg-gray-300 rounded"/>
                            <div className="w-[3px] h-[3px] bg-gray-300 rounded-full"/>
                            <div className="w-10 h-3 bg-gray-300 rounded"/>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export const EventDetailsSkeleton = () => {
    return (
        <section className="mt-4 flex flex-col items-center animate-pulse">
            {/* Main Container */}
            <div className="flex justify-center w-full">
                <div
                    className="flex flex-col laptop:flex-row items-start laptop:items-center gap-10 w-full laptop:max-w-[1100px] bg-white rounded-2xl overflow-hidden shadow-sm p-[20px]">

                    {/* Image Skeleton */}
                    <div className="w-full laptop:w-[480px] h-[320px] bg-gray-200 rounded-2xl"></div>

                    {/* Event Details Skeleton */}
                    <div className="flex flex-col justify-between px-6 py-6 laptop:px-10 laptop:py-8 w-full space-y-5">
                        {/* Title */}
                        <div className="w-[70%] h-8 bg-gray-200 rounded"></div>

                        {/* Date */}
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                            <div className="w-[180px] h-4 bg-gray-200 rounded"></div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                            <div className="w-[160px] h-4 bg-gray-200 rounded"></div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                            <div className="w-[140px] h-4 bg-gray-200 rounded"></div>
                        </div>

                        {/* Contact Us */}
                        <div className="hidden laptop:flex flex-col space-y-3">
                            <div className="w-[100px] h-5 bg-gray-200 rounded"></div>
                            <div className="flex items-center gap-4">
                                {Array.from({length: 5}).map((_, i) => (
                                    <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-10 hidden laptop:flex">
                            <div className="w-[231px] h-[56px] bg-gray-200 rounded-[12px]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="w-full mt-[40px] laptop:max-w-[1100px]">
                <div className="w-[150px] h-6 bg-gray-200 rounded mb-4"></div>
                <div className="w-full h-[120px] bg-gray-200 rounded-xl"></div>

                {/* Mobile Contact & CTA */}
                <div className="block laptop:hidden mt-[40px] space-y-4">
                    <div className="w-[100px] h-5 bg-gray-200 rounded"></div>

                    <div className="flex items-center gap-[16px]">
                        {Array.from({length: 5}).map((_, i) => (
                            <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        ))}
                    </div>

                    <div className="mt-[20px]">
                        <div className="w-[231px] h-[56px] bg-gray-200 rounded-[12px]"></div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export const EventTicketDetailSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6">
            {/* Event Header Skeleton */}
            <div className="bg-green-tint flex gap-4 p-3 px-4 rounded-[8px]">
                {/* Event Image Skeleton */}
                <div className="w-[72px] h-[72px] laptop:w-[120px] laptop:h-[120px] bg-gray-200 rounded-[12px]"></div>

                {/* Event Info Skeleton */}
                <div className="flex flex-col gap-2 flex-1">
                    {/* Event Name */}
                    <div className="w-[200px] h-5 laptop:w-[300px] laptop:h-6 bg-gray-200 rounded"></div>

                    {/* Date */}
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        <div className="w-[80px] h-3 bg-gray-200 rounded"></div>
                        <div className="w-3 h-3 bg-gray-200 rounded"></div>
                        <div className="w-[80px] h-3 bg-gray-200 rounded"></div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        <div className="w-[60px] h-3 bg-gray-200 rounded"></div>
                        <div className="w-3 h-3 bg-gray-200 rounded"></div>
                        <div className="w-[60px] h-3 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Tickets Skeleton */}
            {Array.from({length: 3}).map((_, index) => (
                <div key={index} className="px-4">
                    <div className="flex justify-between mt-6 items-center">
                        <div className="flex flex-col gap-2">
                            <div className="w-[120px] h-4 bg-gray-200 rounded"></div>
                            <div className="w-[60px] h-5 bg-gray-200 rounded"></div>
                            <div className="w-[160px] h-3 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="w-6 h-6 bg-gray-200 rounded-[8px]"></div>
                            <div className="w-7 h-7 bg-gray-200 rounded-[8px]"></div>
                            <div className="w-6 h-6 bg-gray-200 rounded-[8px]"></div>
                        </div>
                    </div>
                    <div className="border-t-[1px] border-gray-200 my-2"></div>
                </div>
            ))}
        </div>

    )
}

export const EventProgramDetailSkeleton = () => {
    return (
        <div className="mt-4 flex flex-col items-center animate-pulse">
            <div className="flex justify-between gap-[24px]">
                {/* Left Column */}
                <div>
                    <div className="w-[640px] p-[24px] rounded-[12px] bg-white flex flex-col">
                        {/* Event Card Skeleton */}
                        <div className="bg-green-tint p-[8px] px-[16px] rounded-[8px] flex gap-3 items-center">
                            <div className="w-[120px] h-[120px] bg-gray-200 rounded-[8px]"></div>
                            <div className="flex flex-col gap-2 w-full">
                                <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
                                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                                <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                                <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center items-center mt-[24px] gap-8">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-[8px]">
                                    <div
                                        className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-gray-100 w-[48px] h-[48px]"></div>
                                    <div className="w-12 h-3 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>

                        {/* Guest List */}
                        <div
                            className="flex justify-between items-center p-[12px] px-[16px] border-[2px] rounded-[12px] border-mid-grey mt-[24px]">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                            </div>
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        </div>

                        {/* Breakdown Boxes */}
                        <div
                            className="flex flex-col p-[16px] border-[2px] rounded-[12px] border-mid-grey mt-[24px] gap-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i}>
                                    <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-32 h-5 bg-gray-200 rounded"></div>
                                    {i < 2 && <div className="border-t-[1px] border-t-grey-20 my-4"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="w-[480px] bg-white p-[16px] rounded-[8px] flex flex-col">
                            <div className="w-1/2 h-5 bg-gray-200 rounded mb-4"></div>
                            {[1, 2, 3].map((_, j) => (
                                <div key={j} className="mt-[16px]">
                                    <div className="w-1/3 h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="flex justify-between mt-[2px]">
                                        <div className="w-20 h-5 bg-gray-200 rounded"></div>
                                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]"></div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}

export const GuestListSkeleton = ({count}: { count: 4 }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div className="p-4 flex justify-between pb-[16px] border-b-2 border-b-grey-20 animate-pulse" key={i}>
                    <div className="flex gap-[8px]">
                        <div className="flex flex-col gap-[6px]">
                            <div className="h-[14px] w-[120px] bg-grey-20 rounded-md"></div>
                            <div className="h-[12px] w-[60px] bg-grey-20 rounded-md"></div>
                        </div>
                    </div>
                    <div className="w-[16px] h-[16px] bg-grey-20 rounded-md"></div>
                </div>
            ))}
        </>
    )
}

export const TransactionHistorySkeleton = ({count}: { count: 4 }) => {
    return (
        <div className="px-[24px] animate-pulse">
            {[...Array(count)].map((_, index) => (
                <div
                    key={index}
                    className="pt-[16px] pb-[24px] flex justify-between items-center"
                >
                    {/* Left side: Amount + message */}
                    <div className="flex flex-col gap-2 w-[60%]">
                        <div className="h-[16px] w-[120px] bg-light-grey-70 rounded-md"></div>
                        <div className="h-[12px] w-[80px] bg-light-grey-70 rounded-md"></div>
                    </div>

                    {/* Right side: Status badge */}
                    <div className="h-[20px] w-[80px] bg-light-grey-70 rounded-[8px]"></div>
                </div>
            ))}
        </div>
    )
}

export const WalletDetailSkeleton = () => {
    return (
        <div className="flex flex-col w-full laptop:w-[580px] animate-pulse gap-4">
            {/* Earnings Card */}
            <div className="rounded-[12px] p-[16px] flex flex-col bg-white gap-4">
                {/* Total Amount Earned */}
                <div className="flex flex-col p-[16px] border-b-[1px] border-b-mid-grey gap-2">
                    <div className="h-[14px] w-[140px] bg-light-grey-70 rounded-md"></div>
                    <div className="h-[20px] w-[100px] bg-light-grey-70 rounded-md"></div>
                </div>

                {/* Referral Earnings */}
                <div className="flex justify-between p-[16px] border-b-[1px] border-b-mid-grey items-center">
                    <div className="flex flex-col gap-2">
                        <div className="h-[14px] w-[120px] bg-light-grey-70 rounded-md"></div>
                        <div className="h-[20px] w-[80px] bg-light-grey-70 rounded-md"></div>
                    </div>
                    <div className="h-[24px] w-[24px] bg-light-grey-70 rounded-full"></div>
                </div>

                {/* Affiliate Earnings */}
                <div className="flex justify-between p-[16px] items-center">
                    <div className="flex flex-col gap-2">
                        <div className="h-[14px] w-[120px] bg-light-grey-70 rounded-md"></div>
                        <div className="h-[20px] w-[80px] bg-light-grey-70 rounded-md"></div>
                    </div>
                    <div className="h-[24px] w-[24px] bg-light-grey-70 rounded-full"></div>
                </div>
            </div>

            {/* Payout Request */}
            <div className="rounded-[12px] p-[16px] flex flex-col bg-light-tint gap-4">
                <div className="h-[14px] w-[80%] bg-light-grey-70 rounded-md"></div>
                <div className="h-[48px] w-[200px] bg-light-grey-70 rounded-[12px]"></div>
            </div>
        </div>
    )
}

export const GuestDetailSkeleton = () => {
    return (
        <div className="flex flex-col px-[64px] py-[24px] gap-[24px] mt-4 animate-pulse">
            {/* Event title */}
            <div className="h-[20px] w-[200px] bg-grey-20 rounded-md"></div>

            {/* Date and time */}
            <div className="flex items-center gap-[8px]">
                <div className="w-[16px] h-[16px] bg-grey-20 rounded-md"></div>
                <div className="h-[14px] w-[80px] bg-grey-20 rounded-md"></div>
                <div className="w-[4px] h-[4px] bg-grey-20 rounded-full"></div>
                <div className="h-[14px] w-[60px] bg-grey-20 rounded-md"></div>
            </div>

            {/* Guest name & Ticket ID */}
            <div className="flex justify-between">
                <div className="flex flex-col gap-[6px]">
                    <div className="h-[12px] w-[80px] bg-grey-20 rounded-md"></div>
                    <div className="h-[14px] w-[120px] bg-grey-20 rounded-md"></div>
                </div>
                <div className="flex flex-col gap-[6px]">
                    <div className="h-[12px] w-[60px] bg-grey-20 rounded-md"></div>
                    <div className="h-[14px] w-[100px] bg-grey-20 rounded-md"></div>
                </div>
            </div>

            {/* Email & Ticket type */}
            <div className="flex justify-between">
                <div className="flex flex-col gap-[6px]">
                    <div className="h-[12px] w-[100px] bg-grey-20 rounded-md"></div>
                    <div className="h-[14px] w-[160px] bg-grey-20 rounded-md"></div>
                </div>
                <div className="flex flex-col gap-[6px]">
                    <div className="h-[12px] w-[80px] bg-grey-20 rounded-md"></div>
                    <div className="h-[14px] w-[60px] bg-grey-20 rounded-md"></div>
                </div>
            </div>

            {/* Check-in status */}
            <div className="flex justify-between">
                <div className="flex flex-col gap-[6px]">
                    <div className="h-[12px] w-[120px] bg-grey-20 rounded-md"></div>
                    <div className="h-[14px] w-[100px] bg-grey-20 rounded-md"></div>
                </div>
                <div className="flex flex-col gap-[6px]">
                    <div className="h-[12px] w-[100px] bg-grey-20 rounded-md"></div>
                    <div className="h-[14px] w-[80px] bg-grey-20 rounded-md"></div>
                </div>
            </div>

            {/* Check-in button */}
            <div className="h-[48px] w-full bg-grey-20 rounded-[12px]"></div>
        </div>
    )
}

export const BusinessesSkeleton = ({count}: { count: number }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="w-full sm:w-[343px] tablet:w-[422px] rounded-lg bg-white p-[4px] animate-pulse"
                >
                    {/* Main image placeholder */}
                    <div className="relative">
                        <div className="rounded-lg w-full h-[105px] bg-gray-300"/>

                        {/* Overlay logo */}
                        <div
                            className="absolute bottom-[-35px] left-4 sm:right-[260px] sm:left-auto w-16 h-16 bg-gray-300 rounded-xl border border-gray-200"/>
                    </div>

                    {/* Content */}
                    <div className="p-[10px]">
                        {/* Name + city + rating */}
                        <div className="mt-10 flex flex-wrap sm:flex-nowrap justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="h-4 w-20 bg-gray-300 rounded"/>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"/>
                                <div className="h-3 w-24 bg-gray-300 rounded"/>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-200 p-2 rounded-xl">
                                <div className="w-4 h-4 bg-gray-300 rounded"/>
                                <div className="h-3 w-6 bg-gray-300 rounded"/>
                            </div>
                        </div>

                        {/* Services + rate */}
                        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mt-2 gap-2">
                            <div className="flex gap-2 items-center flex-wrap">
                                <div className="p-2 px-3 rounded-full bg-gray-200">
                                    <div className="h-3 w-12 bg-gray-300 rounded"/>
                                </div>
                                <div className="p-2 px-3 rounded-full bg-gray-200">
                                    <div className="h-3 w-8 bg-gray-300 rounded"/>
                                </div>
                            </div>
                            <div className="h-4 w-16 bg-gray-300 rounded"/>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export const AllBusinessSkeleton = ({count}: { count: number }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div className="border-[2px] border-mid-grey rounded-[12px] shadow-lg animate-pulse" key={i}>
                    <div className="flex flex-col">
                        {/* Header */}
                        <div className="p-[16px]">
                            <div className="flex justify-between">
                                {/* Logo & Name */}
                                <div
                                    className="flex flex-row laptop:flex-col items-center justify-center laptop:items-start gap-[8px] laptop:gap-[10px]">
                                    <div
                                        className="w-[40px] h-[40px] bg-grey-20 rounded-xl border border-grey-30"></div>
                                    <div className="flex flex-col gap-[4px]">
                                        <div className="h-[14px] w-[100px] bg-grey-20 rounded-md"></div>
                                        <div className="h-[12px] w-[80px] bg-grey-20 rounded-md"></div>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl h-[28px]">
                                    <div className="w-[16px] h-[16px] bg-grey-20 rounded-full"></div>
                                    <div className="h-[14px] w-[24px] bg-grey-20 rounded-md"></div>
                                </div>
                            </div>
                        </div>

                        {/* Services & Rate */}
                        <div className="bg-mid-grey p-[12px] px-[16px] rounded-bl-[12px] rounded-br-[12px]">
                            <div className="flex justify-between mt-[8px] items-center">
                                <div className="flex gap-2">
                                    <div className="h-[14px] w-[60px] bg-grey-20 rounded-[12px]"></div>
                                    <div className="h-[14px] w-[40px] bg-grey-20 rounded-[12px]"></div>
                                </div>
                                <div className="h-[14px] w-[60px] bg-grey-20 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export const BusinessCarouselSkeleton = ({count}: { count: number }) => {
    return (
        <div className="relative w-full overflow-hidden rounded-[12px]">
            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4 mt-3">
                {[...Array(count)].map((_, i) => (
                    <div
                        key={i}
                        className="w-full rounded-lg bg-white p-[4px] animate-pulse shadow-sm"
                    >
                        {/* Main Image */}
                        <div className="relative">
                            <div className="rounded-lg w-full h-[105px] bg-grey-20"></div>
                            <div className="absolute bottom-[-35px] left-[16px] w-16 h-16">
                                <div className="w-full h-full rounded-xl bg-grey-30 border border-grey-40"></div>
                            </div>
                        </div>

                        <div className="p-[10px]">
                            {/* Business name and location */}
                            <div className="mt-10 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="h-[14px] w-[80px] bg-grey-20 rounded-md"></div>
                                    <div className="w-1 h-1 bg-grey-20 rounded-full"></div>
                                    <div className="h-[12px] w-[60px] bg-grey-20 rounded-md"></div>
                                </div>
                                {/* Rating */}
                                <div className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl h-[28px]">
                                    <div className="w-[16px] h-[16px] bg-grey-20 rounded-full"></div>
                                    <div className="h-[14px] w-[24px] bg-grey-20 rounded-md"></div>
                                </div>
                            </div>

                            {/* Services and rate */}
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex gap-2 items-center">
                                    <div className="h-[14px] w-[60px] bg-grey-20 rounded-full"></div>
                                    <div className="h-[14px] w-[40px] bg-grey-20 rounded-full"></div>
                                </div>
                                <div className="h-[14px] w-[60px] bg-grey-20 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const BusinessDetailSkeleton = () => {
    return (
        <div className="w-full laptop:w-[640px] relative bg-white rounded-[12px] p-[16px] animate-pulse">
            {/* Header with logo */}
            <div className="flex flex-col items-center">
                <div className="w-[64px] h-[64px] rounded-[16px] border border-grey-30 bg-grey-20"></div>
                <div className="mt-[8px] flex flex-col items-center gap-[4px]">
                    <div className="h-[16px] w-[120px] bg-grey-20 rounded-md"></div>
                    <div className="h-[14px] w-[100px] bg-grey-20 rounded-md"></div>
                    <div className="h-[16px] w-[80px] bg-grey-20 rounded-md mt-[4px]"></div>
                </div>
                <div className="mt-[8px] flex justify-center">
                    <div className="flex items-center gap-1 bg-grey-10 p-2 rounded-xl">
                        <div className="w-[16px] h-[16px] bg-grey-20 rounded-full"></div>
                        <div className="h-[14px] w-[24px] bg-grey-20 rounded-md"></div>
                    </div>
                </div>
                <div className="mt-[16px]">
                    <div className="h-[40px] w-[140px] bg-grey-20 rounded-[12px]"></div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center mt-[24px] gap-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-[8px]">
                        <div className="p-[16px] border border-grey-20 rounded-[16px] bg-grey-10">
                            <div className="w-[24px] h-[24px] bg-grey-20 rounded-md"></div>
                        </div>
                        <div className="h-[12px] w-[40px] bg-grey-20 rounded-md"></div>
                    </div>
                ))}
            </div>

            {/* Info Section */}
            <div className="w-full laptop:w-[640px] rounded-tl-[24px] rounded-tr-[24px] bg-grey-10 mt-[24px]">
                <div className="p-[16px]">
                    {/* About business */}
                    <div className="h-[16px] w-[120px] bg-grey-20 rounded-md mb-[12px]"></div>
                    <div className="space-y-2 mb-[16px]">
                        <div className="h-[12px] w-full bg-grey-20 rounded-md"></div>
                        <div className="h-[12px] w-[80%] bg-grey-20 rounded-md"></div>
                    </div>

                    {/* Business Categories */}
                    <div className="h-[16px] w-[150px] bg-grey-20 rounded-md mb-[12px]"></div>
                    <div className="space-y-2 mb-[16px]">
                        <div className="h-[12px] w-[70%] bg-grey-20 rounded-md"></div>
                    </div>

                    {/* Services */}
                    <div className="h-[16px] w-[100px] bg-grey-20 rounded-md mb-[12px]"></div>
                    <div className="space-y-2 mb-[16px]">
                        <div className="h-[12px] w-[60%] bg-grey-20 rounded-md"></div>
                    </div>

                    {/* Portfolio Gallery */}
                    <div className="h-[16px] w-[160px] bg-grey-20 rounded-md mb-[12px]"></div>
                    <div className="flex flex-wrap gap-2 mb-[16px]">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-[170px] h-[170px] bg-grey-20 rounded-[4px]"></div>
                        ))}
                    </div>

                    {/* Reviews */}
                    <div className="h-[16px] w-[100px] bg-grey-20 rounded-md mb-[16px]"></div>
                    <div className="flex justify-between">
                        <div className="flex flex-col p-[12px] px-[20px] rounded-[12px] bg-grey-10">
                            <div className="w-[20px] h-[20px] bg-grey-20 rounded-full mx-auto mb-[8px]"></div>
                            <div className="h-[20px] w-[60px] bg-grey-20 rounded-md mx-auto mb-[4px]"></div>
                            <div className="h-[12px] w-[80px] bg-grey-20 rounded-md mx-auto"></div>
                        </div>
                        <div className="flex flex-col justify-between gap-2 w-[60%]">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-[12px] w-full bg-grey-20 rounded-md"></div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="mt-[24px] space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-[60px] bg-grey-20 rounded-md"></div>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="mt-[24px] h-[16px] w-[100px] bg-grey-20 rounded-md mx-auto"></div>
                </div>
            </div>
        </div>
    )
}

export const MessagesSkeleton = ({count}: { count: number }) => {

}

export const TrendingEventsSkeleton = () => {
    return (
        <div className={`inset-0 w-full transition-opacity duration-1000 ease-in-out`}>
            <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"/>
        </div>
    )
}

export const AffiliateItemSkeleton = ({count}: { count: number }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div className="p-4 flex justify-between cursor-pointer animate-pulse" key={i}>
                    <div className="flex gap-2">
                        {/* Image Skeleton */}
                        <div className="w-[84px] h-[84px] bg-gray-200 rounded-md"></div>

                        {/* Content Skeleton */}
                        <div className="flex flex-col space-y-3">
                            {/* Event Name */}
                            <div className="w-[160px] h-4 bg-gray-200 rounded"></div>

                            {/* Date & Time */}
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                                <div className="w-[100px] h-3 bg-gray-200 rounded"></div>
                                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                                <div className="w-[60px] h-3 bg-gray-200 rounded"></div>
                                <div className="w-[20px] h-3 bg-gray-200 rounded"></div>
                                <div className="w-[60px] h-3 bg-gray-200 rounded"></div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                                <div className="w-[120px] h-3 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Arrow Skeleton */}
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                </div>

            ))}
        </>
    )
}

export const AffiliateEventsSkeleton = ({count}: { count: number }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div className="flex flex-col mb-[24px] animate-pulse" key={i}>
                    {/* Image Skeleton */}
                    <div className="w-[164px] h-[164px] bg-gray-200 rounded-[12px]"></div>

                    {/* Name Skeleton */}
                    <div className="w-[100px] h-4 bg-gray-200 rounded mt-[8px]"></div>

                    {/* Commission Skeleton */}
                    <div className="w-[60px] h-4 bg-gray-200 rounded mt-[4px]"></div>

                    {/* Ticket / Amount Skeleton */}
                    <div className="flex items-center gap-2 mt-[4px]">
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        <div className="w-[80px] h-3 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ))}
        </>
    )
}

export const AffiliateDataSkeleton = () => {
    return (
        <div className="animate-pulse space-y-4">
            {/* Total Commission Skeleton */}
            <div className="w-[120px] h-6 bg-gray-200 rounded"></div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Total Tickets Sold Label Skeleton */}
            <div className="w-[100px] h-4 bg-gray-200 rounded"></div>

            {/* Tickets Sold Number Skeleton */}
            <div className="w-[80px] h-6 bg-gray-200 rounded"></div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Wallet Button Skeleton */}
            <div className="flex gap-2 items-center">
                <div className="w-[100px] h-5 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    )
}

export const InviteSkeleton = ({count}: { count: number }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div
                    className="flex justify-between pb-[16px] border-b-[1px] border-b-mid-grey mb-[32px] animate-pulse"
                    key={i}>
                    <div className="flex gap-2">
                        {/* Avatar + Lemon ID */}
                        <div className="relative flex items-center justify-center">
                            <div className="w-[33px] h-[41px] bg-gray-200 rounded-[8px]"></div>
                            <div className="absolute w-[20px] h-[8px] bg-gray-300 rounded"></div>
                        </div>

                        {/* Invite Info */}
                        <div className="flex flex-col gap-2">
                            {/* Name + Message Intro */}
                            <div className="w-[200px] h-[14px] bg-gray-200 rounded"></div>

                            {/* Distance + Message Row */}
                            <div className="flex items-center gap-[8px]">
                                <div className="w-[60px] h-[10px] bg-gray-200 rounded"></div>
                                <div className="w-[10px] h-[10px] bg-gray-200 rounded-full"></div>
                                <div className="w-[120px] h-[10px] bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>

                    {/* Chevron Icon */}
                    <div className="w-[16px] h-[16px] bg-gray-200 rounded"></div>
                </div>
            ))}
        </>
    )
}

export const BoostPackagesSkeleton = ({count}: { count: number }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div
                    className={`p-[16px] bg-light-tint w-fit flex flex-col items-center justify-center rounded-[12px] animate-pulse`}
                    key={i}
                >
                    <div className="w-[74px] h-[74px] bg-gray-200 rounded-[8px]"/>
                    <div className="w-[60px] h-[12px] bg-gray-200 rounded-[4px] mt-[8px]"/>
                    <div className="w-[80px] h-[16px] bg-gray-200 rounded-[4px] mt-[8px]"/>
                    <div className="w-[120px] h-[12px] bg-gray-200 rounded-[4px] mt-[4px]"/>
                </div>

            ))}
        </>
    )
}

export const BillingHistorySkeleton = ({count}: { count: number }) => {
    return (
        <div className="w-full laptop:w-[640px] flex flex-col gap-10 animate-pulse">
            {/* Current Plan Skeleton */}
            <div
                className="rounded-2xl bg-green-tint border-b-4 border-b-step-color p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex flex-col gap-2 w-full sm:w-[60%]">
                    <div className="h-[20px] w-[100px] bg-light-grey-70 rounded-md"></div>
                    <div className="h-[28px] w-[140px] bg-light-grey-70 rounded-md"></div>
                    <div className="bg-light-green-50 px-3 py-2 rounded-lg w-[180px]">
                        <div className="h-[16px] w-[120px] bg-light-grey-70 rounded-md"></div>
                    </div>
                </div>
                <div className="h-[20px] w-[100px] bg-light-grey-70 rounded-md"></div>
            </div>

            {/* Payment Info Skeleton */}
            <div className="flex flex-col gap-4">
                <div className="h-[16px] w-[120px] bg-light-grey-70 rounded-md"></div>

                <div className="flex items-center gap-3 bg-light-green-10 w-fit px-2 py-1 rounded-lg">
                    <div className="flex items-center gap-2 bg-light-green-50 px-3 py-2 rounded-xl">
                        <div className="h-[24px] w-[33px] bg-light-grey-70 rounded-md"></div>
                        <div className="h-[16px] w-[60px] bg-light-grey-70 rounded-md"></div>
                    </div>
                    <div className="h-[16px] w-[100px] bg-light-grey-70 rounded-md"></div>
                </div>
            </div>

            {/* Payment History Skeleton */}
            <div className="flex flex-col gap-4">
                <div className="h-[16px] w-[140px] bg-light-grey-70 rounded-md"></div>

                {/* 3 Dummy History Rows */}
                <div
                    className="flex flex-col divide-y divide-light-green-20 border border-light-green-20 rounded-xl overflow-hidden">
                    {Array.from({length: count}).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col laptop:flex-row justify-between items-start laptop:items-center px-4 py-3 bg-white"
                        >
                            <div className="h-[18px] w-[150px] bg-light-grey-70 rounded-md"></div>
                            <div className="h-[16px] w-[100px] bg-light-grey-70 rounded-md mt-2 laptop:mt-0"></div>
                            <div className="h-[18px] w-[80px] bg-light-grey-70 rounded-md mt-2 laptop:mt-0"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export const ImagesLoadingSkeleton = ({count}: { count: number }) => {
    return (
        <>
            {Array(count).fill(0).map((_, index) => (
                <div className="relative inline-block w-[165.5px] h-[165.5px] animate-pulse">
                    {/* Image Skeleton */}
                    <div className="w-full h-full bg-gray-200 rounded-[12px]"/>

                    {/* Remove Button Skeleton */}
                    <div
                        className="absolute top-0 right-0 m-2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center shadow">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
            ))}
        </>
    )
}

export const JobListSkeleton = ({count}: { count: number }) => {
    return (
        <div className="flex flex-col overflow-y-auto hide-scrollbar pb-24">
            <div className="flex flex-col w-full gap-4">
                {Array(count).fill(0).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-sm p-4 animate-pulse"
                    >
                        {/* Top Row Skeleton: Logo + Name */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3 items-center">
                                <div className="w-[40px] h-[40px] bg-gray-200 rounded-xl"/>
                                <div className="flex flex-col gap-2">
                                    <div className="w-[120px] h-4 bg-gray-200 rounded"/>
                                    <div className="w-[80px] h-3 bg-gray-200 rounded mt-1"/>
                                </div>
                            </div>
                            <div className="w-4 h-4 bg-gray-200 rounded"/>
                        </div>

                        {/* Bottom Row Skeleton: Services + Amount */}
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-2 flex-wrap">
                                <div className="w-[60px] h-5 bg-gray-200 rounded-full"/>
                                <div className="w-[40px] h-5 bg-gray-200 rounded-full"/>
                            </div>
                            <div className="w-[50px] h-4 bg-gray-200 rounded"/>
                        </div>

                        {/* Divider Skeleton */}
                        {index !== 3 && (
                            <div className="my-4 h-px bg-gray-300 rounded-full"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const ChatListCardSkeleton = ({count}: { count: number }) => {
    return (
        Array(count).fill(0).map((_, index) => (
            <div className="p-4 flex items-center gap-3 rounded-xl cursor-pointer animate-pulse">
                {/* Avatar Skeleton */}
                <div className="w-[48px] h-[48px] rounded-[16px] bg-gray-200 shadow-sm"/>

                {/* Chat Info Skeleton */}
                <div className="flex flex-col w-full border-b border-grey-20 pb-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Username */}
                            <div className="h-[12px] w-[120px] bg-gray-200 rounded"/>
                            {/* Dot */}
                            <div className="w-[10px] h-[5px] bg-gray-200 rounded-full"/>
                            {/* Lemon ID */}
                            <div className="h-[10px] w-[60px] bg-gray-200 rounded"/>
                        </div>

                        {/* Timestamp */}
                        <div className="h-[10px] w-[50px] bg-gray-200 rounded"/>
                    </div>

                    {/* Message Preview */}
                    <div className="mt-2">
                        <div className="h-[12px] w-[80%] bg-gray-200 rounded"/>
                    </div>
                </div>
            </div>
        ))
    )
}