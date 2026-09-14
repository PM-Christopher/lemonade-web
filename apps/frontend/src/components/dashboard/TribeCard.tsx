import React from "react";
import Image from "next/image";
import { TribeInterface } from "@/interfaces/TribeInterface";
import { useRouter } from "next/navigation";

type TribeIF = {
  tribe: TribeInterface;
};

const TribeCard: React.FC<TribeIF> = ({ tribe }) => {
  const router = useRouter();
  return (
    <div className="flex h-[200px] w-[422px] flex-col rounded-2xl bg-light-yellow p-4 shadow-none">
      <div className="flex-shrink-0">
        <Image
          src={tribe?.image}
          alt="forum_icon"
          width={48}
          height={48}
          className="h-12 w-12 rounded-lg object-cover"
        />
      </div>

      <div className="mt-2 flex flex-1 justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-xs font-semibold text-text-grey">
            {tribe?.tribe_name}
          </p>
          <p className="mt-1 max-w-[329.33px] truncate text-ellipsis font-sans text-xs font-semibold leading-relaxed">
            {tribe?.description}
          </p>
        </div>
        <div className="ml-2 flex-shrink-0">
          {/*<Image src={"/images/forum_image.png"} alt="" width={48} height={48}/>*/}
        </div>
      </div>

      <div className="mt-auto flex justify-between pt-2">
        <div className="flex gap-2">
          <div className="flex items-center justify-between gap-1">
            <Image
              src={"/images/heart.png"}
              alt="like"
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <p className="font-sans text-sm font-semi-normal text-light-black">{tribe?.likes}</p>
          </div>
          <div className="flex items-center justify-between gap-1">
            <Image
              src={"/images/chat.png"}
              alt="comment"
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <p className="font-sans text-sm font-semi-normal text-light-black">{tribe?.comments}</p>
          </div>
        </div>

        <div
          className="flex cursor-pointer items-center justify-between gap-1 transition-opacity hover:opacity-80"
          onClick={() => router.push(`tribe/${tribe?.slug}`)}
        >
          <p className="font-sans text-sm font-semi-normal text-light-green">View</p>
          <Image
            src={"/images/arrow-left.png"}
            alt="arrow left"
            width={12.5}
            height={12.5}
            className="h-3 w-3"
          />
        </div>
      </div>
    </div>
  );
};

export default TribeCard;
