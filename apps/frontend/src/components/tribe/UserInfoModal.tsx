import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import ChatIcon from "@/images/icons/chatIcon.svg";
import { formatString, getInitials } from "@/lib/helper";
import { TribeInterface } from "@/interfaces/TribeInterface";
import { useAppDispatch } from "@/redux/hook";
import { useSelector } from "react-redux";
import { useSendInviteMutation } from "@/features/connect/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import Link from "next/link";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type UserInfoInterface = {
  toggle: () => void;
  isOpen: boolean;
  user: any;
  tribe: TribeInterface | any;
};

const UserInfoModal: React.FC<UserInfoInterface> = ({ toggle, isOpen, user, tribe }) => {
  const dispatch = useAppDispatch();
  const sendInviteMutation = useSendInviteMutation();

  const sendConnect = () => {
    sendInviteMutation.mutate(
      { message: "I want to connect with you.", invitee_id: user?.id },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Connect request sent",
              type: "success",
            }),
          );
          toggle();
        },
        onError: (err: any) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: err?.message || "Something went wrong",
              type: "error",
            }),
          );
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">User Info</DialogTitle>
        <div className="w-[480px] rounded-lg bg-white p-6 shadow-lg">
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
              {user?.profile_image ? (
                <Image
                  src={user?.profile_image}
                  alt="check in"
                  width={64}
                  height={64}
                  className="border-grey-90 h-16 w-16 rounded-3xl border"
                />
              ) : (
                <div className="bg-gradient-green flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3B4152] text-sm font-medium text-white transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                  <p className="font-ruso text-[18px]">{getInitials(user?.fullname)}</p>
                </div>
              )}

              <p className="mt-4 text-[18px] font-semibold">{user?.username}</p>
              <p className="text-text-grey text-[12px] font-normal">
                {formatString(user?.industry)}
              </p>
              <p className="text-light-black mt-4 max-w-[416px] text-center text-[14px] font-normal">
                {user?.bio}
              </p>
              {user?.socials.length > 0 && (
                <div className="mt-4">
                  <p className="text-center text-[14px] font-semibold">Social links</p>
                  <div className="mt-3 flex gap-4">
                    {user?.socials.map((link: any) => (
                      <a
                        href={link.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={link.name}
                      >
                        {link.name === "facebook" && <FacebookIcon className="w-6" />}
                        {link.name === "instagram" && <InstagramIcon className="w-6" />}
                        {link.name === "linkedin" && <LinkedInIcon className="w-6" />}
                        {link.name === "twitter" && <TwitterIcon className="w-6" />}
                        {link.name === "website" && <WebIcon className="w-6" />}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {!tribe?.owner &&
                (user?.has_connected ? (
                  <Link href={"/connect"}>
                    <div className="mt-4">
                      <div className="border-light-grey-50 flex h-12 w-[343px] cursor-pointer items-center justify-center gap-2 rounded-xl border p-3.5 px-12">
                        <ChatIcon />
                        <p className="font-semi-normal text-black-light text-[16px]">Open chat</p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="mt-4">
                    <div
                      className="border-light-grey-50 flex h-12 w-[343px] cursor-pointer items-center justify-center gap-2 rounded-xl border p-3.5 px-12"
                      onClick={sendConnect}
                    >
                      <p className="font-semi-normal text-black-light text-[16px]">Send request</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default UserInfoModal;
