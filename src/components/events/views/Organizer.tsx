import React, {useState} from 'react';
import Upcoming from "@/components/events/views/Organizer/Upcoming";
import PastEvent from "@/components/events/views/Organizer/PastEvent";
import Draft from "@/components/events/views/Organizer/Draft";
import PaymentSettingsModal from "@/components/events/Modals/PaymentSettingsModal";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {PlusIcon} from "lucide-react";
import {useMediaQuery} from "react-responsive";
import {useRouter} from "next/navigation";

type OrganizerSectionInterface = {
    activatePaymentModal: () => void,
    togglePaymentModel: boolean
}

const OrganizerSectionView: React.FC<OrganizerSectionInterface> = ({activatePaymentModal, togglePaymentModel}) => {
    const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
    const router = useRouter()
    const [orOption, setOrOption] = useState("upcoming")
    const {authToken} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const { data, loading } = useRequest(`/events`, "GET", {}, true, getHeader())

    const renderView = () => {
        switch (orOption) {
            case "upcoming":
                return <Upcoming events={data?.upcoming} loading={loading} />
            case "past":
                return <PastEvent events={data?.past} loading={loading} />
            case "draft":
                return <Draft events={data?.drafts} loading={loading} />
            default:
                return <Upcoming events={data?.upcoming} loading={loading} />
        }
    }

    const switchOption = (option: string) => {
        setOrOption(option)
    }

    return (
        <>
            <div className="bg-white flex justify-center laptop:justify-between border-b-[1px] items-center pt-[8px] pb-[1px] px-[16px]">
                <div className="flex gap-10">
                    <div className={`flex flex-col items-center pt-[8px] px-[16px] pb-[2px] ${orOption === 'upcoming' && "border-b-step-color border-b-2"}`}>
                        <p className="font-sans font-semi-normal text-black-light text-[14px] leading-[21px] cursor-pointer" onClick={() =>switchOption("upcoming")}>Upcoming</p>
                    </div>
                    <div className={`flex flex-col items-center pt-[8px] px-[16px] pb-[2px] ${orOption === 'past' && "border-b-step-color border-b-2"}`}>
                        <p className="font-sans font-semi-normal text-text-grey text-[14px] leading-[21px] cursor-pointer" onClick={() =>switchOption("past")}>Past events</p>
                    </div>
                    <div className={`flex flex-col items-center pt-[8px] px-[16px] pb-[2px] ${orOption === 'draft' && "border-b-step-color border-b-2"}`}>
                        <p className="font-sans font-semi-normal text-text-grey text-[14px] leading-[21px] cursor-pointer" onClick={() =>switchOption("draft")}>Draft</p>
                    </div>
                </div>
            </div>

            <section className="mt-4 flex flex-col items-center px-[10px]">
                {/*<EmptyEvent />*/}
                {renderView()}
                <PaymentSettingsModal toggle={activatePaymentModal} option={togglePaymentModel} />
            </section>
            {
                isMobile && (
                    <div
                        className="fixed bottom-[250px] right-4 bg-gradient-green text-white p-4 rounded-full cursor-pointer w-[60px] h-[60px] flex justify-center items-center shadow-custom-bottom"
                        onClick={() => router.push("/event/create-event")}>
                        <PlusIcon className="h-[19px] w-[19px]"/>
                    </div>
                )
            }
        </>
    );
}

export default OrganizerSectionView;