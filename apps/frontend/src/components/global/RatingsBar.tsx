import React from 'react';

interface RatingCount {
    rating: number; // Represents the rating (1-5)
    count: number;  // Represents the count of reviews for that rating
}

interface Ratings {
    ratings: RatingCount[]
    max_count: number
}

const RatingsBar = ({ratings, max_count}: Ratings) => {
    return (
        <div className="flex flex-col">
            {
                ratings?.map((rating, index) => {
                    const barWidth = rating.count > 0 ? (rating.count / max_count) * 100 : 0; // Calculate width percentage

                    return (
                        <div className="flex items-center justify-between gap-[8px] mb-[2px]" key={index}>
                            <p className="font-semi-normal text-[12px] text-center">
                                {rating.rating}
                            </p>
                            <div className="w-[130px] h-[6px] rounded-[20px] bg-mid-grey">
                                <div
                                    className="bg-yellow-tint-2 h-[6px] rounded-full"
                                    style={{width: `${barWidth}%`}}></div>
                            </div>
                            <p className="font-normal text-text-grey text-[12px] text-center">
                                {rating.count}
                            </p>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default RatingsBar;