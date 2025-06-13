import React, {useState} from 'react';
import {TribeInterface} from "@/interfaces/TribeInterface";
import CloseIcon from "@/images/icons/close.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg"
import TwitterIcon from "@/images/icons/twitter-color.svg"
import InstagramIcon from "@/images/icons/instagram-color.svg"
import WhatsAppIcon from "@/images/icons/whatsappIcon.svg"
import TelegramIcon from "@/images/icons/telegramIcon.svg"
import {Button} from "@/components/ui/button";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useAppDispatch} from "@/redux/hook";
import {useRouter} from "next/navigation";


type ShareTribeInterface = {
    toggle: () => void,
    isOpen: boolean,
    tribe: TribeInterface
}

const ShareTribeModal: React.FC<ShareTribeInterface> = ({toggle, isOpen, tribe}) => {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const dispatch = useAppDispatch()

    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Copied to clipboard",
                    type: "success",
                })
            );
            setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
        });
    };

    const shareToSocial = (platform: string) => {


      
        const currentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tribe/${tribe?.slug}`;
        const encodedUrl = encodeURIComponent(currentUrl);
        const messageText = "Check this tribe out"
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://x.com/intent/tweet?url=${encodedUrl}&text=Check this out!`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${messageText} ${encodedUrl}`;
                break;
            case 'instagram':
                alert('Instagram does not support direct web sharing.');
                return;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${messageText}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank');
    };



    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="flex flex-col bg-white rounded-[12px] w-screen laptop:w-[480px]">
                <div className={`p-6`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="cursor-pointer" onClick={toggle}>
                                <CloseIcon/>
                            </div>
                            <p className="font-semiBold">Share tribe</p>
                        </div>
                    </div>
                </div>
                <div className={`p-6 flex flex-col gap-2`}>
                    <p>Share this tribe via</p>
                    <div className="flex justify-between">
                        <div
                            className="flex justify-center items-center p-[15px] rounded-full border-[1px] cursor-pointer hover:bg-grey-20"
                            onClick={() => shareToSocial('facebook')}>
                            <FacebookIcon className=""/>
                        </div>
                        <div
                            className="flex justify-center items-center p-[15px] rounded-full border-[1px] cursor-pointer hover:bg-grey-20"
                            onClick={() => shareToSocial('twitter')}>
                            <TwitterIcon className=""/>
                        </div>
                        <div
                            className="flex justify-center items-center p-[15px] rounded-full border-[1px] cursor-pointer hover:bg-grey-20"
                            onClick={() => shareToSocial('whatsapp')}>
                            <WhatsAppIcon className=""/>
                        </div>
                        <div
                            className="flex justify-center items-center p-[15px] rounded-full border-[1px] cursor-pointer hover:bg-grey-20"
                            onClick={() => shareToSocial('instagram')}>
                            <InstagramIcon className=""/>
                        </div>
                        <div
                            className="flex justify-center items-center p-[15px] rounded-full border-[1px] cursor-pointer hover:bg-grey-20"
                            onClick={() => shareToSocial('telegram')}>
                            <TelegramIcon className=""/>
                        </div>
                    </div>
                    <p>Or copy link</p>
                    <div
                        className="w-full flex rounded-[12px] border-[1px] border-grey-90 justify-between p-[8px] items-center">
                        <div className="w-[full]">
                        <p>{`${process.env.NEXT_PUBLIC_APP_URL}/tribe/${tribe?.slug}`}</p>
                        </div>
                        <Button className="bg-gradient-green w-[80px] h-[35px]"
                                onClick={() => handleCopy(`${process.env.NEXT_PUBLIC_APP_URL}/tribe/${tribe?.slug}`)}>
                            <p>{copied ? "Copied!" : "Copy"}</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareTribeModal;