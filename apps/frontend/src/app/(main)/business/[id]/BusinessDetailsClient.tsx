"use client";
import { images } from "@/lib/images";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useEffect, useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import { Button, FormattedText } from "@lemonade/ui";
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
import HowItWorksModal from "@/components/business/Modals/HowItWorksModal";
import DeleteBusinessModal from "@/components/business/Modals/DeleteBusinessModal";
import { FallbackImage } from "@/components/global/FallbackImage";
import dynamic from "next/dynamic";
import { formatMinorNaira } from "@/lib/formatNumber";
import { formatDecimal, formatStringUCFirst } from "@/lib/helper";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import VerifyBoost from "@/components/business/Modals/VerifyBoost";
import BoostDetailsModal, { type Boost } from "@/components/business/Modals/BoostDetailsModal";
import MainLayout from "@/components/layouts/MainLayout";

import { businessButtons } from "@/lib/constant";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteListingMutation,
  useWriteBusinessReviewMutation,
} from "@/features/business/mutations";
import { businessApi } from "@/features/business/api";
import {
  businessKeys,
  useBusinessQuery,
  useBusinessReviewsQuery,
} from "@/features/business/queries";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { errorMessage } from "@/lib/api-error";
import { BusinessDetailSkeleton } from "@/components/Skeletons";
import { routes } from "@/lib/routes";

// Off the initial bundle — only needed once the user asks for a service
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const RequestServiceModal = dynamic(
  () => import("@/components/business/Modals/RequestServiceModal"),
  { ssr: false },
);

const HOW_IT_WORKS_KEY = "lemonade:business-quote-how-it-works";

// What the owner is told while their business is not live.
const STATUS_NOTICE: Record<string, string> = {
  PENDING: "Your business is waiting for approval. It will show in listings once approved.",
  REJECTED: "Your business wasn't approved.",
  SUSPENDED: "Your business is suspended and hidden from listings.",
  INACTIVE: "Your business is inactive and hidden from listings.",
};

const BusinessDetailsClient = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(4); // Initial number of reviews to show
  const searchParams = useSearchParams();
  const trxref = searchParams.get("trxref");
  const [, setVerifyLoading] = useState(false);
  const [isVerifyBoost, setIsVerifyBoost] = useState(false);
  const [boost, setBoost] = useState<Boost | null>(null);
  const [boostDetails, setBoostDetails] = useState(false);
  const { replace, back } = useNavigation();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const deleteMutation = useDeleteListingMutation(id);
  const writeReviewMutation = useWriteBusinessReviewMutation(id);

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

  const startRequest = () => {
    let seen = false;
    try {
      seen = localStorage.getItem(HOW_IT_WORKS_KEY) === "1";
    } catch {
      // Storage can be blocked; show the explainer every time.
    }
    if (seen) setIsRequestOpen(true);
    else setIsHowItWorksOpen(true);
  };

  const closeHowItWorks = () => {
    setIsHowItWorksOpen(false);
    try {
      localStorage.setItem(HOW_IT_WORKS_KEY, "1");
    } catch {
      // Ignore blocked storage.
    }
    setIsRequestOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        dispatch(
          updateToastifyReducer({ show: true, message: "Business deleted", type: "success" }),
        );
        replace(routes.BUSINESS);
      },
      onError: (error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "We couldn't delete your business."),
            type: "error",
          }),
        );
      },
    });
  };

  // business reviews
  const { data: reviewData, isPending: reviewLoading } = useBusinessReviewsQuery(id);
  const reviews: Review[] = reviewData?.reviews ?? [];

  // Confirm a boost checkout when Paystack redirects back with a reference.
  useEffect(() => {
    if (!trxref) return;
    const verifyBusinessBoost = async () => {
      setVerifyLoading(true);
      try {
        const result = await businessApi.verifyBoostPayment(trxref);
        if (result.verified) {
          const params = new URLSearchParams(searchParams);
          params.delete("trxref");
          params.delete("reference");
          setBoost(result.boost);
          setIsVerifyBoost(true);
          void queryClient.invalidateQueries({ queryKey: businessKeys.detail(id) });
          replace(`?${params.toString()}`);
        }
      } catch (error) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "We couldn't confirm your boost payment."),
            type: "error",
          }),
        );
      } finally {
        setVerifyLoading(false);
      }
    };
    verifyBusinessBoost();
  }, [trxref, replace, searchParams, queryClient, id, dispatch]);

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
        <div className="flex items-center justify-between bg-white p-3 px-10">
          <div className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1">
            <ChevronLeft className="cursor-pointer" onClick={() => back()} />
            <p className="tracking-custom text-body-l font-sans font-semibold">Business details</p>
          </div>
        </div>
        <section className="mt-4 flex min-h-screen flex-col items-center gap-4">
          {loading ? (
            <BusinessDetailSkeleton />
          ) : (
            <>
              <div
                className="laptop:w-160 relative w-full rounded-xl bg-white bg-cover bg-center bg-no-repeat p-4"
                style={{ backgroundImage: `url(${images.BUSINESS_BG})` }}
              >
                <div className="flex flex-col">
                  <div className="flex justify-center">
                    <FallbackImage
                      src={business?.image}
                      fallbackSrc={images.BUSINESS_JOB_LOGO}
                      alt="logo"
                      className="border-step-color h-16 w-16 rounded-2xl border object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="mt-2 flex flex-col justify-center">
                    <p className="text-body-l text-center font-semibold">{business?.name}</p>
                    <p className="font-semi-normal text-text-grey text-body-s text-center">
                      {business?.city}, {business?.country}
                    </p>
                    {business?.service_rate ? (
                      <p className="text-body-l mt-1 text-center font-semibold">
                        {formatMinorNaira(business?.service_rate)}/hr
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="mt-2 flex justify-center">
                    <div className="bg-mid-grey flex w-fit items-center justify-center gap-1 rounded-xl p-2">
                      <div>
                        <Image src={images.MEDAL} alt="medal" width={16} height={16} />
                      </div>
                      <div>
                        <p className="font-semi-normal text-primary-black text-body-s font-sans">
                          {formatDecimal(business?.rating ?? 0, 1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!business?.owner && !business?.hasActiveServiceRequest && (
                    <div className="mt-4 flex justify-center">
                      <Button className="bg-gradient-green w-fit p-3.5 px-6" onClick={startRequest}>
                        <p className="font-normal text-white">Request service</p>
                      </Button>
                    </div>
                  )}

                  {business?.hasActiveServiceRequest && (
                    <div className="mt-4 flex justify-center">
                      <div className="bg-gradient-green flex items-center rounded-xl px-4 py-2">
                        <p className="font-medium text-white">In Progress</p>
                      </div>
                    </div>
                  )}
                </div>
                {business?.owner && business.hasBoost && (
                  <div className="bg-light-green-10 absolute top-0 right-0 rounded-tr-xl rounded-bl-xl">
                    <div className="flex items-center gap-1 p-1 px-2">
                      <RocketIconGreen />
                      <p className="font-semi-normal text-mid-green text-body-s">Boosted</p>
                    </div>
                  </div>
                )}
              </div>

              {business?.owner && business.status && STATUS_NOTICE[business.status] && (
                <div
                  role="status"
                  className="laptop:w-160 bg-purple-tint-1 text-body-s w-full rounded-xl p-4"
                >
                  <p className="font-semibold">{STATUS_NOTICE[business.status]}</p>
                  {business.status === "REJECTED" && business.rejection_reason && (
                    <p className="text-text-grey mt-1">Reason: {business.rejection_reason}</p>
                  )}
                </div>
              )}

              {business?.owner ? (
                <div className="mt-6 flex items-center justify-center gap-8">
                  <Link href={routes.BUSINESS_JOBS(id)}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="border-grey-20 rounded-2xl border bg-white p-4">
                        <CaseIcon />
                      </div>
                      <p className="font-semi-normal text-text-grey text-meta font-sans">Jobs</p>
                    </div>
                  </Link>
                  {business.status && business.status !== "ACTIVE" ? null : business.hasBoost ? (
                    <div
                      className="flex cursor-pointer flex-col items-center gap-2"
                      onClick={toggleBoostDetails}
                    >
                      <div className="border-grey-20 rounded-2xl border bg-white p-4">
                        <RocketIconGrey />
                      </div>
                      <p className="font-semi-normal text-text-grey text-meta font-sans">Boost</p>
                    </div>
                  ) : (
                    <Link href={routes.BUSINESS_BOOST(id)}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="border-grey-20 rounded-2xl border bg-white p-4">
                          <RocketIcon />
                        </div>
                        <p className="font-semi-normal text-text-grey text-meta font-sans">Boost</p>
                      </div>
                    </Link>
                  )}
                  <Link href={routes.BUSINESS_EDIT(id)}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="border-grey-20 rounded-2xl border bg-white p-4">
                        <PencilIcon />
                      </div>
                      <div>
                        <p className="font-semi-normal text-text-grey text-meta font-sans">Edit</p>
                      </div>
                    </div>
                  </Link>
                  <div
                    className="flex cursor-pointer flex-col items-center gap-2"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <div className="border-grey-20 rounded-2xl border bg-white p-4">
                      <TrashIcon />
                    </div>
                    <div>
                      <p className="font-semi-normal text-text-grey text-meta font-sans">Delete</p>
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
                    <p className="font-semi-normal text-text-grey text-meta font-sans">Call</p>
                  </div>
                  <div
                    className="flex cursor-pointer flex-col items-center gap-2"
                    onClick={() => handleButtonsClick(businessButtons.email, business?.email ?? "")}
                  >
                    <div className="border-grey-20 rounded-2xl border bg-white p-4">
                      <MessageIcon />
                    </div>
                    <p className="font-semi-normal text-text-grey text-meta font-sans">
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
                      <p className="font-semi-normal text-text-grey text-meta font-sans">
                        Visit Website
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-purple-tint-1 laptop:w-160 w-full rounded-tl-3xl rounded-tr-3xl">
                <div className="pt-4 pr-4 pb-2 pl-4">
                  <p className="font-semi-normal text-body-s">
                    Lemonade protects in-app transactions only. Use caution outside the app
                  </p>
                </div>
                <div className="rounded-tl-3xl rounded-tr-3xl bg-white">
                  <div className="pt-4 pr-4 pb-6 pl-4">
                    <p className="text-body-l font-semibold">About business</p>
                    <FormattedText
                      text={business?.description ?? ""}
                      className={`text-light-black text-body-s mt-3 font-normal ${aboutExpanded ? "" : "line-clamp-3"}`}
                    />
                    {(business?.description?.length ?? 0) > 160 && (
                      <button
                        type="button"
                        className="font-semi-normal text-light-green text-body-s cursor-pointer"
                        onClick={() => setAboutExpanded((open) => !open)}
                      >
                        {aboutExpanded ? "Less" : "More"}
                      </button>
                    )}
                    <div className="border-t-mid-grey my-6 border-t"></div>
                    <p className="text-body-l font-semibold">Business categories</p>
                    <p className="text-light-black text-body-s mt-3 font-normal">
                      {business?.categories?.map((category: string, index: number) => (
                        <span key={index}>
                          {formatStringUCFirst(category)}
                          {index < business?.categories?.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                    {business?.owner && (
                      <>
                        <div className="border-t-mid-grey my-6 border-t"></div>
                        <p className="text-body-l font-semibold">Contact details</p>
                        <div className="text-body-s mt-3 flex flex-col gap-3">
                          <p className="flex items-center gap-2">
                            <MessageIcon className="h-4 w-4 shrink-0" />
                            {business.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 shrink-0" />
                            {business.phone_number}
                          </p>
                          <p className="flex items-center gap-2">
                            <WebIcon className="h-4 w-4 shrink-0" />
                            {business.website_url}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="border-t-mid-grey my-6 border-t"></div>
                    <p className="text-body-l font-semibold">Services</p>
                    <p className="text-light-black text-body-s mt-3 font-normal">
                      {business?.services?.map((service: string, index: number) => (
                        <span key={index}>
                          {formatStringUCFirst(service)}
                          {index < business?.services?.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                    <div className="border-t-mid-grey my-6 border-t"></div>
                    <p className="text-body-l font-semibold">Portfolio Gallery</p>
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
                            className="h-42.5 w-full transform rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Optional hover overlay */}
                          <div className="absolute inset-0 rounded-xl bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-mid-grey my-6 border-t"></div>
                    <div className="flex items-center justify-between">
                      <p className="text-body-l font-semibold">Reviews</p>
                      {!business?.owner && (
                        <button
                          type="button"
                          className="font-semi-normal text-light-green text-body-s cursor-pointer"
                          onClick={toggleMenu}
                        >
                          Write a review
                        </button>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <div className="bg-light_grey flex flex-col rounded-xl p-3 px-5">
                        <div className="flex justify-center">
                          <Image src={images.MEDAL} alt="medal" width={20.57} height={20.57} />
                        </div>
                        <div>
                          <p className="text-title-r text-center leading-normal font-bold">
                            {formatDecimal(business?.rating ?? 0, 1)}/
                            <span className="font-semi-normal">5</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-text-grey text-meta leading-normal font-normal">
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
                        <Image src={images.NO_REVIEWS} alt="no-reviews" width={114} height={98} />
                        <p className="font-semi-normal text-text-grey text-body-s">
                          No reviews yet
                        </p>
                      </div>
                    )}
                    {hasMoreReviews && (
                      <div className="mt-9.5">
                        <p
                          className="font-semi-normal text-light-green text-body-l cursor-pointer text-center"
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
        <ReviewModal
          isOpen={isOpen}
          toggleMenu={toggleMenu}
          submit={(values) => writeReviewMutation.mutateAsync(values)}
        />
        <HowItWorksModal isOpen={isHowItWorksOpen} onClose={closeHowItWorks} variant="requester" />
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
        <DeleteBusinessModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          loading={deleteMutation.isPending}
        />
      </section>
    </MainLayout>
  );
};

export default BusinessDetailsClient;
