import { routes } from "@/lib/routes";
import { appUrl } from "@/lib/app-url";
import React, { useState } from "react";
import { TribeInterface } from "@/interfaces/TribeInterface";
import CloseIcon from "@/images/icons/close.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import WhatsAppIcon from "@/images/icons/whatsappIcon.svg";
import TelegramIcon from "@/images/icons/telegramIcon.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";

type ShareTribeInterface = {
  toggle: () => void;
  isOpen: boolean;
  tribe: TribeInterface | null;
};

const ShareTribeModal: React.FC<ShareTribeInterface> = ({ toggle, isOpen, tribe }) => {
  const tribeUrl = appUrl(routes.TRIBE_DETAIL(tribe?.slug ?? ""));
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Copied to clipboard",
          type: "success",
        }),
      );
      setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    });
  };

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(tribeUrl);
    const messageText = "Check this tribe out";
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://x.com/intent/tweet?url=${encodedUrl}&text=Check this out!`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${messageText} ${encodedUrl}`;
        break;
      case "instagram":
        alert("Instagram does not support direct web sharing.");
        return;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${messageText}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Share tribe</DialogTitle>
        <div className="laptop:w-120 flex w-screen flex-col rounded-xl bg-white">
          <div className={`p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="cursor-pointer" onClick={toggle}>
                  <CloseIcon />
                </div>
                <p className="font-semiBold">Share tribe</p>
              </div>
            </div>
          </div>
          <div className={`flex flex-col gap-2 p-6`}>
            <p>Share this tribe via</p>
            <div className="flex justify-between">
              <div
                className="hover:bg-grey-20 flex cursor-pointer items-center justify-center rounded-full border p-3.75"
                onClick={() => shareToSocial("facebook")}
              >
                <FacebookIcon className="" />
              </div>
              <div
                className="hover:bg-grey-20 flex cursor-pointer items-center justify-center rounded-full border p-3.75"
                onClick={() => shareToSocial("twitter")}
              >
                <TwitterIcon className="" />
              </div>
              <div
                className="hover:bg-grey-20 flex cursor-pointer items-center justify-center rounded-full border p-3.75"
                onClick={() => shareToSocial("whatsapp")}
              >
                <WhatsAppIcon className="" />
              </div>
              <div
                className="hover:bg-grey-20 flex cursor-pointer items-center justify-center rounded-full border p-3.75"
                onClick={() => shareToSocial("instagram")}
              >
                <InstagramIcon className="" />
              </div>
              <div
                className="hover:bg-grey-20 flex cursor-pointer items-center justify-center rounded-full border p-3.75"
                onClick={() => shareToSocial("telegram")}
              >
                <TelegramIcon className="" />
              </div>
            </div>
            <p>Or copy link</p>
            <div className="border-grey-90 flex w-full items-center justify-between rounded-xl border p-2">
              <div className="w-[full]">
                <p>{tribeUrl}</p>
              </div>
              <Button
                className="bg-gradient-green h-8.75 w-20"
                onClick={() => handleCopy(tribeUrl)}
              >
                <p>{copied ? "Copied!" : "Copy"}</p>
              </Button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default ShareTribeModal;
