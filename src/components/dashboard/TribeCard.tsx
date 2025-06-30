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
       <div className="flex flex-col bg-light-yellow p-4 rounded-2xl w-[422px] shadow-none h-[200px]"> 
  <div className="flex-shrink-0"> 
    <Image 
      src={tribe?.image} 
      alt="forum_icon" 
      width={48} 
      height={48}
      className="w-12 h-12 rounded-lg object-cover" 
    />
  </div>
  
  <div className="mt-2 flex justify-between flex-1"> 
    <div className="flex-1 min-w-0"> 
      <p className="text-text-grey text-xs font-semibold font-sans truncate">
        {tribe?.tribe_name}
      </p>
      <p className="text-xs font-semibold font-sans text-ellipsis max-w-[329.33px] truncate mt-1 leading-relaxed">
        {tribe?.description}
      </p>
    </div>
    <div className="flex-shrink-0 ml-2">
      {/*<Image src={"/images/forum_image.png"} alt="" width={48} height={48}/>*/}
    </div>
  </div>
  
  <div className="mt-auto pt-2 flex justify-between"> 
    <div className="flex gap-2">
      <div className="flex justify-between items-center gap-1">
        <Image 
          src={"/images/heart.png"} 
          alt="like" 
          width={16} 
          height={16} 
          className="w-4 h-4" 
        />
        <p className="font-sans text-sm font-semi-normal text-light-black">
          {tribe?.likes}
        </p>
      </div>
      <div className="flex justify-between items-center gap-1">
        <Image 
          src={"/images/chat.png"} 
          alt="comment" 
          width={16} 
          height={16}
          className="w-4 h-4"
        />
        <p className="font-sans text-sm font-semi-normal text-light-black">
          {tribe?.comments}
        </p>
      </div>
    </div>
    
    <div 
      className="flex justify-between items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity" 
      onClick={() => router.push(`tribe/${tribe?.slug}`)}
    >
      <p className="font-sans text-sm font-semi-normal text-light-green">View</p>
      <Image 
        src={"/images/arrow-left.png"} 
        alt="arrow left" 
        width={12.5} 
        height={12.5}
        className="w-3 h-3"
      />
    </div>
  </div>
</div>
    );
}

export default TribeCard;