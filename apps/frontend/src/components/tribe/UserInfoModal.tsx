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
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="w-[480px] rounded-lg bg-white p-6 shadow-lg">
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
            {user?.profile_image ? (
              <Image
                src={user?.profile_image}
                alt="check in"
                width={64}
                height={64}
                className="h-[64px] w-[64px] rounded-[24px] border-[1px] border-grey-90"
              />
            ) : (
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-[2px] border-[#3B4152] bg-gradient-green text-sm font-medium text-white transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                <p className="font-ruso text-[18px]">{getInitials(user?.fullname)}</p>
              </div>
            )}

            <p className="mt-[16px] text-[18px] font-semibold">{user?.username}</p>
            <p className="text-[12px] font-normal text-text-grey">{formatString(user?.industry)}</p>
            <p className="mt-[16px] max-w-[416px] text-center text-[14px] font-normal text-light-black">
              {user?.bio}
            </p>
            {user?.socials.length > 0 && (
              <div className="mt-[16px]">
                <p className="text-center text-[14px] font-semibold">Social links</p>
                <div className="mt-[12px] flex gap-[16px]">
                  {user?.socials.map((link: any) => (
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
            )}
            {!tribe?.owner &&
              (user?.has_connected ? (
                <Link href={"/connect"}>
                  <div className="mt-[16px]">
                    <div className="flex h-[48px] w-[343px] cursor-pointer items-center justify-center gap-[8px] rounded-[12px] border-[1px] border-light-grey-50 p-[14px] px-[48px]">
                      <ChatIcon />
                      <p className="text-[16px] font-semi-normal text-black-light">Open chat</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="mt-[16px]">
                  <div
                    className="flex h-[48px] w-[343px] cursor-pointer items-center justify-center gap-[8px] rounded-[12px] border-[1px] border-light-grey-50 p-[14px] px-[48px]"
                    onClick={sendConnect}
                  >
                    <p className="text-[16px] font-semi-normal text-black-light">Send request</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;
