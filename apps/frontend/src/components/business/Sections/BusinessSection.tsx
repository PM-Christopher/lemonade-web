"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useEffect, useState } from "react";
import BusinessCarousel from "@/components/global/BusinessCarousel";
import AllBusinessCard from "@/components/business/AllBusinessCard";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { businessApi } from "@/features/business/api";
import { businessKeys } from "@/features/business/queries";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { errorMessage } from "@/lib/api-error";
import PaymentConfirmModal, {
  type PaymentConfirmJob,
} from "@/components/business/Modals/PaymentConfirmModal";
import { useAppDispatch } from "@/redux/hook";
import { setSelectedJob } from "@/redux/tempSlice";
import { AllBusinessSkeleton, BusinessCarouselSkeleton } from "@/components/Skeletons";
import { routes } from "@/lib/routes";

interface BusinessSectionProps {
  businesses: BusinessInterface[];
  featured: BusinessInterface[];
  loading: boolean;
  searching?: boolean;
  searchTerm?: string;
  onClear?: () => void;
}

const BusinessSection: React.FC<BusinessSectionProps> = ({
  businesses,
  featured,
  loading,
  searching = false,
  searchTerm = "",
  onClear,
}) => {
  const dispatch = useAppDispatch();
  const { replace } = useNavigation();
  const searchParams = useSearchParams();
  const trxref = searchParams.get("trxref");
  const [, setVerifyLoading] = useState(false);
  const [isVerifyJob, setIsVerifyJob] = useState(false);
  const [paidJob, setPaidJob] = useState<PaymentConfirmJob | null>(null);
  const queryClient = useQueryClient();

  const toggleVerifyJob = () => {
    setIsVerifyJob(!isVerifyJob);
  };

  // Confirm a job checkout when Paystack redirects back with a reference.
  useEffect(() => {
    if (!trxref) return;
    const verifyPayment = async () => {
      setVerifyLoading(true);
      try {
        const result = await businessApi.verifyJobPayment(trxref);
        if (result.verified) {
          const params = new URLSearchParams(searchParams);
          params.delete("trxref");
          params.delete("reference");
          setPaidJob({
            amount: result.job.amount,
            name: result.job.business?.name,
            services: result.job.services,
            updated_at: result.paid_at ? dayjs(result.paid_at).format("MMM D, YYYY") : undefined,
          });
          setIsVerifyJob(true);
          dispatch(setSelectedJob(result.job));
          void queryClient.invalidateQueries({ queryKey: businessKeys.jobsData() });
          replace(`?${params.toString()}`);
        }
      } catch (error) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "We couldn't confirm your payment."),
            type: "error",
          }),
        );
      } finally {
        setVerifyLoading(false);
      }
    };
    verifyPayment();
  }, [trxref, dispatch, replace, searchParams, queryClient]);

  return (
    <section className="mt-4 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      {/* Featured Section */}
      {!searching && (
        <div className="bg-light-green-50 w-full max-w-328 gap-3 rounded-none p-4 sm:rounded-xl">
          <p className="mb-3 text-lg font-semibold sm:text-xl">Featured</p>
          {loading ? (
            <BusinessCarouselSkeleton count={4} />
          ) : featured?.length > 0 ? (
            <BusinessCarousel businesses={featured} showDots={false} showArrows={false} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-4 py-8 shadow-sm sm:py-12">
              <div className="flex max-w-md flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9V5.25m4.5 3.75V5.25M3 9h18M4.5 19.5h15a1.5 1.5 0 001.5-1.5V9H3v9a1.5 1.5 0 001.5 1.5z"
                    />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-700">No Featured Businesses</p>
                <p className="mt-1 text-sm text-gray-500">
                  Check back later — new businesses may be added soon.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Business Sections */}
      <div
        className={`${searching ? "" : "mt-6"} w-full max-w-328 rounded-xl bg-white p-4 shadow-sm`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-lg font-semibold sm:text-xl">
            {!searching
              ? "All businesses"
              : searchTerm
                ? `Showing results for “${searchTerm}”`
                : "Showing filtered results"}
          </p>
          {searching && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-light-green text-body-s cursor-pointer font-semibold"
            >
              Clear
            </button>
          )}
        </div>
        <div
          className={`grid gap-2 ${
            !loading && (!businesses || businesses.length === 0)
              ? "grid-cols-1"
              : "phone:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 grid-cols-1"
          }`}
        >
          {loading ? (
            <AllBusinessSkeleton count={4} />
          ) : businesses?.length > 0 ? (
            businesses.map((business: BusinessInterface, index: number) => (
              <Link href={routes.BUSINESS_DETAIL(business.id)} key={index}>
                <AllBusinessCard business={business} />
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-4 py-8 shadow-sm sm:py-12">
              <div className="flex max-w-md flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9V5.25m4.5 3.75V5.25M3 9h18M4.5 19.5h15a1.5 1.5 0 001.5-1.5V9H3v9a1.5 1.5 0 001.5 1.5z"
                    />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-700">
                  {searching ? "No businesses found" : "No Businesses"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {searching
                    ? "Try a different search or clear the filters."
                    : "Check back later — new businesses may be added soon."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {paidJob && (
        <PaymentConfirmModal isOpen={isVerifyJob} toggleMenu={toggleVerifyJob} job={paidJob} />
      )}
    </section>
  );
};

export default BusinessSection;
