import Image from "next/image";
import React from "react";

export const TribesSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="scrollbar-hide mt-3 flex space-x-2 overflow-x-auto py-4 shadow-none">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-light-yellow flex h-[180px] w-[422px] flex-shrink-0 animate-pulse flex-col rounded-2xl p-3 shadow-none sm:h-[200px] sm:p-4"
        >
          {/* Image placeholder */}
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-gray-300 sm:h-12 sm:w-12" />
          </div>

          {/* Text placeholders */}
          <div className="mt-2 flex flex-1 justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 h-2.5 w-1/2 rounded bg-gray-300 sm:h-3" />
              <div className="h-2.5 w-3/4 rounded bg-gray-300 sm:h-3" />
            </div>
            <div className="ml-2 flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-gray-200 sm:h-12 sm:w-12" />
            </div>
          </div>

          {/* Footer placeholders */}
          <div className="mt-auto flex justify-between pt-2">
            <div className="flex gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1">
                <div className="h-3.5 w-3.5 rounded bg-gray-300 sm:h-4 sm:w-4" />
                <div className="h-2.5 w-5 rounded bg-gray-300 sm:h-3 sm:w-6" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3.5 w-3.5 rounded bg-gray-300 sm:h-4 sm:w-4" />
                <div className="h-2.5 w-5 rounded bg-gray-300 sm:h-3 sm:w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-8 rounded bg-gray-300 sm:h-3 sm:w-10" />
              <div className="h-2.5 w-2.5 rounded bg-gray-300 sm:h-3 sm:w-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TribeDetailsSkeleton = () => {
  return (
    <div className="flex h-fit w-[496px] animate-pulse flex-col gap-2 rounded-[12px] bg-white p-4 py-4">
      {/* Header */}
      <div>
        <p className="font-sans text-[16px] leading-[24px] font-semibold">Tribe details</p>
      </div>

      {/* Tribe Image */}
      <div className="mt-10 flex justify-center">
        <div className="h-[96px] w-[96px] rounded-[24px] bg-gray-200"></div>
      </div>

      {/* Tribe Info */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="h-6 w-[150px] rounded bg-gray-200"></div>
        <div className="h-4 w-[100px] rounded bg-gray-200"></div>

        {/* Members & Threads */}
        <div className="mt-1 flex items-center justify-center gap-1">
          <div className="h-3 w-[80px] rounded bg-gray-200"></div>
          <div className="h-3 w-[60px] rounded bg-gray-200"></div>
        </div>

        {/* Tribe Description */}
        <div className="mt-4 flex w-[311px] flex-col items-center gap-2">
          <div className="h-20 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-[180px] rounded bg-gray-200"></div>
        </div>

        {/* Actions (Share / Add Member) */}
        <div className="mt-4 flex gap-[16px]">
          {/* Share */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-light_grey flex h-[64px] w-[64px] items-center justify-center rounded-[16px] p-[24px]">
              <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            </div>
            <div className="h-4 w-[60px] rounded bg-gray-200"></div>
          </div>

          {/* Add member */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-light_grey flex h-[64px] w-[64px] items-center justify-center rounded-[16px] p-[24px]">
              <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            </div>
            <div className="h-4 w-[60px] rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="my-2 flex justify-center">
        <div className="h-[60px] w-[200px] rounded-[37px] bg-gray-200"></div>
      </div>

      {/* Monetized Section */}
      <div className="my-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="h-4 w-[120px] rounded bg-gray-200"></div>
          <div className="h-3 w-[180px] rounded bg-gray-200"></div>
        </div>
        <div className="h-4 w-[60px] rounded bg-gray-200"></div>
      </div>

      {/* Members List */}
      <div className="bg-light_grey flex flex-col gap-4 rounded-[12px] p-3">
        <div className="h-4 w-[80px] rounded bg-gray-200"></div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-[20px] w-[20px] rounded-[6px] bg-gray-200"></div>
              <div className="h-4 w-[80px] rounded bg-gray-200"></div>
            </div>
            <div className="h-4 w-[20px] rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SubscriptionsSkeleton = ({ count, dataList }: { count: number; dataList: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div className="flex animate-pulse flex-col items-center" key={i}>
          {/* Header Section */}
          <div className="bg-grey-20 w-[260px] rounded-tl-[16px] rounded-tr-[16px] px-[48px] pt-[16px]">
            <div className="bg-light-grey-70 mx-auto mb-2 h-[24px] w-[120px] rounded-md"></div>
            <div className="bg-light-grey-70 mx-auto h-[20px] w-[100px] rounded-md"></div>
          </div>

          {/* Card Section */}
          <div className="border-light-grey-60 mt-1 w-[311px] rounded-[12px] border-[2px]">
            <div className="bg-grey-20 rounded-tl-[12px] rounded-tr-[12px] p-[12px]">
              <div className="bg-light-grey-70 h-[20px] w-[140px] rounded-md"></div>
            </div>

            <div className="flex flex-col gap-[20px] rounded-br-[12px] rounded-bl-[12px] bg-white p-4">
              {Array.from({ length: dataList }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-light-grey-70 h-[20px] w-[20px] rounded-md"></div>
                    <div className="bg-light-grey-70 h-[14px] w-[120px] rounded-md"></div>
                  </div>
                  <div className="bg-light-grey-70 h-[14px] w-[40px] rounded-md"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Button Section */}
          <div className="bg-light-grey-70 mt-[56px] h-[48px] w-[250px] rounded-[12px]"></div>
        </div>
      ))}
    </>
  );
};

export const TribeListSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-grey-30 bg-mid-grey mb-2 overflow-hidden rounded-[16px] border-[1px]"
        >
          {/* Top Section */}
          <div className="flex items-center justify-between rounded-[16px] bg-white p-4">
            <div className="flex items-center gap-2">
              {/* Tribe Image */}
              <div className="h-[40px] w-[40px] rounded-full bg-gray-200"></div>

              {/* Tribe Info */}
              <div className="flex flex-col gap-1">
                <div className="h-[12px] w-[100px] rounded bg-gray-200"></div>
                <div className="h-[10px] w-[140px] rounded bg-gray-100"></div>
              </div>
            </div>

            {/* Join Button */}
            <div className="flex items-center gap-1 rounded-[12px] border-[1px] border-gray-200 p-[6px] px-[16px]">
              <div className="h-[10px] w-[40px] rounded bg-gray-200"></div>
              <div className="h-[16px] w-[16px] rounded-full bg-gray-100"></div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-mid-grey flex items-center justify-between rounded-b-[16px] p-4 py-6">
            <div className="h-[10px] w-[60px] rounded bg-gray-200"></div>
            <div className="h-[10px] w-[80px] rounded bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="h-[16px] w-[16px] rounded bg-gray-200"></div>
              <div className="h-[10px] w-[70px] rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ThreadsSkeleton = ({ count }: { count: number }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div className="grid h-full w-full animate-pulse gap-[50px] p-4 py-4" key={i}>
          {/* Header Section */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="h-[48px] w-[48px] rounded-[16px] border border-gray-300 bg-gray-200"></div>

                {/* Username */}
                <div className="h-[12px] w-[80px] rounded bg-gray-200"></div>

                {/* Verified Icon Placeholder */}
                <div className="h-[13px] w-[13px] rounded-full bg-gray-200"></div>

                {/* Dot */}
                <div className="h-[3px] w-[3px] rounded-full bg-gray-300"></div>

                {/* Date */}
                <div className="h-[10px] w-[60px] rounded bg-gray-200"></div>
              </div>

              {/* More Icon */}
              <div className="h-[20px] w-[20px] rounded-full bg-gray-200"></div>
            </div>

            {/* Topic */}
            <div className="mt-[8px] h-[14px] w-[60%] rounded bg-gray-200"></div>

            {/* Thoughts */}
            <div className="mt-[20px] space-y-2">
              <div className="h-[12px] w-full rounded bg-gray-200"></div>
              <div className="h-[12px] w-[90%] rounded bg-gray-200"></div>
              <div className="h-[12px] w-[80%] rounded bg-gray-200"></div>
            </div>

            {/* Media Carousel Placeholder */}
            <div className="mt-4 h-[180px] w-full rounded-[12px] bg-gray-200"></div>

            {/* Poll Section */}
            <div className="mt-6 flex flex-col gap-3">
              <div className="h-[16px] w-[120px] rounded bg-gray-200"></div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="relative h-[40px] w-full overflow-hidden rounded-[8px] bg-gray-200"
                ></div>
              ))}
              <div className="h-[10px] w-[80px] rounded bg-gray-200"></div>
            </div>
          </div>

          {/* Like / Comment Buttons */}
          <div className="mt-2 flex gap-4">
            <div className="h-[30px] w-[64px] rounded-[12px] bg-gray-200"></div>
            <div className="h-[30px] w-[64px] rounded-[12px] bg-gray-200"></div>
          </div>

          {/* Comments Section Placeholder */}
          <div className="mt-4 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <div className="h-[32px] w-[32px] rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-[10px] w-[40%] rounded bg-gray-200"></div>
                  <div className="h-[10px] w-[80%] rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-4 w-full border-b border-gray-200"></div>
        </div>
      ))}
    </>
  );
};

export const EventsSkeleton = ({ count }: { count: number }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="phone:w-[200px] flex h-[280px] w-[78vw] shrink-0 animate-pulse flex-col overflow-hidden rounded-2xl shadow-sm"
        >
          {/* Image placeholder */}
          <div className="h-[200px] flex-shrink-0 rounded-t-2xl bg-gray-300" />

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-3">
            {/* Title placeholder */}
            <div className="mb-2">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-300" />
              <div className="h-4 w-1/2 rounded bg-gray-300" />
            </div>

            {/* Date & time placeholders */}
            <div className="mt-auto flex items-center gap-1">
              <div className="h-4 w-4 rounded bg-gray-300" />
              <div className="h-3 w-16 rounded bg-gray-300" />
              <div className="h-[3px] w-[3px] rounded-full bg-gray-300" />
              <div className="h-3 w-10 rounded bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const EventDetailsSkeleton = () => {
  return (
    <section className="mt-4 flex animate-pulse flex-col items-center">
      {/* Main Container */}
      <div className="flex w-full justify-center">
        <div className="laptop:max-w-[1100px] laptop:flex-row laptop:items-center flex w-full flex-col items-start gap-10 overflow-hidden rounded-2xl bg-white p-[20px] shadow-sm">
          {/* Image Skeleton */}
          <div className="laptop:w-[480px] h-[320px] w-full rounded-2xl bg-gray-200"></div>

          {/* Event Details Skeleton */}
          <div className="laptop:px-10 laptop:py-8 flex w-full flex-col justify-between space-y-5 px-6 py-6">
            {/* Title */}
            <div className="h-8 w-[70%] rounded bg-gray-200"></div>

            {/* Date */}
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-gray-200"></div>
              <div className="h-4 w-[180px] rounded bg-gray-200"></div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-gray-200"></div>
              <div className="h-4 w-[160px] rounded bg-gray-200"></div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-gray-200"></div>
              <div className="h-4 w-[140px] rounded bg-gray-200"></div>
            </div>

            {/* Contact Us */}
            <div className="laptop:flex hidden flex-col space-y-3">
              <div className="h-5 w-[100px] rounded bg-gray-200"></div>
              <div className="flex items-center gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gray-200"></div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="laptop:flex mt-10 hidden">
              <div className="h-[56px] w-[231px] rounded-[12px] bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="laptop:max-w-[1100px] mt-[40px] w-full">
        <div className="mb-4 h-6 w-[150px] rounded bg-gray-200"></div>
        <div className="h-[120px] w-full rounded-xl bg-gray-200"></div>

        {/* Mobile Contact & CTA */}
        <div className="laptop:hidden mt-[40px] block space-y-4">
          <div className="h-5 w-[100px] rounded bg-gray-200"></div>

          <div className="flex items-center gap-[16px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-8 rounded-full bg-gray-200"></div>
            ))}
          </div>

          <div className="mt-[20px]">
            <div className="h-[56px] w-[231px] rounded-[12px] bg-gray-200"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const EventTicketDetailSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Event Header Skeleton */}
      <div className="bg-green-tint flex gap-4 rounded-[8px] p-3 px-4">
        {/* Event Image Skeleton */}
        <div className="laptop:h-[120px] laptop:w-[120px] h-[72px] w-[72px] rounded-[12px] bg-gray-200"></div>

        {/* Event Info Skeleton */}
        <div className="flex flex-1 flex-col gap-2">
          {/* Event Name */}
          <div className="laptop:h-6 laptop:w-[300px] h-5 w-[200px] rounded bg-gray-200"></div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-200"></div>
            <div className="h-3 w-[80px] rounded bg-gray-200"></div>
            <div className="h-3 w-3 rounded bg-gray-200"></div>
            <div className="h-3 w-[80px] rounded bg-gray-200"></div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-200"></div>
            <div className="h-3 w-[60px] rounded bg-gray-200"></div>
            <div className="h-3 w-3 rounded bg-gray-200"></div>
            <div className="h-3 w-[60px] rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Tickets Skeleton */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="px-4">
          <div className="mt-6 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-[120px] rounded bg-gray-200"></div>
              <div className="h-5 w-[60px] rounded bg-gray-200"></div>
              <div className="h-3 w-[160px] rounded bg-gray-200"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-[8px] bg-gray-200"></div>
              <div className="h-7 w-7 rounded-[8px] bg-gray-200"></div>
              <div className="h-6 w-6 rounded-[8px] bg-gray-200"></div>
            </div>
          </div>
          <div className="my-2 border-t-[1px] border-gray-200"></div>
        </div>
      ))}
    </div>
  );
};

export const EventProgramDetailSkeleton = () => {
  return (
    <div className="mt-4 flex animate-pulse flex-col items-center">
      <div className="flex justify-between gap-[24px]">
        {/* Left Column */}
        <div>
          <div className="flex w-[640px] flex-col rounded-[12px] bg-white p-[24px]">
            {/* Event Card Skeleton */}
            <div className="bg-green-tint flex items-center gap-3 rounded-[8px] p-[8px] px-[16px]">
              <div className="h-[120px] w-[120px] rounded-[8px] bg-gray-200"></div>
              <div className="flex w-full flex-col gap-2">
                <div className="h-5 w-1/2 rounded bg-gray-200"></div>
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                <div className="h-4 w-1/3 rounded bg-gray-200"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-[24px] flex items-center justify-center gap-8">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-[8px]">
                  <div className="border-grey-20 h-[48px] w-[48px] rounded-[16px] border-[1px] bg-gray-100 p-[16px]"></div>
                  <div className="h-3 w-12 rounded bg-gray-200"></div>
                </div>
              ))}
            </div>

            {/* Guest List */}
            <div className="border-mid-grey mt-[24px] flex items-center justify-between rounded-[12px] border-[2px] p-[12px] px-[16px]">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-gray-200"></div>
                <div className="h-4 w-20 rounded bg-gray-200"></div>
              </div>
              <div className="h-4 w-4 rounded bg-gray-200"></div>
            </div>

            {/* Breakdown Boxes */}
            <div className="border-mid-grey mt-[24px] flex flex-col gap-4 rounded-[12px] border-[2px] p-[16px]">
              {[1, 2, 3].map((_, i) => (
                <div key={i}>
                  <div className="mb-2 h-3 w-24 rounded bg-gray-200"></div>
                  <div className="h-5 w-32 rounded bg-gray-200"></div>
                  {i < 2 && <div className="border-t-grey-20 my-4 border-t-[1px]"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex w-[480px] flex-col rounded-[8px] bg-white p-[16px]">
              <div className="mb-4 h-5 w-1/2 rounded bg-gray-200"></div>
              {[1, 2, 3].map((_, j) => (
                <div key={j} className="mt-[16px]">
                  <div className="mb-2 h-4 w-1/3 rounded bg-gray-200"></div>
                  <div className="mt-[2px] flex justify-between">
                    <div className="h-5 w-20 rounded bg-gray-200"></div>
                    <div className="h-4 w-16 rounded bg-gray-200"></div>
                  </div>
                  <div className="mt-[4px] h-[8px] w-full rounded-full bg-gray-200"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GuestListSkeleton = ({ count }: { count: 4 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
        >
          <div className="w-full min-w-0">
            {/* Name + ticket */}
            <div className="flex items-center gap-2">
              <div className="h-[14px] w-[140px] rounded bg-gray-200" />
              <span className="h-1 w-1 rounded-full bg-gray-200" />
              <div className="h-[12px] w-[90px] rounded bg-gray-200" />
            </div>

            {/* Status pill */}
            <div className="mt-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-2.5 py-1 ring-1 ring-gray-200">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />
                <div className="h-[11px] w-[90px] rounded bg-gray-200" />
              </div>
            </div>
          </div>

          {/* Right chevron */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </>
  );
};

export const TransactionHistorySkeleton = ({ count }: { count: 4 }) => {
  return (
    <div className="animate-pulse px-[24px]">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex items-center justify-between pt-[16px] pb-[24px]">
          {/* Left side: Amount + message */}
          <div className="flex w-[60%] flex-col gap-2">
            <div className="bg-light-grey-70 h-[16px] w-[120px] rounded-md"></div>
            <div className="bg-light-grey-70 h-[12px] w-[80px] rounded-md"></div>
          </div>

          {/* Right side: Status badge */}
          <div className="bg-light-grey-70 h-[20px] w-[80px] rounded-[8px]"></div>
        </div>
      ))}
    </div>
  );
};

export const WalletDetailSkeleton = () => {
  return (
    <div className="laptop:w-[580px] flex w-full animate-pulse flex-col gap-4">
      {/* Earnings Card */}
      <div className="flex flex-col gap-4 rounded-[12px] bg-white p-[16px]">
        {/* Total Amount Earned */}
        <div className="border-b-mid-grey flex flex-col gap-2 border-b-[1px] p-[16px]">
          <div className="bg-light-grey-70 h-[14px] w-[140px] rounded-md"></div>
          <div className="bg-light-grey-70 h-[20px] w-[100px] rounded-md"></div>
        </div>

        {/* Referral Earnings */}
        <div className="border-b-mid-grey flex items-center justify-between border-b-[1px] p-[16px]">
          <div className="flex flex-col gap-2">
            <div className="bg-light-grey-70 h-[14px] w-[120px] rounded-md"></div>
            <div className="bg-light-grey-70 h-[20px] w-[80px] rounded-md"></div>
          </div>
          <div className="bg-light-grey-70 h-[24px] w-[24px] rounded-full"></div>
        </div>

        {/* Affiliate Earnings */}
        <div className="flex items-center justify-between p-[16px]">
          <div className="flex flex-col gap-2">
            <div className="bg-light-grey-70 h-[14px] w-[120px] rounded-md"></div>
            <div className="bg-light-grey-70 h-[20px] w-[80px] rounded-md"></div>
          </div>
          <div className="bg-light-grey-70 h-[24px] w-[24px] rounded-full"></div>
        </div>
      </div>

      {/* Payout Request */}
      <div className="bg-light-tint flex flex-col gap-4 rounded-[12px] p-[16px]">
        <div className="bg-light-grey-70 h-[14px] w-[80%] rounded-md"></div>
        <div className="bg-light-grey-70 h-[48px] w-[200px] rounded-[12px]"></div>
      </div>
    </div>
  );
};

export const GuestDetailSkeleton = () => {
  return (
    <div className="mt-4 flex animate-pulse flex-col gap-[24px] px-[64px] py-[24px]">
      {/* Event title */}
      <div className="bg-grey-20 h-[20px] w-[200px] rounded-md"></div>

      {/* Date and time */}
      <div className="flex items-center gap-[8px]">
        <div className="bg-grey-20 h-[16px] w-[16px] rounded-md"></div>
        <div className="bg-grey-20 h-[14px] w-[80px] rounded-md"></div>
        <div className="bg-grey-20 h-[4px] w-[4px] rounded-full"></div>
        <div className="bg-grey-20 h-[14px] w-[60px] rounded-md"></div>
      </div>

      {/* Guest name & Ticket ID */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-[6px]">
          <div className="bg-grey-20 h-[12px] w-[80px] rounded-md"></div>
          <div className="bg-grey-20 h-[14px] w-[120px] rounded-md"></div>
        </div>
        <div className="flex flex-col gap-[6px]">
          <div className="bg-grey-20 h-[12px] w-[60px] rounded-md"></div>
          <div className="bg-grey-20 h-[14px] w-[100px] rounded-md"></div>
        </div>
      </div>

      {/* Email & Ticket type */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-[6px]">
          <div className="bg-grey-20 h-[12px] w-[100px] rounded-md"></div>
          <div className="bg-grey-20 h-[14px] w-[160px] rounded-md"></div>
        </div>
        <div className="flex flex-col gap-[6px]">
          <div className="bg-grey-20 h-[12px] w-[80px] rounded-md"></div>
          <div className="bg-grey-20 h-[14px] w-[60px] rounded-md"></div>
        </div>
      </div>

      {/* Check-in status */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-[6px]">
          <div className="bg-grey-20 h-[12px] w-[120px] rounded-md"></div>
          <div className="bg-grey-20 h-[14px] w-[100px] rounded-md"></div>
        </div>
        <div className="flex flex-col gap-[6px]">
          <div className="bg-grey-20 h-[12px] w-[100px] rounded-md"></div>
          <div className="bg-grey-20 h-[14px] w-[80px] rounded-md"></div>
        </div>
      </div>

      {/* Check-in button */}
      <div className="bg-grey-20 h-[48px] w-full rounded-[12px]"></div>
    </div>
  );
};

export const BusinessesSkeleton = ({ count }: { count: number }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="tablet:w-[320px] w-[78vw] max-w-[320px] shrink-0 animate-pulse rounded-lg bg-white p-[4px]"
        >
          {/* Main image placeholder */}
          <div className="relative">
            <div className="h-[105px] w-full rounded-lg bg-gray-300" />

            {/* Overlay logo */}
            <div className="absolute bottom-[-28px] left-4 h-14 w-14 rounded-xl border border-gray-200 bg-gray-300" />
          </div>

          {/* Content */}
          <div className="p-[10px]">
            {/* Name + city + rating */}
            <div className="mt-10 flex flex-wrap justify-between gap-2 sm:flex-nowrap">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-4 w-20 rounded bg-gray-300" />
                <div className="h-1 w-1 rounded-full bg-gray-300" />
                <div className="h-3 w-24 rounded bg-gray-300" />
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-gray-200 p-2">
                <div className="h-4 w-4 rounded bg-gray-300" />
                <div className="h-3 w-6 rounded bg-gray-300" />
              </div>
            </div>

            {/* Services + rate */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full bg-gray-200 p-2 px-3">
                  <div className="h-3 w-12 rounded bg-gray-300" />
                </div>
                <div className="rounded-full bg-gray-200 p-2 px-3">
                  <div className="h-3 w-8 rounded bg-gray-300" />
                </div>
              </div>
              <div className="h-4 w-16 rounded bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const AllBusinessSkeleton = ({ count }: { count: number }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          className="border-mid-grey animate-pulse rounded-[12px] border-[2px] shadow-lg"
          key={i}
        >
          <div className="flex flex-col">
            {/* Header */}
            <div className="p-[16px]">
              <div className="flex justify-between">
                {/* Logo & Name */}
                <div className="laptop:flex-col laptop:items-start laptop:gap-[10px] flex flex-row items-center justify-center gap-[8px]">
                  <div className="border-grey-30 bg-grey-20 h-[40px] w-[40px] rounded-xl border"></div>
                  <div className="flex flex-col gap-[4px]">
                    <div className="bg-grey-20 h-[14px] w-[100px] rounded-md"></div>
                    <div className="bg-grey-20 h-[12px] w-[80px] rounded-md"></div>
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-mid-grey flex h-[28px] items-center gap-1 rounded-xl p-2">
                  <div className="bg-grey-20 h-[16px] w-[16px] rounded-full"></div>
                  <div className="bg-grey-20 h-[14px] w-[24px] rounded-md"></div>
                </div>
              </div>
            </div>

            {/* Services & Rate */}
            <div className="bg-mid-grey rounded-br-[12px] rounded-bl-[12px] p-[12px] px-[16px]">
              <div className="mt-[8px] flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="bg-grey-20 h-[14px] w-[60px] rounded-[12px]"></div>
                  <div className="bg-grey-20 h-[14px] w-[40px] rounded-[12px]"></div>
                </div>
                <div className="bg-grey-20 h-[14px] w-[60px] rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const BusinessCarouselSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-[12px]">
      <div className="tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 mt-3 grid grid-cols-1 gap-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="w-full animate-pulse rounded-lg bg-white p-[4px] shadow-sm">
            {/* Main Image */}
            <div className="relative">
              <div className="bg-grey-20 h-[105px] w-full rounded-lg"></div>
              <div className="absolute bottom-[-35px] left-[16px] h-16 w-16">
                <div className="border-grey-40 bg-grey-30 h-full w-full rounded-xl border"></div>
              </div>
            </div>

            <div className="p-[10px]">
              {/* Business name and location */}
              <div className="mt-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-grey-20 h-[14px] w-[80px] rounded-md"></div>
                  <div className="bg-grey-20 h-1 w-1 rounded-full"></div>
                  <div className="bg-grey-20 h-[12px] w-[60px] rounded-md"></div>
                </div>
                {/* Rating */}
                <div className="bg-mid-grey flex h-[28px] items-center gap-1 rounded-xl p-2">
                  <div className="bg-grey-20 h-[16px] w-[16px] rounded-full"></div>
                  <div className="bg-grey-20 h-[14px] w-[24px] rounded-md"></div>
                </div>
              </div>

              {/* Services and rate */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-grey-20 h-[14px] w-[60px] rounded-full"></div>
                  <div className="bg-grey-20 h-[14px] w-[40px] rounded-full"></div>
                </div>
                <div className="bg-grey-20 h-[14px] w-[60px] rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BusinessDetailSkeleton = () => {
  return (
    <div className="laptop:w-[640px] relative w-full animate-pulse rounded-[12px] bg-white p-[16px]">
      {/* Header with logo */}
      <div className="flex flex-col items-center">
        <div className="border-grey-30 bg-grey-20 h-[64px] w-[64px] rounded-[16px] border"></div>
        <div className="mt-[8px] flex flex-col items-center gap-[4px]">
          <div className="bg-grey-20 h-[16px] w-[120px] rounded-md"></div>
          <div className="bg-grey-20 h-[14px] w-[100px] rounded-md"></div>
          <div className="bg-grey-20 mt-[4px] h-[16px] w-[80px] rounded-md"></div>
        </div>
        <div className="mt-[8px] flex justify-center">
          <div className="bg-grey-10 flex items-center gap-1 rounded-xl p-2">
            <div className="bg-grey-20 h-[16px] w-[16px] rounded-full"></div>
            <div className="bg-grey-20 h-[14px] w-[24px] rounded-md"></div>
          </div>
        </div>
        <div className="mt-[16px]">
          <div className="bg-grey-20 h-[40px] w-[140px] rounded-[12px]"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-[24px] flex items-center justify-center gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-[8px]">
            <div className="bg-grey-10 border-grey-20 rounded-[16px] border p-[16px]">
              <div className="bg-grey-20 h-[24px] w-[24px] rounded-md"></div>
            </div>
            <div className="bg-grey-20 h-[12px] w-[40px] rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-grey-10 laptop:w-[640px] mt-[24px] w-full rounded-tl-[24px] rounded-tr-[24px]">
        <div className="p-[16px]">
          {/* About business */}
          <div className="bg-grey-20 mb-[12px] h-[16px] w-[120px] rounded-md"></div>
          <div className="mb-[16px] space-y-2">
            <div className="bg-grey-20 h-[12px] w-full rounded-md"></div>
            <div className="bg-grey-20 h-[12px] w-[80%] rounded-md"></div>
          </div>

          {/* Business Categories */}
          <div className="bg-grey-20 mb-[12px] h-[16px] w-[150px] rounded-md"></div>
          <div className="mb-[16px] space-y-2">
            <div className="bg-grey-20 h-[12px] w-[70%] rounded-md"></div>
          </div>

          {/* Services */}
          <div className="bg-grey-20 mb-[12px] h-[16px] w-[100px] rounded-md"></div>
          <div className="mb-[16px] space-y-2">
            <div className="bg-grey-20 h-[12px] w-[60%] rounded-md"></div>
          </div>

          {/* Portfolio Gallery */}
          <div className="bg-grey-20 mb-[12px] h-[16px] w-[160px] rounded-md"></div>
          <div className="mb-[16px] flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-grey-20 h-[170px] w-[170px] rounded-[4px]"></div>
            ))}
          </div>

          {/* Reviews */}
          <div className="bg-grey-20 mb-[16px] h-[16px] w-[100px] rounded-md"></div>
          <div className="flex justify-between">
            <div className="bg-grey-10 flex flex-col rounded-[12px] p-[12px] px-[20px]">
              <div className="bg-grey-20 mx-auto mb-[8px] h-[20px] w-[20px] rounded-full"></div>
              <div className="bg-grey-20 mx-auto mb-[4px] h-[20px] w-[60px] rounded-md"></div>
              <div className="bg-grey-20 mx-auto h-[12px] w-[80px] rounded-md"></div>
            </div>
            <div className="flex w-[60%] flex-col justify-between gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-grey-20 h-[12px] w-full rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="mt-[24px] space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-grey-20 h-[60px] rounded-md"></div>
            ))}
          </div>

          {/* Load More */}
          <div className="bg-grey-20 mx-auto mt-[24px] h-[16px] w-[100px] rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export const MessagesSkeleton = ({ count }: { count: number }) => {};

export const TrendingEventsSkeleton = () => {
  return (
    <div className={`inset-0 w-full transition-opacity duration-1000 ease-in-out`}>
      <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200" />
    </div>
  );
};

export const AffiliateItemSkeleton = ({ count }: { count: number }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div className="flex animate-pulse cursor-pointer justify-between p-4" key={i}>
          <div className="flex gap-2">
            {/* Image Skeleton */}
            <div className="h-[84px] w-[84px] rounded-md bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="flex flex-col space-y-3">
              {/* Event Name */}
              <div className="h-4 w-[160px] rounded bg-gray-200"></div>

              {/* Date & Time */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                <div className="h-3 w-[100px] rounded bg-gray-200"></div>
                <div className="h-2 w-2 rounded-full bg-gray-200"></div>
                <div className="h-3 w-[60px] rounded bg-gray-200"></div>
                <div className="h-3 w-[20px] rounded bg-gray-200"></div>
                <div className="h-3 w-[60px] rounded bg-gray-200"></div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                <div className="h-3 w-[120px] rounded bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Right Arrow Skeleton */}
          <div className="h-4 w-4 rounded bg-gray-200"></div>
        </div>
      ))}
    </>
  );
};

export const AffiliateEventsSkeleton = ({ count }: { count: number }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div className="mb-[24px] flex animate-pulse flex-col" key={i}>
          {/* Image Skeleton */}
          <div className="h-[164px] w-[164px] rounded-[12px] bg-gray-200"></div>

          {/* Name Skeleton */}
          <div className="mt-[8px] h-4 w-[100px] rounded bg-gray-200"></div>

          {/* Commission Skeleton */}
          <div className="mt-[4px] h-4 w-[60px] rounded bg-gray-200"></div>

          {/* Ticket / Amount Skeleton */}
          <div className="mt-[4px] flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-200"></div>
            <div className="h-3 w-[80px] rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export const AffiliateDataSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Total Commission Skeleton */}
      <div className="h-6 w-[120px] rounded bg-gray-200"></div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-300"></div>

      {/* Total Tickets Sold Label Skeleton */}
      <div className="h-4 w-[100px] rounded bg-gray-200"></div>

      {/* Tickets Sold Number Skeleton */}
      <div className="h-6 w-[80px] rounded bg-gray-200"></div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-300"></div>

      {/* Wallet Button Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-[100px] rounded bg-gray-200"></div>
        <div className="h-4 w-4 rounded-full bg-gray-200"></div>
      </div>
    </div>
  );
};

export const InviteSkeleton = ({ count }: { count: number }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          className="border-b-mid-grey mb-[32px] flex animate-pulse justify-between border-b-[1px] pb-[16px]"
          key={i}
        >
          <div className="flex gap-2">
            {/* Avatar + Lemon ID */}
            <div className="relative flex items-center justify-center">
              <div className="h-[41px] w-[33px] rounded-[8px] bg-gray-200"></div>
              <div className="absolute h-[8px] w-[20px] rounded bg-gray-300"></div>
            </div>

            {/* Invite Info */}
            <div className="flex flex-col gap-2">
              {/* Name + Message Intro */}
              <div className="h-[14px] w-[200px] rounded bg-gray-200"></div>

              {/* Distance + Message Row */}
              <div className="flex items-center gap-[8px]">
                <div className="h-[10px] w-[60px] rounded bg-gray-200"></div>
                <div className="h-[10px] w-[10px] rounded-full bg-gray-200"></div>
                <div className="h-[10px] w-[120px] rounded bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Chevron Icon */}
          <div className="h-[16px] w-[16px] rounded bg-gray-200"></div>
        </div>
      ))}
    </>
  );
};

export const BoostPackagesSkeleton = ({ count }: { count: number }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          className={`bg-light-tint flex w-fit animate-pulse flex-col items-center justify-center rounded-[12px] p-[16px]`}
          key={i}
        >
          <div className="h-[74px] w-[74px] rounded-[8px] bg-gray-200" />
          <div className="mt-[8px] h-[12px] w-[60px] rounded-[4px] bg-gray-200" />
          <div className="mt-[8px] h-[16px] w-[80px] rounded-[4px] bg-gray-200" />
          <div className="mt-[4px] h-[12px] w-[120px] rounded-[4px] bg-gray-200" />
        </div>
      ))}
    </>
  );
};

export const BillingHistorySkeleton = ({ count }: { count: number }) => {
  return (
    <div className="laptop:w-[640px] flex w-full animate-pulse flex-col gap-10">
      {/* Current Plan Skeleton */}
      <div className="border-b-step-color bg-green-tint flex flex-col items-start justify-between gap-6 rounded-2xl border-b-4 p-6 sm:flex-row sm:items-center">
        <div className="flex w-full flex-col gap-2 sm:w-[60%]">
          <div className="bg-light-grey-70 h-[20px] w-[100px] rounded-md"></div>
          <div className="bg-light-grey-70 h-[28px] w-[140px] rounded-md"></div>
          <div className="bg-light-green-50 w-[180px] rounded-lg px-3 py-2">
            <div className="bg-light-grey-70 h-[16px] w-[120px] rounded-md"></div>
          </div>
        </div>
        <div className="bg-light-grey-70 h-[20px] w-[100px] rounded-md"></div>
      </div>

      {/* Payment Info Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="bg-light-grey-70 h-[16px] w-[120px] rounded-md"></div>

        <div className="bg-light-green-10 flex w-fit items-center gap-3 rounded-lg px-2 py-1">
          <div className="bg-light-green-50 flex items-center gap-2 rounded-xl px-3 py-2">
            <div className="bg-light-grey-70 h-[24px] w-[33px] rounded-md"></div>
            <div className="bg-light-grey-70 h-[16px] w-[60px] rounded-md"></div>
          </div>
          <div className="bg-light-grey-70 h-[16px] w-[100px] rounded-md"></div>
        </div>
      </div>

      {/* Payment History Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="bg-light-grey-70 h-[16px] w-[140px] rounded-md"></div>

        {/* 3 Dummy History Rows */}
        <div className="divide-light-green-20 border-light-green-20 flex flex-col divide-y overflow-hidden rounded-xl border">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="laptop:flex-row laptop:items-center flex flex-col items-start justify-between bg-white px-4 py-3"
            >
              <div className="bg-light-grey-70 h-[18px] w-[150px] rounded-md"></div>
              <div className="bg-light-grey-70 laptop:mt-0 mt-2 h-[16px] w-[100px] rounded-md"></div>
              <div className="bg-light-grey-70 laptop:mt-0 mt-2 h-[18px] w-[80px] rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ImagesLoadingSkeleton = ({ count }: { count: number }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="relative inline-block h-[165.5px] w-[165.5px] animate-pulse">
            {/* Image Skeleton */}
            <div className="h-full w-full rounded-[12px] bg-gray-200" />

            {/* Remove Button Skeleton */}
            <div className="absolute top-0 right-0 m-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 shadow">
              <div className="h-3 w-3 rounded-full bg-gray-400"></div>
            </div>
          </div>
        ))}
    </>
  );
};

export const JobListSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="hide-scrollbar flex flex-col overflow-y-auto pb-24">
      <div className="flex w-full flex-col gap-4">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl bg-white p-4 shadow-sm">
              {/* Top Row Skeleton: Logo + Name */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-[40px] w-[40px] rounded-xl bg-gray-200" />
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-[120px] rounded bg-gray-200" />
                    <div className="mt-1 h-3 w-[80px] rounded bg-gray-200" />
                  </div>
                </div>
                <div className="h-4 w-4 rounded bg-gray-200" />
              </div>

              {/* Bottom Row Skeleton: Services + Amount */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <div className="h-5 w-[60px] rounded-full bg-gray-200" />
                  <div className="h-5 w-[40px] rounded-full bg-gray-200" />
                </div>
                <div className="h-4 w-[50px] rounded bg-gray-200" />
              </div>

              {/* Divider Skeleton */}
              {index !== 3 && <div className="my-4 h-px rounded-full bg-gray-300"></div>}
            </div>
          ))}
      </div>
    </div>
  );
};

export const ChatListCardSkeleton = ({ count }: { count: number }) => {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <div
        key={index}
        className="flex animate-pulse cursor-pointer items-center gap-3 rounded-xl p-4"
      >
        {/* Avatar Skeleton */}
        <div className="h-[48px] w-[48px] rounded-[16px] bg-gray-200 shadow-sm" />

        {/* Chat Info Skeleton */}
        <div className="border-grey-20 flex w-full flex-col border-b pb-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Username */}
              <div className="h-[12px] w-[120px] rounded bg-gray-200" />
              {/* Dot */}
              <div className="h-[5px] w-[10px] rounded-full bg-gray-200" />
              {/* Lemon ID */}
              <div className="h-[10px] w-[60px] rounded bg-gray-200" />
            </div>

            {/* Timestamp */}
            <div className="h-[10px] w-[50px] rounded bg-gray-200" />
          </div>

          {/* Message Preview */}
          <div className="mt-2">
            <div className="h-[12px] w-[80%] rounded bg-gray-200" />
          </div>
        </div>
      </div>
    ));
};

export const MyTicketSkeleton = () => {
  return (
    <div className="laptop:p-0 animate-pulse p-6">
      <div className="laptop:mt-10 laptop:rounded-none laptop:bg-none laptop:p-0 mt-[16px] flex flex-col items-center rounded-[16px] bg-white p-6">
        <div className="flex justify-center">
          <div className="flex w-[340px] flex-col gap-[16px]">
            {/* Event name */}
            <div className="h-[18px] w-[220px] rounded bg-gray-200" />

            {/* Date + Time */}
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <div className="h-[12px] w-[40px] rounded bg-gray-200" />
                <div className="h-[12px] w-[90px] rounded bg-gray-200" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-[12px] w-[40px] rounded bg-gray-200" />
                <div className="h-[12px] w-[70px] rounded bg-gray-200" />
              </div>
            </div>

            {/* Ticket type + Ticket ID */}
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <div className="h-[12px] w-[70px] rounded bg-gray-200" />
                <div className="h-[12px] w-[100px] rounded bg-gray-200" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-[12px] w-[60px] rounded bg-gray-200" />
                <div className="h-[12px] w-[110px] rounded bg-gray-200" />
              </div>
            </div>

            {/* Venue */}
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <div className="h-[12px] w-[45px] rounded bg-gray-200" />
                <div className="h-[12px] w-[200px] rounded bg-gray-200" />
              </div>
            </div>

            {/* QR Code */}
            <div className="laptop:mt-[48px] mt-[94px] flex items-center justify-center">
              <div className="h-[240px] w-[240px] rounded-[12px] bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EventFormSkeleton = () => {
  return (
    <form>
      <div className="mt-10 flex w-[640px] animate-pulse flex-col rounded-[12px] bg-white p-[48px]">
        {/* Header */}
        <div className="h-3 w-28 rounded bg-gray-200" />

        {/* Uploader */}
        <div className="mt-6 h-[160px] w-full rounded-[12px] bg-gray-200" />

        {/* Event name */}
        <div className="mt-[24px] grid gap-2">
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="h-12 w-full rounded-xl bg-gray-200" />
        </div>

        {/* Description */}
        <div className="mt-[24px] grid gap-2">
          <div className="h-3 w-32 rounded bg-gray-200" />
          <div className="h-[131px] w-full rounded-xl bg-gray-200" />
        </div>

        {/* Category */}
        <div className="mt-[24px] grid gap-2">
          <div className="h-3 w-28 rounded bg-gray-200" />
          <div className="h-12 w-full rounded-xl bg-gray-200" />
        </div>

        {/* EVENT TYPE */}
        <div className="mt-[48px] h-3 w-24 rounded bg-gray-200" />

        {/* Physical / Online buttons */}
        <div className="mt-[16px] flex gap-2">
          <div className="h-[48px] w-[140px] rounded-[12px] bg-gray-200" />
          <div className="h-[48px] w-[140px] rounded-[12px] bg-gray-200" />
        </div>

        {/* Location / Online fields placeholder */}
        <div className="mt-[24px] grid gap-2">
          <div className="h-3 w-28 rounded bg-gray-200" />
          <div className="h-12 w-full rounded-[12px] bg-gray-200" />
        </div>

        {/* Time zone */}
        <div className="mt-[24px] grid gap-2">
          <div className="h-3 w-32 rounded bg-gray-200" />
          <div className="h-12 w-full rounded-xl bg-gray-200" />
        </div>

        {/* Start date */}
        <div className="mt-[24px] grid gap-2">
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="flex justify-between gap-3">
            <div className="h-[40px] w-full rounded-[12px] bg-gray-200" />
            <div className="h-[40px] w-full rounded-[12px] bg-gray-200" />
          </div>
        </div>

        {/* End date */}
        <div className="mt-[24px] grid gap-2">
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="flex justify-between gap-3">
            <div className="h-[40px] w-full rounded-[12px] bg-gray-200" />
            <div className="h-[40px] w-full rounded-[12px] bg-gray-200" />
          </div>
        </div>

        {/* AFFILIATE PROGRAM */}
        <div className="mt-[48px] h-3 w-36 rounded bg-gray-200" />

        {/* Affiliate toggle row */}
        <div className="mt-[28px] flex items-start justify-between gap-4">
          <div className="flex w-full gap-2">
            <div className="h-6 w-6 rounded bg-gray-200" />
            <div className="flex w-full flex-col gap-2">
              <div className="h-4 w-[220px] rounded bg-gray-200" />
              <div className="h-3 w-[260px] rounded bg-gray-200" />
            </div>
          </div>
          <div className="h-6 w-12 rounded-full bg-gray-200" />
        </div>

        {/* Commission field placeholder */}
        <div className="mt-[24px] grid gap-2">
          <div className="h-3 w-32 rounded bg-gray-200" />
          <div className="h-12 w-full rounded-xl bg-gray-200" />
          <div className="h-3 w-[260px] rounded bg-gray-200" />
        </div>

        {/* SOCIAL DETAILS */}
        <div className="mt-[48px] h-3 w-44 rounded bg-gray-200" />

        {/* Social inputs (5 rows) */}
        <div className="mt-[16px] flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-[12px] bg-gray-200 p-2 px-[12px]"
            >
              <div className="h-5 w-5 rounded bg-gray-300" />
              <div className="h-5 w-full rounded bg-gray-300" />
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="mt-[24px] h-[48px] w-full rounded-[12px] bg-gray-200" />
      </div>
    </form>
  );
};
