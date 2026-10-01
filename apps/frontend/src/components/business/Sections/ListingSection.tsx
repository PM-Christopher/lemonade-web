import React from "react";
import Image from "next/image";
import { Button } from "@lemonade/ui";
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
    <section className="mt-4 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      {loading ? (
        // Loading State
        <div className="mt-6 w-full max-w-[1312px] rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-4 h-7 w-32 animate-pulse rounded bg-gray-200" />
          <div className="laptop:grid-cols-4 grid grid-cols-1 gap-2">
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
            <h2 className="mb-3 text-xl font-semibold sm:text-2xl">List your business</h2>
            <p className="mb-6 text-sm font-normal text-gray-600 sm:text-base">
              Get started by adding your business, and get discovered by potential clients.
            </p>
            <Button
              className="bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong h-12 rounded-xl px-8 transition-opacity hover:opacity-90 sm:px-12"
              onClick={() => router.push("/business/add-business")}
            >
              <span className="font-semi-normal text-base">Add business</span>
            </Button>
          </div>
        </div>
      ) : (
        // Business List
        <div className="mt-6 w-full max-w-[1312px] rounded-xl bg-white p-4 pb-5 shadow-sm">
          <div className={"flex items-center justify-between"}>
            <h2 className="mb-4 font-sans text-lg font-semibold sm:text-xl">All Listings</h2>
            <Button
              className="bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong h-12 rounded-xl px-8 transition-opacity hover:opacity-90 sm:px-12"
              onClick={() => router.push("/business/add-business")}
            >
              <span className="font-semi-normal text-base">Add business</span>
            </Button>
          </div>
          <div className="laptop:grid-cols-4 grid grid-cols-1 gap-2">
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
