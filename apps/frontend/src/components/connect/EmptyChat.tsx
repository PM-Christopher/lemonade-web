import React from "react";
import Image from "next/image";
import avatar from "@/image/avatar_3.png";
import DotIcon from "@/image/icons/Dot.svg";
import MoreIcon from "@/image/icons/MoreIcon.svg";
import { Input } from "@lemonade/ui";
import ImageIcon from "@/image/icons/ImageIcon.svg";

const EmptyChat = () => {
  return (
    <div className="relative flex h-[648px] w-[560px] flex-col rounded-br-[16px] rounded-tr-[16px] border-b-[1px] border-r-[1px] border-t-[1px] bg-white">
      <div className="absolute left-0 top-0 w-full rounded-tr-[16px] p-[8px] text-white"></div>

      <div className="mb-16 flex h-screen items-center justify-center rounded-br-[16px] rounded-tr-[16px] bg-white p-[16px]">
        <p className="font-ruso text-[20px] font-semibold">Open chat to begin messaging</p>
      </div>

      <div className="absolute bottom-0 left-0 w-full rounded-br-[16px] p-[16px] px-[13px] text-white"></div>
    </div>
  );
};

export default EmptyChat;
