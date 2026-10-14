import React from "react";
import Image from "next/image";
import RocketGreenIcon from "@/icons/rocketIconGreen.svg";
import type { AccountInfoResponse } from "@/features/user/api";
import { images } from "@/lib/images";

interface BusinessViewProps {
  userDetail: AccountInfoResponse | undefined;
}

// Fully static placeholder UI — doesn't read userDetail at all today (every
// value below is a hardcoded string/image, see the literal "data?.business?.name"
// strings). Pre-existing gap from before this migration, not fixed here —
// kept accepting the prop for call-site compatibility with UserDetailsClient.tsx.
const BusinessView = ({ userDetail }: BusinessViewProps) => {
  void userDetail;
  return (
    <div className="flex flex-col gap-6 p-6">
      <div
        className="relative w-full rounded-xl bg-white bg-cover bg-center bg-no-repeat p-4"
        style={{ backgroundImage: `url(${images.BUSINESS_BG})` }}
      >
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Image
              src={images.BUSINESS_JOB_LOGO}
              alt="logo"
              className="border-step-color rounded-2xl border"
              width={64}
              height={64}
            />
          </div>
          <div className="mt-2 flex flex-col justify-center">
            <p className="text-body-l text-center font-semibold">{"data?.business?.name"}</p>
            <p className="text-text-grey text-body-s text-center font-medium">
              {"data?.business?.city"}, {"data?.business?.country"}
            </p>
          </div>
          <div className="mt-2 flex justify-center">
            <div className="bg-mid-grey flex items-center gap-1 rounded-xl p-2">
              <Image src={images.MEDAL} alt="medal" width={16} height={16} />
              <p className="text-primary-black text-body-s font-sans font-medium">
                {/* rating value */}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-light-green-10 absolute top-0 right-0 rounded-tr-xl rounded-bl-xl">
          <div className="flex items-center gap-1 p-1 px-2">
            <RocketGreenIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <p className="text-mid-green text-body-s font-medium">Boosted</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex h-96 flex-col">
        {/* The flex-1 and min-h-0 classes ensure that this div will shrink properly within the parent */}
        <div className="hide-scrollbar flex min-h-0 flex-col gap-3 overflow-y-auto">
          <div className="flex flex-col gap-3 border-b pb-6">
            <p className="text-body-l font-bold">About business</p>
            <p className="text-light-black text-body-s font-normal">
              We don&apos;t just design products, we build brands. We&apos;re a creative agency that
              takes your vision from initial concept to market success. By working with us, you
              benefit from a seamless experience where every step is reinforced.
            </p>
          </div>
          <div className="flex flex-col gap-3 border-b pb-6">
            <p className="text-body-l font-bold">Business categories</p>
            <p className="text-light-black text-body-s font-normal">
              Software development, Digital design
            </p>
          </div>
          <div className="flex flex-col gap-3 border-b pb-6">
            <p className="text-body-l font-bold">Services</p>
            <p className="text-light-black text-body-s font-normal">
              UI designs, Mock ups designs, Graphic designs
            </p>
          </div>
          <div className="flex flex-col gap-3 border-b pb-6">
            <p className="text-body-l font-bold">Portfolio Gallery</p>
            <div className="flex flex-wrap gap-1">
              {/*{*/}
              {/*    data?.business?.gallery?.map((item: string, index: string) => (*/}
              <Image
                src={images.DEFAULT_TRIBE}
                alt="image_1"
                className="rounded-sm"
                width={170.5}
                height={170.5}
              />
              {/*    ))*/}
              {/*}*/}
            </div>
          </div>
          <div className="flex flex-col gap-3 border-b pb-6">
            <p className="text-body-l font-bold">Reviews</p>
            <p className="text-light-black text-body-s font-normal">
              UI designs, Mock ups designs, Graphic designs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessView;
