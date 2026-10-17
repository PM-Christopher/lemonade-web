import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { SocialLinks } from "@/components/global/SocialLinks";
import { formatString } from "@/lib/helper";

interface ConnectUserInfo {
  receiver?: {
    avatar?: string;
    username?: string;
    lemon_id?: string;
    industry?: string | null;
    bio?: string | null;
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
        <div className="laptop:h-auto laptop:max-h-[90vh] laptop:w-120 laptop:rounded-lg h-screen w-screen overflow-y-auto rounded-none bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon className="w-2.75" />
              </div>
              <p className="text-body-l font-semibold">User Info</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col items-center justify-center">
              <FallbackImage
                src={userInfo?.receiver?.avatar}
                fallbackSrc={images.PLACEHOLDER}
                alt="check in"
                width={64}
                height={64}
                className="border-grey-90 h-16 w-16 rounded-3xl border"
              />
              <p className="text-body-xl mt-4 font-semibold">{userInfo?.receiver?.username}</p>
              <p className="font-semi-normal text-light-black text-body-s">
                Lemon {userInfo?.receiver?.lemon_id} (L
                {userInfo?.receiver?.lemon_id})
              </p>
              <p className="text-text-grey text-meta leading-normal font-normal">
                {formatString(userInfo?.receiver?.industry ?? undefined)}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <LocationIcon />
                <p className="font-semi-normal text-mid-green text-meta leading-normal">
                  3kms away
                </p>
                <p className="text-grey-80">|</p>
                <div className="bg-light-green-10 rounded-lg p-1 px-2">
                  <p className="font-semi-normal text-mid-green text-meta leading-normal">
                    connected
                  </p>
                </div>
              </div>
              <p className="text-light-black text-body-s mt-4 max-w-104 text-center font-normal">
                {userInfo?.receiver?.bio}
              </p>
              <SocialLinks socials={userInfo?.receiver?.socials} />
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default UserInfoModal;
