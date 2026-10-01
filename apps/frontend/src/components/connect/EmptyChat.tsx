import React from "react";
import Image from "next/image";
import avatar from "@/image/avatar_3.png";
import DotIcon from "@/image/icons/Dot.svg";
import MoreIcon from "@/image/icons/MoreIcon.svg";
import { Input } from "@lemonade/ui";
import ImageIcon from "@/image/icons/ImageIcon.svg";

const EmptyChat = () => {
  return (
    <div className="relative flex h-[648px] w-[560px] flex-col rounded-tr-2xl rounded-br-2xl border-t border-r border-b bg-white">
      <div className="absolute top-0 left-0 w-full rounded-tr-2xl p-2 text-white"></div>

      <div className="mb-16 flex h-screen items-center justify-center rounded-tr-2xl rounded-br-2xl bg-white p-4">
        <p className="font-ruso text-[20px] font-semibold">Open chat to begin messaging</p>
      </div>

      <div className="absolute bottom-0 left-0 w-full rounded-br-2xl p-4 px-[13px] text-white"></div>
    </div>
  );
};

export default EmptyChat;
