"use client";
import React, { useState } from "react";
import Upcoming from "@/components/events/views/Organizer/Upcoming";
import PastEvent from "@/components/events/views/Organizer/PastEvent";
import Draft from "@/components/events/views/Organizer/Draft";
import PaymentSettingsModal from "@/components/events/Modals/PaymentSettingsModal";
import { PlusIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { useOrganizerEventsQuery } from "@/features/events/queries";

type OrganizerSectionInterface = {
  activatePaymentModal: () => void;
  togglePaymentModel: boolean;
};

const OrganizerSectionView: React.FC<OrganizerSectionInterface> = ({
  activatePaymentModal,
  togglePaymentModel,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const router = useRouter();
  const [orOption, setOrOption] = useState("upcoming");
  const { data: organizer_events, isLoading: eventsLoading } = useOrganizerEventsQuery();

  const renderView = () => {
    switch (orOption) {
      case "upcoming":
        return <Upcoming events={organizer_events?.upcoming ?? []} loading={eventsLoading} />;
      case "past":
        return <PastEvent events={organizer_events?.past ?? []} loading={eventsLoading} />;
      case "draft":
        return <Draft events={organizer_events?.drafts ?? []} loading={eventsLoading} />;
      default:
        return <Upcoming events={organizer_events?.upcoming ?? []} loading={eventsLoading} />;
    }
  };

  const switchOption = (option: string) => {
    setOrOption(option);
  };

  return (
    <>
      <div className="laptop:justify-between flex items-center justify-center border-b-[1px] bg-white px-[16px] pt-[8px] pb-[1px]">
        <div className="flex gap-10">
          <div className="flex gap-4 sm:gap-6">
            {[
              { label: "Upcoming", key: "upcoming" },
              { label: "Past Events", key: "past" },
              { label: "Drafts", key: "draft" },
            ].map((tab) => {
              const isActive = orOption === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => switchOption(tab.key)}
                  className="group flex flex-col items-center px-4 py-2"
                >
                  <span
                    className={[
                      "font-sans text-sm leading-[21px] transition-colors duration-200",
                      isActive ? "text-black-light font-semibold" : "text-text-grey font-normal",
                    ].join(" ")}
                  >
                    {tab.label}
                  </span>

                  {/* centered underline */}
                  <span
                    className={[
                      "bg-step-color h-[2px] rounded-full transition-all duration-300 ease-out",
                      isActive
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="mt-4 flex flex-col items-center px-[10px]">
        {/*<EmptyEvent />*/}
        {renderView()}
        <PaymentSettingsModal toggle={activatePaymentModal} option={togglePaymentModel} />
      </section>
      {isMobile && (
        <div
          className="bg-gradient-green shadow-custom-bottom fixed right-4 bottom-[250px] flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full p-4 text-white"
          onClick={() => router.push("/event/create-event")}
        >
          <PlusIcon className="h-[19px] w-[19px]" />
        </div>
      )}
    </>
  );
};

export default OrganizerSectionView;
