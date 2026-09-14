import React from "react";
import empty_business from "@/image/business_empty.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import { AllBusinessSkeleton } from "@/components/Skeletons";
import Link from "next/link";
import AllBusinessCard from "@/components/business/AllBusinessCard";

interface ListingInterface {
  businesses: BusinessInterface[];
  loading: boolean;
}

const ListingSection: React.FC<ListingInterface> = ({ businesses, loading }) => {
  const router = useRouter();

  return (
    <section className="sm:px-6 lg:px-8 mt-4 flex flex-col items-center px-4">
      {loading ? (
        // Loading State
        <div className="mt-6 w-full max-w-[1312px] rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-4 h-7 w-32 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-2 laptop:grid-cols-4">
            <AllBusinessSkeleton count={8} />
          </div>
        </div>
      ) : businesses?.length === 0 ? (
        // Empty State
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
          <div className="flex max-w-md flex-col items-center text-center">
            <Image
              src="/images/business_empty.png"
              alt="No businesses"
              width={160}
              height={148}
              className="mb-6"
            />
            <h2 className="sm:text-2xl mb-3 text-xl font-semibold">List your business</h2>
            <p className="sm:text-base mb-6 text-sm font-normal text-gray-600">
              Get started by adding your business, and get discovered by potential clients.
            </p>
            <Button
              className="sm:px-12 h-12 rounded-xl bg-gradient-green px-8 shadow-green-inset transition-opacity hover:opacity-90 hover:shadow-green-inset-strong"
              onClick={() => router.push("/business/add-business")}
            >
              <span className="text-base font-semi-normal">Add business</span>
            </Button>
          </div>
        </div>
      ) : (
        // Business List
        <div className="mt-6 w-full max-w-[1312px] rounded-xl bg-white p-4 pb-[20px] shadow-sm">
          <div className={"flex items-center justify-between"}>
            <h2 className="sm:text-xl mb-4 font-sans text-lg font-semibold">All Listings</h2>
            <Button
              className="sm:px-12 h-12 rounded-xl bg-gradient-green px-8 shadow-green-inset transition-opacity hover:opacity-90 hover:shadow-green-inset-strong"
              onClick={() => router.push("/business/add-business")}
            >
              <span className="text-base font-semi-normal">Add business</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2 laptop:grid-cols-4">
            {businesses.map((business: BusinessInterface) => (
              <Link
                href={`/business/${business.id}`}
                key={business.id}
                className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <AllBusinessCard business={business} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ListingSection;
