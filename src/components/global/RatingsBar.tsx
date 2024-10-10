import React from 'react';

const RatingsBar = () => {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-[2px]">
                <p className="font-semi-normal text-[12px] text-center">5</p>
                <div className="w-[130px] h-[6px] rounded-[20px] bg-mid-grey">
                    <div
                        className="bg-yellow-tint-2 h-[6px] rounded-full"
                        style={{width: "55%"}}></div>
                </div>
                <p className="font-normal text-text-grey text-[12px]">300</p>
            </div>
            <div className="flex items-center gap-2 mb-[2px]">
                <p className="font-semi-normal text-[12px] text-center">4</p>
                <div className="w-[130px] h-[6px] rounded-[20px] bg-mid-grey">
                    <div
                        className="bg-yellow-tint-2 h-[6px] rounded-full"
                        style={{width: "20%"}}></div>
                </div>
                <p className="font-normal text-text-grey text-[12px]">40</p>
            </div>
            <div className="flex items-center gap-2 mb-[2px]">
                <p className="font-semi-normal text-[12px] text-center">3</p>
                <div className="w-[130px] h-[6px] rounded-[20px] bg-mid-grey">
                    <div
                        className="bg-yellow-tint-2 h-[6px] rounded-full"
                        style={{width: "15%"}}></div>
                </div>
                <p className="font-normal text-text-grey text-[12px]">15</p>
            </div>
            <div className="flex items-center gap-2 mb-[2px]">
                <p className="font-semi-normal text-[12px] text-center">2</p>
                <div className="w-[130px] h-[6px] rounded-[20px] bg-mid-grey">
                    <div
                        className="bg-yellow-tint-2 h-[6px] rounded-full"
                        style={{width: "10%"}}></div>
                </div>
                <p className="font-normal text-text-grey text-[12px]">20</p>
            </div>
            <div className="flex items-center gap-2 mb-[2px]">
                <p className="font-semi-normal text-[12px] text-center mr-[3px]">1</p>
                <div className="w-[130px] h-[6px] rounded-[20px] bg-mid-grey">
                    <div
                        className="bg-yellow-tint-2 h-[6px] rounded-full"
                        style={{width: "5%"}}></div>
                </div>
                <p className="font-normal text-text-grey text-[12px]">1</p>
            </div>
        </div>
    );
}

export default RatingsBar;