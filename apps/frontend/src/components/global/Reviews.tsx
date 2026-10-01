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
          <div className="mt-3.5 flex items-center gap-2">
            <div className="rounded-[6px] border">
              <Image
                src={review.user.avatar}
                alt="avatar"
                width={16}
                height={16}
                className="border-grey-90 h-4 w-4 rounded-[6px] border"
              />
            </div>
            <p className="text-text-grey text-[12px] font-semibold">{review?.user?.username}</p>
            <DotIcon className="h-0.5 w-0.5" />
            <p className="text-text-grey text-[12px] font-normal">{review?.created_at}</p>
          </div>
          <div>
            <div className="bg-mid-grey flex items-center gap-2 rounded-xl p-1 px-1.5">
              <RatingIcon />
              <p className="text-[12px] font-semibold">{formatDecimal(review?.rating, 1)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-mid-grey my-6 border-t"></div>
    </>
  );
};

export default Reviews;
