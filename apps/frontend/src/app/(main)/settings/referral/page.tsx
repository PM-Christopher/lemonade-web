// "use client";
// import React, { useState } from "react";
// import TopNav from "@/components/navigation/TopNav";
// import ChevronLeft from "@/images/icons/chevron-left.svg";
// import Image from "next/image";
// import CopyIcon from "@/images/icons/copyGreenIcon.svg";
// import ShareIcon from "@/images/icons/shareGreenIcon.svg";
// import ReferralIcon from "@/images/icons/referralGreenIcon.svg";
// import LongLine from "@/images/icons/longLine.svg";
// import ChevronRight from "@/images/icons/chevronRight.svg";
// import ReferralHistory from "@/components/settings/Modal/ReferralHistory";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import MainLayout from "@/components/layouts/MainLayout";

// function ReferralSettingsPage({}) {
//   const router = useRouter();
//   const { user } = useSelector((state: any) => state.auth);
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleModal = () => {
//     setIsOpen(!isOpen);
//   };
//   return (
//     <MainLayout>
//       <section className="bg-light_grey pb-10">
//         <div className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center">
//           <div
//             className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
//             onClick={() => router.push("/settings")}
//           >
//             <ChevronLeft />
//             <p className="font-sans font-semibold text-[16px] tracking-custom">
//               Referrals
//             </p>
//           </div>
//         </div>
//         <section className="mt-4 flex flex-col items-center">
//           <div className="flex flex-col items-center gap-0 laptop:gap-[16px]">
//             <div className="bg-light-green-10 rounded-[12px]">
//               <div className="w-full laptop:w-[560px] p-[24px] flex justify-center items-center">
//                 <Image
//                   src={"/images/giftImage.png"}
//                   alt="gift_image"
//                   width={160}
//                   height={171}
//                 />
//               </div>
//               <div className="w-screen laptop:w-[560px] p-[24px] flex flex-col gap-[8px]">
//                 <div className="flex justify-between items-center gap-[2px]">
//                   <div className="rounded-tl-[12px] rounded-bl-[12px] px-[12px] p-[10.5px] bg-light-tint-4 w-full">
//                     <p className="font-bold text-[18px] text-mid-green">
//                       {user.username.toUpperCase()}
//                     </p>
//                   </div>
//                   <div className="rounded-tr-[12px] rounded-br-[12px] px-[12px] bg-light-tint-4 w-fit items-center flex h-[48px]">
//                     <CopyIcon />
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center gap-[2px]">
//                   <div className="rounded-tl-[12px] rounded-bl-[12px] px-[12px] h-[48px] bg-light-tint-4 w-full items-center flex">
//                     <p className="font-semi-normal text-[14px] text-mid-green">
//                       https://app.lemonade.com/ref=?{user.username}
//                     </p>
//                   </div>
//                   <div className="rounded-tr-[12px] rounded-br-[12px] px-[12px] bg-light-tint-4 w-fit items-center flex h-[48px]">
//                     <ShareIcon />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="w-screen laptop:w-[560px] p-[24px] flex flex-col gap-[8px] mt-0 laptop:mt-[24px] bg-white rounded-[12px]">
//               <p className="font-semibold text-[16px]">
//                 Refer friends and earn
//               </p>
//               <div className="flex flex-col mt-[24px]">
//                 <div className="flex gap-[16px]">
//                   <div className="bg-light-green-10 p-[12px] rounded-[12px]">
//                     <ReferralIcon className="w-[24px] h-[24px]" />
//                   </div>
//                   <div className="flex flex-col">
//                     <p className="font-semibold text-[16px]">
//                       2% of the subscription fee
//                     </p>
//                     <p className="font-normal text-[14px] text-text-grey">
//                       When they subscribe to Membership
//                     </p>
//                   </div>
//                 </div>
//                 <div className="relative left-[21px]">
//                   <LongLine className="w-[4px] h-[48px]" />
//                 </div>
//                 <div className="flex gap-[16px]">
//                   <div className="bg-light-green-10 p-[12px] rounded-[12px]">
//                     <ReferralIcon className="w-[24px] h-[24px]" />
//                   </div>
//                   <div className="flex flex-col">
//                     <p className="font-semibold text-[16px]">
//                       2% of the renewal fee
//                     </p>
//                     <p className="font-normal text-[14px] text-text-grey">
//                       When they renew their Subscription
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className="flex justify-between items-center mt-[24px] cursor-pointer"
//                 onClick={toggleModal}
//               >
//                 <p className="font-semi-normal text-[16px]">
//                   Referral activity
//                 </p>
//                 <ChevronRight />
//               </div>
//             </div>
//           </div>
//         </section>
//         <ReferralHistory toggle={toggleModal} isOpen={isOpen} />
//       </section>
//     </MainLayout>
//   );
// }

// export default ReferralSettingsPage;

"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CopyIcon from "@/images/icons/copyGreenIcon.svg";
import ShareIcon from "@/images/icons/shareGreenIcon.svg";
import ReferralIcon from "@/images/icons/referralGreenIcon.svg";
import LongLine from "@/images/icons/longLine.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import ReferralHistory from "@/components/settings/Modal/ReferralHistory";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";

function ReferralSettingsPage() {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const referralLink = `https://app.lemonade.com/ref=?${user.username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.username);
    alert("Referral link copied to clipboard!");
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`Join Lemonade using my referral link: ${referralLink}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleTelegramShare = () => {
    const message = encodeURIComponent(`Join Lemonade using my referral link: ${referralLink}`);
    window.open(`https://t.me/share/url?url=${referralLink}&text=${message}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Lemonade Referral",
          text: "Join Lemonade using my referral link!",
          url: referralLink,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] bg-white p-[8px] px-[16px] laptop:px-[64px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.push("/settings")}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">Referrals</p>
          </div>
        </div>

        <section className="mt-4 flex flex-col items-center">
          <div className="flex flex-col items-center gap-0 laptop:gap-[16px]">
            <div className="rounded-[12px] bg-light-green-10">
              <div className="flex w-full items-center justify-center p-[24px] laptop:w-[560px]">
                <Image src={"/images/giftImage.png"} alt="gift_image" width={160} height={171} />
              </div>

              <div className="flex w-screen flex-col gap-[8px] p-[24px] laptop:w-[560px]">
                {/* Username Row */}
                <div className="flex items-center justify-between gap-[2px]">
                  <div className="w-full rounded-bl-[12px] rounded-tl-[12px] bg-light-tint-4 p-[10.5px] px-[12px]">
                    <p className="text-[18px] font-bold text-mid-green">
                      {user.username.toUpperCase()}
                    </p>
                  </div>
                  <div
                    className="flex h-[48px] w-fit cursor-pointer items-center rounded-br-[12px] rounded-tr-[12px] bg-light-tint-4 px-[12px]"
                    onClick={handleCopy}
                  >
                    <CopyIcon />
                  </div>
                </div>

                {/* Referral Link Row */}
                <div className="relative flex items-center justify-between gap-[2px]">
                  <div className="flex h-[48px] w-full items-center rounded-bl-[12px] rounded-tl-[12px] bg-light-tint-4 px-[12px]">
                    <p className="truncate text-[14px] font-semi-normal text-mid-green">
                      {referralLink}
                    </p>
                  </div>
                  <div
                    className="flex h-[48px] w-fit cursor-pointer items-center rounded-br-[12px] rounded-tr-[12px] bg-light-tint-4 px-[12px]"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                  >
                    <ShareIcon />
                  </div>
                </div>

                {/* Share Options */}
                {showShareOptions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={handleWhatsAppShare}
                      className="rounded-md bg-green-100 px-3 py-1 text-sm text-green-700"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={handleTelegramShare}
                      className="rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-700"
                    >
                      Telegram
                    </button>
                    <button
                      onClick={handleNativeShare}
                      className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      Other
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Reward Breakdown */}
            <div className="mt-0 flex w-screen flex-col gap-[8px] rounded-[12px] bg-white p-[24px] laptop:mt-[24px] laptop:w-[560px]">
              <p className="text-[16px] font-semibold">Refer friends and earn</p>

              <div className="mt-[24px] flex flex-col">
                <div className="flex gap-[16px]">
                  <div className="rounded-[12px] bg-light-green-10 p-[12px]">
                    <ReferralIcon className="h-[24px] w-[24px]" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[16px] font-semibold">2% of the subscription fee</p>
                    <p className="text-[14px] font-normal text-text-grey">
                      When they subscribe to Membership
                    </p>
                  </div>
                </div>

                <div className="relative left-[21px]">
                  <LongLine className="h-[48px] w-[4px]" />
                </div>

                <div className="flex gap-[16px]">
                  <div className="rounded-[12px] bg-light-green-10 p-[12px]">
                    <ReferralIcon className="h-[24px] w-[24px]" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[16px] font-semibold">2% of the renewal fee</p>
                    <p className="text-[14px] font-normal text-text-grey">
                      When they renew their Subscription
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="mt-[24px] flex cursor-pointer items-center justify-between"
                onClick={toggleModal}
              >
                <p className="text-[16px] font-semi-normal">Referral activity</p>
                <ChevronRight />
              </div>
            </div>
          </div>
        </section>

        <ReferralHistory toggle={toggleModal} isOpen={isOpen} />
      </section>
    </MainLayout>
  );
}

export default ReferralSettingsPage;
