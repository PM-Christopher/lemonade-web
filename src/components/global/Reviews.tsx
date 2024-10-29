import React from 'react';
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import RatingIcon from "@/images/icons/ratingIcon.svg";
import {formatDecimal} from "@/lib/helper";

interface User {
    id: number;
    username: string;
    avatar: string;
}

interface Review {
    user: User;
    title: string;
    description: string;
    rating: number;
    created_at: string
}


interface ReviewInterface {
    review: Review
}

const Reviews: React.FC<ReviewInterface> = ({review}) => {
    return (
        <>
            <div className="">
                <p className="font-semibold text-[14px]">{review?.title}</p>
                <p className="font-normal text-[14px] text-light-black">
                    {review?.description}
                </p>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-[8px] mt-[14px]">
                        <div className="rounded-[6px] border-[1px]">
                            <Image src={review.user.avatar} alt="avatar" width={16} height={16} className="w-[16px] h-[16px] rounded-[6px] border-[1px] border-grey-90" />
                        </div>
                        <p className="font-semibold text-[12px] text-text-grey">
                            {review?.user?.username}
                        </p>
                        <DotIcon className="w-[2px] h-[2px]"/>
                        <p className="font-normal text-[12px] text-text-grey">
                            {review?.created_at}
                        </p>
                    </div>
                    <div>
                        <div
                            className="flex items-center gap-2 p-[4px] px-[6px] bg-mid-grey rounded-[12px]">
                            <RatingIcon/>
                            <p className="font-semibold text-[12px]">
                                {formatDecimal(review?.rating, 1)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
        </>
    );
}

export default Reviews;