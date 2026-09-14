import React from "react";

interface RatingCount {
  rating: number; // Represents the rating (1-5)
  count: number; // Represents the count of reviews for that rating
}

interface Ratings {
  ratings: RatingCount[];
  max_count: number;
}

const RatingsBar = ({ ratings, max_count }: Ratings) => {
  return (
    <div className="flex flex-col">
      {ratings?.map((rating, index) => {
        const barWidth = rating.count > 0 ? (rating.count / max_count) * 100 : 0; // Calculate width percentage

        return (
          <div className="mb-[2px] flex items-center justify-between gap-[8px]" key={index}>
            <p className="text-center text-[12px] font-semi-normal">{rating.rating}</p>
            <div className="h-[6px] w-[130px] rounded-[20px] bg-mid-grey">
              <div
                className="h-[6px] rounded-full bg-yellow-tint-2"
                style={{ width: `${barWidth}%` }}
              ></div>
            </div>
            <p className="text-center text-[12px] font-normal text-text-grey">{rating.count}</p>
          </div>
        );
      })}
    </div>
  );
};

export default RatingsBar;
