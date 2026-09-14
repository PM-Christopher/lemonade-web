import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import { formatString } from "@/lib/helper";

type UserInfoInterface = {
  toggle: () => void;
  isOpen: boolean;
  userInfo: any;
};

const UserInfoModal: React.FC<UserInfoInterface> = ({ toggle, isOpen, userInfo }) => {
  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="h-screen w-screen overflow-y-auto rounded-none bg-white p-6 shadow-lg laptop:h-auto laptop:max-h-[90vh] laptop:w-[480px] laptop:rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon className="w-[11.25px]" />
            </div>
            <p className="text-[16px] font-semibold">User Info</p>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col items-center justify-center">
            <Image
              src={userInfo?.receiver?.avatar}
              alt="check in"
              width={64}
              height={64}
              className="h-[64px] w-[64px] rounded-[24px] border-[1px] border-grey-90"
            />
            <p className="mt-[16px] text-[18px] font-semibold">{userInfo?.receiver?.username}</p>
            <p className="text-[14px] font-semi-normal text-light-black">
              Lemon {userInfo?.receiver?.lemon_id} (L
              {userInfo?.receiver?.lemon_id})
            </p>
            <p className="text-[12px] font-normal text-text-grey">
              {formatString(userInfo?.receiver?.industry)}
            </p>
            <div className="mt-[16px] flex items-center gap-2">
              <LocationIcon />
              <p className="text-[12px] font-semi-normal text-mid-green">3kms away</p>
              <p className="text-grey-80">|</p>
              <div className="rounded-[8px] bg-light-green-10 p-[4px] px-[8px]">
                <p className="text-[12px] font-semi-normal text-mid-green">connected</p>
              </div>
            </div>
            <p className="mt-[16px] max-w-[416px] text-center text-[14px] font-normal text-light-black">
              {userInfo?.receiver?.bio}
            </p>
            <div className="mt-[16px]">
              <p className="text-center text-[14px] font-semibold">Social links</p>
              <div className="mt-[12px] flex justify-center gap-[16px]">
                {userInfo?.receiver?.socials?.map((link: any) => (
                  <a href={link.value} target="_blank" rel="noopener noreferrer" key={link.name}>
                    {link.name === "facebook" && <FacebookIcon className="w-[24px]" />}
                    {link.name === "instagram" && <InstagramIcon className="w-[24px]" />}
                    {link.name === "linkedin" && <LinkedInIcon className="w-[24px]" />}
                    {link.name === "twitter" && <TwitterIcon className="w-[24px]" />}
                    {link.name === "website" && <WebIcon className="w-[24px]" />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;
