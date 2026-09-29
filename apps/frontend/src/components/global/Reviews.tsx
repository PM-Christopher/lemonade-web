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
        <p className="text-[14px] font-normal text-light-black">{review?.description}</p>
        <div className="flex items-center justify-between">
          <div className="mt-[14px] flex items-center gap-[8px]">
            <div className="rounded-[6px] border-[1px]">
              <Image
                src={review.user.avatar}
                alt="avatar"
                width={16}
                height={16}
                className="h-[16px] w-[16px] rounded-[6px] border-[1px] border-grey-90"
              />
            </div>
            <p className="text-[12px] font-semibold text-text-grey">{review?.user?.username}</p>
            <DotIcon className="h-[2px] w-[2px]" />
            <p className="text-[12px] font-normal text-text-grey">{review?.created_at}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 rounded-[12px] bg-mid-grey p-[4px] px-[6px]">
              <RatingIcon />
              <p className="text-[12px] font-semibold">{formatDecimal(review?.rating, 1)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-[24px] border-t-[1px] border-t-mid-grey"></div>
    </>
  );
};

export default Reviews;
