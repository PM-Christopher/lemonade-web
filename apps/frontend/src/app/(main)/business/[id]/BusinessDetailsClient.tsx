"use client";
import React, { useCallback, useEffect, useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import business_logo from "@/images/business/jobLogo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PhoneIcon from "@/images/icons/phoneIcon.svg";
import MessageIcon from "@/images/icons/messageIcon.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import PencilIcon from "@/images/icons/editIcon.svg";
import RocketIcon from "@/images/icons/rocketIcon.svg";
import CaseIcon from "@/images/icons/caseIcon.svg";
import TrashIcon from "@/images/icons/trashIcon.svg";
import RocketIconGreen from "@/images/icons/rocketIconGreen.svg";
import RocketIconGrey from "@/images/icons/rocketIconGrey.svg";

import RatingsBar from "@/components/global/RatingsBar";
import Reviews from "@/components/global/Reviews";
import ReviewModal from "@/components/business/Modals/ReviewModal";
import RequestServiceModal from "@/components/business/Modals/RequestServiceModal";
import { useSelector } from "react-redux";
import { useRequest } from "@/hooks/useRequest";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { formatDecimal, formatStringUCFirst } from "@/lib/helper";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axiosInstane";
import VerifyBoost from "@/components/business/Modals/VerifyBoost";
import BoostDetailsModal from "@/components/business/Modals/BoostDetailsModal";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/navigation";
import { businessButtons } from "@/lib/constant";
import { useAppDispatch } from "@/redux/hook";
import { RootState } from "@/redux/store";
import { useBusinessQuery } from "@/features/business/queries";
import { BusinessDetailSkeleton } from "@/components/Skeletons";
import DisputeJobModal from "@/components/business/Modals/DisputeJobModal";
import SubmitDisputeModal from "@/components/business/Modals/SubmitDisputeModal";

const BusinessDetailsClient = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(4); // Initial number of reviews to show
  const [reviews, setReviews] = useState([]);
  const searchParams = useSearchParams();
  const trxref = searchParams.get("trxref");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [isVerifyBoost, setIsVerifyBoost] = useState(false);
  const [boost, setBoost] = useState<any>(null);
  const [boostDetails, setBoostDetails] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isSubmitDisputeOpen, setIsSubmitDisputeOpen] = useState(false);
  const pathname = usePathname();

  const { data: businessData, isLoading: loading } = useBusinessQuery(id);
  const business = businessData?.business;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleRequestModal = () => {
    setIsRequestOpen(!isRequestOpen);
  };

  const toggleVerifyBoost = () => {
    setIsVerifyBoost(!isVerifyBoost);
  };

  const toggleBoostDetails = () => {
    setBoostDetails(!boostDetails);
  };

  const toggleDisputeModal = useCallback(() => {
    setIsDisputeOpen((prev) => !prev);
  }, []);

  const toggleSubmitDisputeModal = () => {
    setIsSubmitDisputeOpen(!isSubmitDisputeOpen);
  };

  useEffect(() => {
    const shouldOpen = searchParams.get("modal");
    if (shouldOpen === "disputeOpen") {
      toggleDisputeModal();
      router.replace(pathname);
    }
  }, [searchParams, pathname, router, toggleDisputeModal]);

  // business reviews
  const { data: reviewData, loading: reviewLoading } = useRequest(
    `/user/business/${id}/business-reviews`,
  );

  useEffect(() => {
    if (reviewData) {
      setReviews(reviewData?.reviews);
    }
  }, [reviewData]);

  useEffect(() => {
    const verifyBusinessBoost = async () => {
      if (trxref) {
        setVerifyLoading(true);
        try {
          const { data } = await axiosInstance.patch(
            `listing/verify-business-boost?reference=${trxref}`,
            {},
          );
          if (data.status) {
            if (data.data.verified) {
              const params = new URLSearchParams(searchParams);
              params.delete("trxref");
              params.delete("reference");
              setBoost(data.data.boost);
              setIsVerifyBoost(true);
              router.replace(`?${params.toString()}`);
            }
          }
        } catch (error) {
        } finally {
          setVerifyLoading(false);
        }
      }
    };
    verifyBusinessBoost();
  }, [trxref, router, searchParams]);

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 4); // Increase the count by 4
  };

  const hasMoreReviews = displayCount < reviews.length;

  const handleButtonsClick = (type: "call" | "web" | "email", value: string) => {
    let href = "";

    switch (type) {
      case "call":
        href = `tel:${value}`;
        break;
      case "web":
        href = value.startsWith("http") ? value : `https://${value}`;
        break;
      case "email":
        href = `mailto:${value}`;
        break;
      default:
        break;
    }
    window.open(href, "_blank");
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] border-b-grey-20 border-t-grey-20 bg-white p-[12px] px-10">
          <div className="flex items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]">
            <ChevronLeft className="cursor-pointer" onClick={() => router.back()} />
            <p className="font-sans text-[16px] font-semibold tracking-custom">Business details</p>
          </div>
        </div>
        <section className="mt-4 flex min-h-screen flex-col items-center gap-4">
          {loading ? (
            <BusinessDetailSkeleton />
          ) : (
            <>
              <div
                className="relative w-full rounded-[12px] bg-white bg-cover bg-center bg-no-repeat p-[16px] laptop:w-[640px]"
                style={{ backgroundImage: `url('/images/business-bg.png')` }}
              >
                <div className="flex flex-col">
                  <div className="flex justify-center">
                    <Image
                      src={"/images/business/jobLogo.png"}
                      alt="logo"
                      className="flex justify-center rounded-[16px] border-[1px] border-step-color"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="mt-[8px] flex flex-col justify-center">
                    <p className="text-center text-[16px] font-semibold">{business?.name}</p>
                    <p className="text-center text-[14px] font-semi-normal text-text-grey">
                      {business?.city}, {business?.country}
                    </p>
                    {business?.service_rate ? (
                      <p className="mt-[4px] text-center text-[16px] font-semibold">
                        N {formatNumberWithCommas(business?.service_rate)}/hr
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="mt-[8px] flex justify-center">
                    <div className="flex w-fit items-center justify-center gap-1 rounded-xl bg-mid-grey p-2">
                      <div>
                        <Image src={"/images/medal.png"} alt="medal" width={16} height={16} />
                      </div>
                      <div>
                        <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-primary-black">
                          {formatDecimal(business?.rating ?? 0, 1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!business?.owner && !business?.hasActiveServiceRequest && (
                    <div className="mt-[16px] flex justify-center">
                      <Button
                        className="w-fit bg-gradient-green p-[14px] px-[24px] shadow-custom-bottom"
                        onClick={toggleRequestModal}
                      >
                        <p className="font-normal text-white">Request service</p>
                      </Button>
                    </div>
                  )}

                  {business?.hasActiveServiceRequest && (
                    <div className="mt-4 flex justify-center">
                      <div className="flex items-center rounded-xl bg-gradient-green px-4 py-2 shadow-custom-bottom">
                        <p className="font-medium text-white">In Progress</p>
                      </div>
                    </div>
                  )}
                </div>
                {business?.owner && business.hasBoost && (
                  <div className="absolute right-0 top-0 rounded-bl-[12px] rounded-tr-[12px] bg-light-green-10">
                    <div className="flex items-center gap-[4px] p-[4px] px-[8px]">
                      <RocketIconGreen />
                      <p className="text-[14px] font-semi-normal text-mid-green">Boosted</p>
                    </div>
                  </div>
                )}
              </div>

              {business?.owner ? (
                <div className="mt-[24px] flex items-center justify-center gap-8">
                  <Link href={`/business/${id}/jobs`}>
                    <div className="flex flex-col items-center gap-[8px]">
                      <div className="rounded-[16px] border-[1px] border-grey-20 bg-white p-[16px]">
                        <CaseIcon />
                      </div>
                      <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
                        Jobs
                      </p>
                    </div>
                  </Link>
                  {business.hasBoost ? (
                    <div
                      className="flex cursor-pointer flex-col items-center gap-[8px]"
                      onClick={toggleBoostDetails}
                    >
                      <div className="rounded-[16px] border-[1px] border-grey-20 bg-white p-[16px]">
                        <RocketIconGrey />
                      </div>
                      <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
                        Boost
                      </p>
                    </div>
                  ) : (
                    <Link href={`/business/${id}/boost-business`}>
                      <div className="flex flex-col items-center gap-[8px]">
                        <div className="rounded-[16px] border-[1px] border-grey-20 bg-white p-[16px]">
                          <RocketIcon />
                        </div>
                        <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
                          Boost
                        </p>
                      </div>
                    </Link>
                  )}
                  <Link href={`/business/${id}/edit-business`}>
                    <div className="flex flex-col items-center gap-[8px]">
                      <div className="rounded-[16px] border-[1px] border-grey-20 bg-white p-[16px]">
                        <PencilIcon />
                      </div>
                      <div>
                        <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
                          Edit
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col items-center gap-[8px]">
                    <div className="rounded-[16px] border-[1px] border-grey-20 bg-white p-[16px]">
                      <TrashIcon />
                    </div>
                    <div>
                      <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
                        Delete
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-[24px] flex items-center justify-center gap-8">
                  <div
                    className="flex cursor-pointer flex-col items-center gap-[8px]"
                    onClick={() =>
                      handleButtonsClick(businessButtons.call, business?.phone_number ?? "")
                    }
                  >
                    <div className="rounded-[16px] border-[1px] border-grey-20 bg-white p-[16px]">
                      <PhoneIcon />
                    </div>
                    <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
                      Call
                    </p>
                  </div>
                  <div
                    className="flex cursor-pointer flex-col items-center gap-[8px]"
                    onClick={() => handleButtonsClick(businessButtons.email, business?.email ?? "")}
                  >
                    <div className="rounded-[16px] border-[1px] border-grey-20 bg-white p-[16px]">
                      <MessageIcon />
                    </div>
                    <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
                      Send email
                    </p>
                  </div>
                  <div
                    className="flex cursor-pointer flex-col items-center gap-[8px]"
                    onClick={() =>
                      handleButtonsClick(businessButtons.web, business?.website_url ?? "")
                    }
                  >
                    <div className="rounded-[16px] border-[1px] border-grey-20 bg-white p-[16px]">
                      <WebIcon />
                    </div>
                    <div>
                      <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
                        Visit Website
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full rounded-tl-[24px] rounded-tr-[24px] bg-purple-tint-1 laptop:w-[640px]">
                <div className="pb-[8px] pl-[16px] pr-[16px] pt-[16px]">
                  <p className="text-[14px] font-semi-normal">
                    Lemonade protects in-app transactions only. Use caution outside the app
                  </p>
                </div>
                <div className="rounded-tl-[24px] rounded-tr-[24px] bg-white">
                  <div className="pb-[24px] pl-[16px] pr-[16px] pt-[16px]">
                    <p className="text-[16px] font-semibold">About business</p>
                    <p className="mt-[12px] text-[14px] font-normal text-light-black">
                      {business?.description}
                    </p>
                    <p className="text-[14px] font-semi-normal text-light-green">More</p>
                    <div className="my-[24px] border-t-[1px] border-t-mid-grey"></div>
                    <p className="text-[16px] font-semibold">Business categories</p>
                    <p className="mt-[12px] text-[14px] font-normal text-light-black">
                      {business?.categories?.map((category: string, index: number) => (
                        <span key={index}>
                          {formatStringUCFirst(category)}
                          {index < business?.categories?.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                    <div className="my-[24px] border-t-[1px] border-t-mid-grey"></div>
                    <p className="text-[16px] font-semibold">Services</p>
                    <p className="mt-[12px] text-[14px] font-normal text-light-black">
                      {business?.services?.map((service: string, index: number) => (
                        <span key={index}>
                          {formatStringUCFirst(service)}
                          {index < business?.services?.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                    <div className="my-[24px] border-t-[1px] border-t-mid-grey"></div>
                    <p className="text-[16px] font-semibold">Portfolio Gallery</p>
                    <div className="sm:grid-cols-3 lg:grid-cols-4 mt-4 grid grid-cols-2 gap-3">
                      {business?.gallery?.map((item: string, index: number) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                          <Image
                            src={item}
                            alt={`gallery_image_${index}`}
                            width={170}
                            height={170}
                            className="h-[170px] w-full transform rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Optional hover overlay */}
                          <div className="absolute inset-0 rounded-xl bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>
                      ))}
                    </div>

                    <div className="my-[24px] border-t-[1px] border-t-mid-grey"></div>
                    <p className="text-[16px] font-semibold">Reviews</p>
                    <div className="flex justify-between">
                      <div className="flex flex-col rounded-[12px] bg-light_grey p-[12px] px-[20px]">
                        <div className="flex justify-center">
                          <Image
                            src={"/images/medal.png"}
                            alt="medal"
                            width={20.57}
                            height={20.57}
                          />
                        </div>
                        <div>
                          <p className="text-center text-[20px] font-bold">
                            {formatDecimal(business?.rating ?? 0, 1)}/
                            <span className="font-semi-normal">5</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[12px] font-normal text-text-grey">
                            {reviewData?.reviews.length} ratings
                          </p>
                        </div>
                      </div>
                      <RatingsBar
                        max_count={reviewData?.reviews.length}
                        ratings={reviewData?.subReviews}
                      />
                    </div>
                    {reviews.length > 0 ? (
                      <>
                        <div className="my-[24px] border-t-[1px] border-t-mid-grey"></div>
                        {!reviewLoading &&
                          reviews
                            .slice(0, displayCount)
                            .map((review, index) => <Reviews review={review} key={index} />)}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Image
                          src={"/images/noReviews.png"}
                          alt="no-reviews"
                          width={114}
                          height={98}
                        />
                        <p className="text-[14px] font-semi-normal text-text-grey">
                          No reviews yet
                        </p>
                      </div>
                    )}
                    {hasMoreReviews && (
                      <div className="mt-[38px]">
                        <p
                          className="cursor-pointer text-center text-[16px] font-semi-normal text-light-green"
                          onClick={loadMore}
                        >
                          Load more reviews
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
        <VerifyBoost boost={boost} isOpen={isVerifyBoost} toggleMenu={toggleVerifyBoost} />
        <ReviewModal isOpen={isOpen} toggleMenu={toggleMenu} />
        <RequestServiceModal
          id={id}
          isOpen={isRequestOpen}
          toggleMenu={toggleRequestModal}
          services={business?.services}
        />
        <BoostDetailsModal
          boost={business?.boost}
          isOpen={boostDetails}
          toggleMenu={toggleBoostDetails}
        />
        <DisputeJobModal
          isOpen={isDisputeOpen}
          toggle={toggleDisputeModal}
          job={business}
          toggleSubmit={toggleSubmitDisputeModal}
        />
        <SubmitDisputeModal isOpen={isSubmitDisputeOpen} toggle={toggleSubmitDisputeModal} />
      </section>
    </MainLayout>
  );
};

export default BusinessDetailsClient;
