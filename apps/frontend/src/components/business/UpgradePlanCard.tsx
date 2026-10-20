"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@lemonade/ui";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";

// Shown when the user's plan does not include listing a business.
const UpgradePlanCard = () => {
  const { push } = useNavigation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm">
        <div className="bg-light_grey flex w-full justify-center rounded-lg py-5">
          <Image src={images.BUSINESS_EMPTY} alt="" width={120} height={111} />
        </div>
        <h2 className="mt-5 text-lg font-semibold">Upgrade plan</h2>
        <p className="mt-2 text-sm font-normal text-gray-600">
          Expand your reach with paid plans. Upgrading allows you to list your business and gain
          valuable exposure.
        </p>
        <Button
          className="bg-gradient-green mt-5 h-12 rounded-xl px-8"
          onClick={() => push(routes.SETTINGS_PLAN)}
        >
          See all plans
        </Button>
      </div>
    </div>
  );
};

export default UpgradePlanCard;
