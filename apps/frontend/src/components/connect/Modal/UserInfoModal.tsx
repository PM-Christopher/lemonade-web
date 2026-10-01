import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { formatString } from "@/lib/helper";

interface ConnectUserInfo {
  receiver?: {
    avatar?: string;
    username?: string;
    lemon_id?: string;
    industry?: string;
    bio?: string;
    socials?: Array<{ name?: string; value?: string }>;
  };
}

type UserInfoInterface = {
  toggle: () => void;
  isOpen: boolean;
  userInfo: ConnectUserInfo | null;
};

const UserInfoModal: React.FC<UserInfoInterface> = ({ toggle, isOpen, userInfo }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"User Info"}</DialogTitle>
        <div className="laptop:h-auto laptop:max-h-[90vh] laptop:w-[480px] laptop:rounded-lg h-screen w-screen overflow-y-auto rounded-none bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon className="w-[11.25px]" />
              </div>
              <p className="text-[16px] font-semibold">User Info</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col items-center justify-center">
              <Image
                src={userInfo?.receiver?.avatar ?? ""}
                alt="check in"
                width={64}
                height={64}
                className="border-grey-90 h-16 w-16 rounded-3xl border"
              />
              <p className="mt-4 text-[18px] font-semibold">{userInfo?.receiver?.username}</p>
              <p className="font-semi-normal text-light-black text-[14px]">
                Lemon {userInfo?.receiver?.lemon_id} (L
                {userInfo?.receiver?.lemon_id})
              </p>
              <p className="text-text-grey text-[12px] font-normal">
                {formatString(userInfo?.receiver?.industry)}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <LocationIcon />
                <p className="font-semi-normal text-mid-green text-[12px]">3kms away</p>
                <p className="text-grey-80">|</p>
                <div className="bg-light-green-10 rounded-[8px] p-1 px-2">
                  <p className="font-semi-normal text-mid-green text-[12px]">connected</p>
                </div>
              </div>
              <p className="text-light-black mt-4 max-w-[416px] text-center text-[14px] font-normal">
                {userInfo?.receiver?.bio}
              </p>
              <div className="mt-4">
                <p className="text-center text-[14px] font-semibold">Social links</p>
                <div className="mt-3 flex justify-center gap-4">
                  {userInfo?.receiver?.socials?.map((link) => (
                    <a href={link.value} target="_blank" rel="noopener noreferrer" key={link.name}>
                      {link.name === "facebook" && <FacebookIcon className="w-6" />}
                      {link.name === "instagram" && <InstagramIcon className="w-6" />}
                      {link.name === "linkedin" && <LinkedInIcon className="w-6" />}
                      {link.name === "twitter" && <TwitterIcon className="w-6" />}
                      {link.name === "website" && <WebIcon className="w-6" />}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default UserInfoModal;
