import React from "react";
import Image from "next/image";
import { FormattedText } from "@lemonade/ui";
import RocketGreenIcon from "@/icons/rocketIconGreen.svg";
import type { UserBusiness } from "@/features/user/api";
import { images } from "@/lib/images";

interface BusinessViewProps {
  business: UserBusiness | null | undefined;
  loading: boolean;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3 border-b pb-6">
    <p className="text-body-l font-bold">{title}</p>
    {children}
  </div>
);

const BusinessView = ({ business, loading }: BusinessViewProps) => {
  if (!business) {
    return (
      <p className="text-text-grey text-body-s p-6 font-normal">
        {loading ? "Loading..." : "This user has no business listed."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div
        className="relative w-full rounded-xl bg-white bg-cover bg-center bg-no-repeat p-4"
        style={{ backgroundImage: `url(${images.BUSINESS_BG})` }}
      >
        {business.boosted && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <RocketGreenIcon className="h-3 w-3" />
            <p className="text-light-green text-meta font-medium">Boosted</p>
          </div>
        )}
        <div className="flex flex-col items-center">
          <Image
            unoptimized
            src={business.image || images.BUSINESS_JOB_LOGO}
            alt={business.name}
            className="border-step-color h-16 w-16 rounded-2xl border object-cover"
            width={64}
            height={64}
          />
          <p className="text-body-l mt-2 text-center font-semibold">{business.name}</p>
          <p className="text-text-grey text-body-s text-center font-medium">
            {[business.city, business.country].filter(Boolean).join(", ")}
          </p>
          {business.service_rate_naira && (
            <p className="text-body-s mt-1 font-semibold">
              ₦{Number(business.service_rate_naira).toLocaleString()}/hr
            </p>
          )}
          <p className="bg-mid-grey mt-2 rounded-xl px-2 py-1 text-sm font-medium">
            {business.rating.toFixed(1)}
          </p>
        </div>
      </div>
      <Section title="About business">
        <FormattedText text={business.description} className="text-light-black text-body-s" />
      </Section>
      <Section title="Business categories">
        <p className="text-light-black text-body-s font-normal">{business.categories.join(", ")}</p>
      </Section>
      <Section title="Services">
        <p className="text-light-black text-body-s font-normal">{business.services.join(", ")}</p>
      </Section>
      {business.gallery.length > 0 && (
        <Section title="Portfolio Gallery">
          <div className="flex flex-wrap gap-1">
            {business.gallery.map((src) => (
              <Image
                unoptimized
                key={src}
                src={src}
                alt="Portfolio"
                className="h-42.5 w-42.5 rounded-sm object-cover"
                width={170}
                height={170}
              />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default BusinessView;
