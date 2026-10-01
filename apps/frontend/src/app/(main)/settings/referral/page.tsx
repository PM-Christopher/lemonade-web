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
//         <div className="bg-white flex justify-between p-2 px-4 laptop:px-16 border-t border-b items-center">
//           <div
//             className="flex gap-2 p-1 pl-1 pr-4 items-center rounded-xl cursor-pointer"
//             onClick={() => router.push("/settings")}
//           >
//             <ChevronLeft />
//             <p className="font-sans font-semibold text-[16px] tracking-custom">
//               Referrals
//             </p>
//           </div>
//         </div>
//         <section className="mt-4 flex flex-col items-center">
//           <div className="flex flex-col items-center gap-0 laptop:gap-4">
//             <div className="bg-light-green-10 rounded-xl">
//               <div className="w-full laptop:w-[560px] p-6 flex justify-center items-center">
//                 <Image
//                   src={"/images/giftImage.png"}
//                   alt="gift_image"
//                   width={160}
//                   height={171}
//                 />
//               </div>
//               <div className="w-screen laptop:w-[560px] p-6 flex flex-col gap-2">
//                 <div className="flex justify-between items-center gap-0.5">
//                   <div className="rounded-tl-xl rounded-bl-xl px-3 p-[10.5px] bg-light-tint-4 w-full">
//                     <p className="font-bold text-[18px] text-mid-green">
//                       {user.username.toUpperCase()}
//                     </p>
//                   </div>
//                   <div className="rounded-tr-xl rounded-br-xl px-3 bg-light-tint-4 w-fit items-center flex h-12">
//                     <CopyIcon />
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center gap-0.5">
//                   <div className="rounded-tl-xl rounded-bl-xl px-3 h-12 bg-light-tint-4 w-full items-center flex">
//                     <p className="font-semi-normal text-[14px] text-mid-green">
//                       https://app.lemonade.com/ref=?{user.username}
//                     </p>
//                   </div>
//                   <div className="rounded-tr-xl rounded-br-xl px-3 bg-light-tint-4 w-fit items-center flex h-12">
//                     <ShareIcon />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="w-screen laptop:w-[560px] p-6 flex flex-col gap-2 mt-0 laptop:mt-6 bg-white rounded-xl">
//               <p className="font-semibold text-[16px]">
//                 Refer friends and earn
//               </p>
//               <div className="flex flex-col mt-6">
//                 <div className="flex gap-4">
//                   <div className="bg-light-green-10 p-3 rounded-xl">
//                     <ReferralIcon className="w-6 h-6" />
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
//                   <LongLine className="w-1 h-12" />
//                 </div>
//                 <div className="flex gap-4">
//                   <div className="bg-light-green-10 p-3 rounded-xl">
//                     <ReferralIcon className="w-6 h-6" />
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
//                 className="flex justify-between items-center mt-6 cursor-pointer"
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
        <div className="laptop:px-16 flex items-center justify-between border-t border-b bg-white p-2 px-4">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => router.push("/settings")}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Referrals</p>
          </div>
        </div>

        <section className="mt-4 flex flex-col items-center">
          <div className="laptop:gap-4 flex flex-col items-center gap-0">
            <div className="bg-light-green-10 rounded-xl">
              <div className="laptop:w-[560px] flex w-full items-center justify-center p-6">
                <Image src={"/images/giftImage.png"} alt="gift_image" width={160} height={171} />
              </div>

              <div className="laptop:w-[560px] flex w-screen flex-col gap-2 p-6">
                {/* Username Row */}
                <div className="flex items-center justify-between gap-0.5">
                  <div className="bg-light-tint-4 w-full rounded-tl-xl rounded-bl-xl p-[10.5px] px-3">
                    <p className="text-mid-green text-[18px] font-bold">
                      {user.username.toUpperCase()}
                    </p>
                  </div>
                  <div
                    className="bg-light-tint-4 flex h-12 w-fit cursor-pointer items-center rounded-tr-xl rounded-br-xl px-3"
                    onClick={handleCopy}
                  >
                    <CopyIcon />
                  </div>
                </div>

                {/* Referral Link Row */}
                <div className="relative flex items-center justify-between gap-0.5">
                  <div className="bg-light-tint-4 flex h-12 w-full items-center rounded-tl-xl rounded-bl-xl px-3">
                    <p className="font-semi-normal text-mid-green truncate text-[14px]">
                      {referralLink}
                    </p>
                  </div>
                  <div
                    className="bg-light-tint-4 flex h-12 w-fit cursor-pointer items-center rounded-tr-xl rounded-br-xl px-3"
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
            <div className="laptop:mt-6 laptop:w-[560px] mt-0 flex w-screen flex-col gap-2 rounded-xl bg-white p-6">
              <p className="text-[16px] font-semibold">Refer friends and earn</p>

              <div className="mt-6 flex flex-col">
                <div className="flex gap-4">
                  <div className="bg-light-green-10 rounded-xl p-3">
                    <ReferralIcon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[16px] font-semibold">2% of the subscription fee</p>
                    <p className="text-text-grey text-[14px] font-normal">
                      When they subscribe to Membership
                    </p>
                  </div>
                </div>

                <div className="relative left-[21px]">
                  <LongLine className="h-12 w-1" />
                </div>

                <div className="flex gap-4">
                  <div className="bg-light-green-10 rounded-xl p-3">
                    <ReferralIcon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[16px] font-semibold">2% of the renewal fee</p>
                    <p className="text-text-grey text-[14px] font-normal">
                      When they renew their Subscription
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="mt-6 flex cursor-pointer items-center justify-between"
                onClick={toggleModal}
              >
                <p className="font-semi-normal text-[16px]">Referral activity</p>
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
