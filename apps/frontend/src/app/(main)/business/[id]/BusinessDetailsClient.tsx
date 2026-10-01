"use client";
import React, { useCallback, useEffect, useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import business_logo from "@/images/business/jobLogo.png";
import Image from "next/image";
import { Button } from "@lemonade/ui";
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
import Reviews, { type Review } from "@/components/global/Reviews";
import ReviewModal from "@/components/business/Modals/ReviewModal";
import dynamic from "next/dynamic";
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

// Off the initial bundle — both are only needed once their triggering
// action fires (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const RequestServiceModal = dynamic(
  () => import("@/components/business/Modals/RequestServiceModal"),
  { ssr: false },
);
const SubmitDisputeModal = dynamic(
  () => import("@/components/business/Modals/SubmitDisputeModal"),
  { ssr: false },
);

const BusinessDetailsClient = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(4); // Initial number of reviews to show
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

  const shouldOpenDispute = searchParams.get("modal") === "disputeOpen";
  const [openedDisputeFromUrl, setOpenedDisputeFromUrl] = useState(false);
  if (shouldOpenDispute && !openedDisputeFromUrl) {
    setOpenedDisputeFromUrl(true);
    setIsDisputeOpen(true);
  }

  useEffect(() => {
    if (shouldOpenDispute) router.replace(pathname);
  }, [shouldOpenDispute, router, pathname]);

  // business reviews
  const { data: reviewData, loading: reviewLoading } = useRequest<{
    reviews?: Review[];
    subReviews?: Array<{ rating: number; count: number }>;
  }>(`/user/business/${id}/business-reviews`);
  const reviews: Review[] = reviewData?.reviews ?? [];

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
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1">
            <ChevronLeft className="cursor-pointer" onClick={() => router.back()} />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Business details</p>
          </div>
        </div>
        <section className="mt-4 flex min-h-screen flex-col items-center gap-4">
          {loading ? (
            <BusinessDetailSkeleton />
          ) : (
            <>
              <div
                className="laptop:w-[640px] relative w-full rounded-xl bg-white bg-cover bg-center bg-no-repeat p-4"
                style={{ backgroundImage: `url('/images/business-bg.png')` }}
              >
                <div className="flex flex-col">
                  <div className="flex justify-center">
                    <Image
                      src={"/images/business/jobLogo.png"}
                      alt="logo"
                      className="border-step-color flex justify-center rounded-2xl border"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="mt-2 flex flex-col justify-center">
                    <p className="text-center text-[16px] font-semibold">{business?.name}</p>
                    <p className="font-semi-normal text-text-grey text-center text-[14px]">
                      {business?.city}, {business?.country}
                    </p>
                    {business?.service_rate ? (
                      <p className="mt-1 text-center text-[16px] font-semibold">
                        N {formatNumberWithCommas(business?.service_rate)}/hr
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="mt-2 flex justify-center">
                    <div className="bg-mid-grey flex w-fit items-center justify-center gap-1 rounded-xl p-2">
                      <div>
                        <Image src={"/images/medal.png"} alt="medal" width={16} height={16} />
                      </div>
                      <div>
                        <p className="font-semi-normal text-primary-black font-sans text-[14px] leading-[21px]">
                          {formatDecimal(business?.rating ?? 0, 1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!business?.owner && !business?.hasActiveServiceRequest && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        className="bg-gradient-green shadow-custom-bottom w-fit p-3.5 px-6"
                        onClick={toggleRequestModal}
                      >
                        <p className="font-normal text-white">Request service</p>
                      </Button>
                    </div>
                  )}

                  {business?.hasActiveServiceRequest && (
                    <div className="mt-4 flex justify-center">
                      <div className="bg-gradient-green shadow-custom-bottom flex items-center rounded-xl px-4 py-2">
                        <p className="font-medium text-white">In Progress</p>
                      </div>
                    </div>
                  )}
                </div>
                {business?.owner && business.hasBoost && (
                  <div className="bg-light-green-10 absolute top-0 right-0 rounded-tr-xl rounded-bl-xl">
                    <div className="flex items-center gap-1 p-1 px-2">
                      <RocketIconGreen />
                      <p className="font-semi-normal text-mid-green text-[14px]">Boosted</p>
                    </div>
                  </div>
                )}
              </div>

              {business?.owner ? (
                <div className="mt-6 flex items-center justify-center gap-8">
                  <Link href={`/business/${id}/jobs`}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="border-grey-20 rounded-2xl border bg-white p-4">
                        <CaseIcon />
                      </div>
                      <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                        Jobs
                      </p>
                    </div>
                  </Link>
                  {business.hasBoost ? (
                    <div
                      className="flex cursor-pointer flex-col items-center gap-2"
                      onClick={toggleBoostDetails}
                    >
                      <div className="border-grey-20 rounded-2xl border bg-white p-4">
                        <RocketIconGrey />
                      </div>
                      <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                        Boost
                      </p>
                    </div>
                  ) : (
                    <Link href={`/business/${id}/boost-business`}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="border-grey-20 rounded-2xl border bg-white p-4">
                          <RocketIcon />
                        </div>
                        <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                          Boost
                        </p>
                      </div>
                    </Link>
                  )}
                  <Link href={`/business/${id}/edit-business`}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="border-grey-20 rounded-2xl border bg-white p-4">
                        <PencilIcon />
                      </div>
                      <div>
                        <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                          Edit
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col items-center gap-2">
                    <div className="border-grey-20 rounded-2xl border bg-white p-4">
                      <TrashIcon />
                    </div>
                    <div>
                      <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                        Delete
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex items-center justify-center gap-8">
                  <div
                    className="flex cursor-pointer flex-col items-center gap-2"
                    onClick={() =>
                      handleButtonsClick(businessButtons.call, business?.phone_number ?? "")
                    }
                  >
                    <div className="border-grey-20 rounded-2xl border bg-white p-4">
                      <PhoneIcon />
                    </div>
                    <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                      Call
                    </p>
                  </div>
                  <div
                    className="flex cursor-pointer flex-col items-center gap-2"
                    onClick={() => handleButtonsClick(businessButtons.email, business?.email ?? "")}
                  >
                    <div className="border-grey-20 rounded-2xl border bg-white p-4">
                      <MessageIcon />
                    </div>
                    <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                      Send email
                    </p>
                  </div>
                  <div
                    className="flex cursor-pointer flex-col items-center gap-2"
                    onClick={() =>
                      handleButtonsClick(businessButtons.web, business?.website_url ?? "")
                    }
                  >
                    <div className="border-grey-20 rounded-2xl border bg-white p-4">
                      <WebIcon />
                    </div>
                    <div>
                      <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                        Visit Website
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-purple-tint-1 laptop:w-[640px] w-full rounded-tl-3xl rounded-tr-3xl">
                <div className="pt-4 pr-4 pb-2 pl-4">
                  <p className="font-semi-normal text-[14px]">
                    Lemonade protects in-app transactions only. Use caution outside the app
                  </p>
                </div>
                <div className="rounded-tl-3xl rounded-tr-3xl bg-white">
                  <div className="pt-4 pr-4 pb-6 pl-4">
                    <p className="text-[16px] font-semibold">About business</p>
                    <p className="text-light-black mt-3 text-[14px] font-normal">
                      {business?.description}
                    </p>
                    <p className="font-semi-normal text-light-green text-[14px]">More</p>
                    <div className="border-t-mid-grey my-6 border-t"></div>
                    <p className="text-[16px] font-semibold">Business categories</p>
                    <p className="text-light-black mt-3 text-[14px] font-normal">
                      {business?.categories?.map((category: string, index: number) => (
                        <span key={index}>
                          {formatStringUCFirst(category)}
                          {index < business?.categories?.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                    <div className="border-t-mid-grey my-6 border-t"></div>
                    <p className="text-[16px] font-semibold">Services</p>
                    <p className="text-light-black mt-3 text-[14px] font-normal">
                      {business?.services?.map((service: string, index: number) => (
                        <span key={index}>
                          {formatStringUCFirst(service)}
                          {index < business?.services?.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                    <div className="border-t-mid-grey my-6 border-t"></div>
                    <p className="text-[16px] font-semibold">Portfolio Gallery</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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

                    <div className="border-t-mid-grey my-6 border-t"></div>
                    <p className="text-[16px] font-semibold">Reviews</p>
                    <div className="flex justify-between">
                      <div className="bg-light_grey flex flex-col rounded-xl p-3 px-5">
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
                          <p className="text-text-grey text-[12px] font-normal">
                            {reviewData?.reviews?.length} ratings
                          </p>
                        </div>
                      </div>
                      <RatingsBar
                        max_count={reviewData?.reviews?.length ?? 0}
                        ratings={reviewData?.subReviews ?? []}
                      />
                    </div>
                    {reviews.length > 0 ? (
                      <>
                        <div className="border-t-mid-grey my-6 border-t"></div>
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
                        <p className="font-semi-normal text-text-grey text-[14px]">
                          No reviews yet
                        </p>
                      </div>
                    )}
                    {hasMoreReviews && (
                      <div className="mt-[38px]">
                        <p
                          className="font-semi-normal text-light-green cursor-pointer text-center text-[16px]"
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
