"use client";
import MainLayout from "@/components/layouts/MainLayout";
import MainTribeCard from "@/components/tribes/MainTribeCard";
import ThreadCard from "@/components/tribes/ThreadCard";
import TribeDetails from "@/components/tribes/TribeDetails";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronLeft,
  CircleDotIcon,
  DotIcon,
  EditIcon,
  HeartIcon,
  MessageSquare,
  MoreVerticalIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TribeDetailPage = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false); // State to track if text is expanded
  const charLimit = 200; // Set your desired character limit
  return (
    <MainLayout>
      <section className="flex justify-between bg-white">
        <div className="flex h-[780px] w-[888px] flex-col gap-[24px] border-r-[1px] p-[24px]">
          <MainTribeCard />
          <MainTribeCard />
        </div>

        <div className="flex h-[780px] w-[788px] flex-col gap-[24px] p-[24px]">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold">Tribe details</p>
            <div className="rounded-[12px] border-[1px] border-light-grey-50 px-[14px] py-[10px]">
              <div className="flex items-center gap-[8px]">
                <p className="text-[14px] font-medium">Flag Tribe</p>
                <ChevronDown />
              </div>
            </div>
          </div>
          <div className="mt-[30px] flex flex-col items-center justify-center gap-[8px]">
            <div className="h-[96px] w-[96px] rounded-[24px] bg-gray-600"></div>
            <p className="text-[16px] font-semibold">Start-ups</p>
            <p className="text-[12px] font-semibold text-text-grey">
              ID: <span className="text-light-black">FR-2322</span>
            </p>
            <p className="text-[14px] font-medium italic text-text-grey">Business</p>
            <div className="flex items-center">
              <p className="text-[12px] font-normal text-text-grey">3 members</p>
              <DotIcon className="text-text-grey" />
              <p className="text-[12px] font-normal text-text-grey">0 thread</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="max-w-[311px] text-center text-[14px] font-normal text-light-black">
              Share your start-up experiences to teach others on what to do
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-center text-[12px] font-normal text-text-grey">
              Created on 23 Mar, 2025
            </p>
          </div>
          <div className="flex justify-center">
            <Button className="h-[60px] rounded-[37px] border-step-color bg-gradient-green p-[14px] px-[24px] shadow-custom-bottom">
              <div className="flex items-center justify-center gap-1">
                <EditIcon />
                <p className="font-semi-normal font-sans text-[16px] leading-[19.2px]">
                  Create thread
                </p>
              </div>
            </Button>
          </div>
          <div
            className={"flex flex-col gap-[8px] rounded-[12px] bg-light-grey px-[24px] py-[16px]"}
          >
            <p className={"text-[14px] font-medium text-text-grey"}>Members</p>
            <div className={"flex justify-between border-b-[1px] border-b-grey-20 py-[10px]"}>
              <div className={"flex items-center gap-2"}>
                <Image src={"/images/tribe_1.png"} alt={"image"} width={20} height={20} />
                <p className={"text-[14px] font-medium"}>Samjoe</p>
              </div>
              <p className={"text-[14px] font-medium italic text-text-grey"}>Creator</p>
            </div>
            <div className={"flex justify-between border-b-[1px] border-b-grey-20 py-[10px]"}>
              <div className={"flex items-center gap-2"}>
                <Image src={"/images/tribe_1.png"} alt={"image"} width={20} height={20} />
                <p className={"text-[14px] font-medium"}>Christojoe</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default TribeDetailPage;
