import React from 'react';
import Image from "next/image";
import {TribeInterface} from "@/interfaces/TribeInterface";
import {useRouter} from "next/navigation";

type TribeIF = {
    tribe: TribeInterface
}

const TribeCard: React.FC<TribeIF> = ({tribe}) => {
    const router = useRouter()
    return (
        <div className="flex flex-col bg-light-yellow p-[16px] px-[16px] rounded-2xl w-[422px] shadow-none">
            <div>
                <Image src={"/images/forum_icon.png"} alt="forum_icon" width={48} height={48}/>
            </div>
            <div className="mt-2 flex justify-between">
                <div>
                    <p className="text-text-grey text-[12px] font-semibold font-sans">
                        {tribe?.tribe_name}
                    </p>
                    <p className="text-[12px] font-semibold font-sans text-ellipsis max-w-[329.33px] truncate">
                        {tribe?.description}
                    </p>
                </div>
                <div>
                    <Image src={"/images/forum_image.png"} alt="" width={48} height={48}/>
                </div>
            </div>
            <div className="mt-2 flex justify-between">
                <div className="flex gap-2">
                    <div className="flex justify-between items-center gap-1">
                        <div>
                            <Image src={"/images/heart.png"} alt="like" width={16} height={16} className="w-[16px] h-[16px]" />
                        </div>
                        <div>
                            <p className="font-sans text-[14px] font-semi-normal text-light-black">120</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                        <div>
                            <Image src={"/images/chat.png"} alt="comment" width={16} height={16}/>
                        </div>
                        <div>
                            <p className="font-sans text-[14px] font-semi-normal text-light-black">15</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center gap-1 cursor-pointer" onClick={() => router.push(`tribe/${tribe?.id}`)}>
                    <div>
                        <p className="font-sans text-[14px] font-semi-normal text-light-green">View</p>
                    </div>
                    <div>
                        <Image src={"/images/arrow-left.png"} alt="arrow left" width={12.5} height={12.5}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TribeCard;