"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import ClockIcon from "@/images/icons/clock.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import AttachmentIcon from "@/images/icons/attachments.svg";
import { Button } from "@/components/ui/button";
import AffiliateLinkModal from "@/components/events/Modals/AffiliateLinkModal";
import MainLayout from "@/components/layouts/MainLayout";
import { useAppDispatch } from "@/redux/hook";
import { useSelector } from "react-redux";
import { useRequest } from "@/hooks/useRequest";
import { formatNumberWithCommas } from "@/lib/formatNumber";

const AgentDetailsPage = ({ params }: { params: { id: number } }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { authToken } = useSelector((state: any) => state.auth);
  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  };

  const { data, loading } = useRequest(
    `events/affiliate/${params.id}`,
  );

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  type SocialIconName =
    | "facebook"
    | "instagram"
    | "linkedin"
    | "twitter"
    | "website";

  type SocialIconProps = {
    name: string;
    url: string;
  };

  const iconMap: Record<SocialIconName, JSX.Element> = {
    facebook: <FacebookIcon className="w-[24px] h-[24px]" />,
    instagram: <InstagramIcon className="w-[24px] h-[24px]" />,
    linkedin: <LinkedInIcon className="w-[24px] h-[24px]" />,
    twitter: <TwitterIcon className="w-[24px] h-[24px]" />,
    website: <AttachmentIcon className="w-[24px] h-[24px]" />,
  };

  const SocialIcon = ({ name, url }: SocialIconProps) => {
    const icon = iconMap[name.toLowerCase() as SocialIconName];
    if (!icon) return null;

    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="mr-2">
        {icon}
      </a>
    );
  };

  const formatDateParts = (dateString: any) => {
    const date = new Date(dateString);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date); 

    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date); 

    return { formattedDate, formattedTime };
  };


  const start = formatDateParts(data?.events?.start_date || new Date());
const end = formatDateParts(data?.events?.end_date || new Date());

  return (
    <MainLayout>
      <section className="bg-white laptop:bg-light_grey pb-10">
        <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
          <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
            <ChevronLeft />
            <p className="font-semibold text-[16px] tracking-custom">
              Event details
            </p>
          </div>
        </div>
        <section className="mt-0 laptop:mt-4 flex flex-col items-center">
          <div className="flex justify-center">
            <div className="flex flex-col laptop:flex-row w-full laptop:w-[1312px] bg-white rounded-[16px] laptop:items-center gap-[48px] p-0 laptop:p-[4px]">
              <Image
                src={data?.events?.event_image}
                alt="event details"
                width={496}
                height={532}
                className="w-screen h-[440px] laptop:w-[496px] laptop:h-[532px]"
              />
              <div className="px-[24px] laptop:px-0">
                <p className="mb-[24px] font-semibold text-[18px] laptop:text-[32px] leading-[44.8px]">
                  {data?.events?.event_name}
                </p>
                <div className="flex items-center gap-2 my-2">
                  <CalendarIcon />
                  <p className="font-normal laptop:font-semi-normal text-[14px] laptop:text-[18px] leading-[27px] tracking-custom text-text-grey">
                    {start?.formattedDate}
                  </p>
                  <p>-</p>
                  <p className="font-normal laptop:font-semi-normal text-[14px] laptop:text-[18px] leading-[27px] tracking-custom text-text-grey">
                   {end?.formattedDate}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-[24px]">
                  <ClockIcon />
                  <p className="font-normal laptop:font-semi-normal text-[14px] laptop:text-[18px] leading-[27px] text-text-grey">
                     {start?.formattedTime}
                  </p>
                  <p>-</p>
                  <p className="font-normal laptop:font-semi-normal text-[14px] laptop:text-[18px] leading-[27px] text-text-grey">
                      {end?.formattedTime}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-[24px]">
                  <LocationIcon />
                  <p className="font-normal laptop:font-semi-normal text-[14px] laptop:text-[18px] leading-[27px] text-text-grey">
                    {data?.events?.location}
                  </p>
                </div>
                <p className="hidden laptop:block mt-[40px] font-semibold text-[18px] leading-[27px] tracking-custom">
                  Contact Us
                </p>
                <div className="hidden laptop:flex items-center gap-[16px] mt-[16px]">
                  <FacebookIcon />
                  <InstagramIcon />
                  <LinkedInIcon />
                  <TwitterIcon />
                  <AttachmentIcon />
                </div>
                <div className="mt-[40px] hidden laptop:block">
                  <Button
                    className={
                      "bg-gradient-green w-[231px] h-[56px] py-3.5 px-6 gap-2 rounded-[12px] border-b-2 border-transparent shadow-custom-bottom"
                    }
                  >
                    <p
                      className="font-semi-normal text-[16px] leading-[19.2px]"
                      onClick={toggleModal}
                    >
                      Generate affiliate link
                    </p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full laptop:w-[1312px] mt-[40px] flex flex-col laptop:flex-row justify-between">
            <div className="px-[24px] laptop:px-0">
              <p className="font-semibold text-[24px] leading-[33.6px]">
                About Event
              </p>
              <div className="w-full laptop:w-[720px] mt-[16px]">
                <p className="font-semibold text-[16px] leading-[24px] text-light-black">
                  {data?.events?.event_description}
                </p>
                {/* <p className="font-normal text-[16px] leading-[24px] text-light-black mt-2">
                  Join us at the unlocking business potentials a dynamic
                  conference designed to empower entrepreneurs and business
                  leaders with the tools, strategies, and connections needed to
                  unlock their full potential.
                </p> */}
              </div>
            </div>
            <div className="laptop:hidden px-[24px]">
              <p className="mt-[40px] font-semibold text-[18px] leading-[27px] tracking-custom">
                Contact Us
              </p>

              <div className="flex items-center gap-[16px] mt-[16px]">
                {data?.events?.socials.map(
                  (
                    item: { name: string; value: string },
                    idx: React.Key | null | undefined
                  ) => (
                    <div key={idx}>
                      <SocialIcon key={idx} name={item.name} url={item.value} />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="w-full laptop:w-[480px] p-[24px] gap-[16px] bg-white rounded-[12px]">
              <p className="font-semibold text-[18px]">Tickets</p>

              {data?.events?.ticket_sold.map((item: any) => (
                <div className="flex justify-between mt-[16px]" key={item?.id}>
                  <div className="flex flex-col">
                    <p className="font-semi-normal text-[14px]">{item?.name}</p>
                    <p className="font-normal text-[12px] text-text-grey">
                      {item?.count}
                    </p>
                  </div>
                  <p className="font-semi-normal text-[14px]">
                    N {formatNumberWithCommas(item?.price)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-[40px] laptop:hidden px-[24px]">
              <Button
                className={
                  "bg-gradient-green w-full h-[48px] py-[14px] px-[48px] gap-2 rounded-[12px] border-b-2 border-transparent shadow-custom-bottom"
                }
              >
                <p
                  className="font-semi-normal text-[16px] leading-[19.2px]"
                  onClick={toggleModal}
                >
                  Generate affiliate link
                </p>
              </Button>
            </div>
          </div>
        </section>
        <AffiliateLinkModal
          isOpen={isOpen}
          toggle={toggleModal}
          item={data?.events?.affiliate_link}
        />
      </section>
    </MainLayout>
  );
};

export default AgentDetailsPage;
