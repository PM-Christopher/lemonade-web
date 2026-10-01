import React from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import RatingIcon from "@/images/icons/ratingIcon.svg";
import { formatDecimal } from "@/lib/helper";

interface User {
  id: number;
  username: string;
  avatar: string;
}

export interface Review {
  user: User;
  title: string;
  description: string;
  rating: number;
  created_at: string;
}

interface ReviewInterface {
  review: Review;
}

const Reviews: React.FC<ReviewInterface> = ({ review }) => {
  return (
    <>
      <div className="">
        <p className="text-[14px] font-semibold">{review?.title}</p>
        <p className="text-light-black text-[14px] font-normal">{review?.description}</p>
        <div className="flex items-center justify-between">
          <div className="mt-[14px] flex items-center gap-[8px]">
            <div className="rounded-[6px] border-[1px]">
              <Image
                src={review.user.avatar}
                alt="avatar"
                width={16}
                height={16}
                className="border-grey-90 h-[16px] w-[16px] rounded-[6px] border-[1px]"
              />
            </div>
            <p className="text-text-grey text-[12px] font-semibold">{review?.user?.username}</p>
            <DotIcon className="h-[2px] w-[2px]" />
            <p className="text-text-grey text-[12px] font-normal">{review?.created_at}</p>
          </div>
          <div>
            <div className="bg-mid-grey flex items-center gap-2 rounded-[12px] p-[4px] px-[6px]">
              <RatingIcon />
              <p className="text-[12px] font-semibold">{formatDecimal(review?.rating, 1)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-mid-grey my-[24px] border-t-[1px]"></div>
    </>
  );
};

export default Reviews;
