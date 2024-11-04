import React, {useState} from 'react';
import Upcoming from "@/components/events/views/Organizer/Upcoming";
import PastEvent from "@/components/events/views/Organizer/PastEvent";
import Draft from "@/components/events/views/Organizer/Draft";
import PaymentSettingsModal from "@/components/events/Modals/PaymentSettingsModal";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";

type OrganizerSectionInterface = {
    activatePaymentModal: () => void,
    togglePaymentModel: boolean
}

const OrganizerSectionView: React.FC<OrganizerSectionInterface> = ({activatePaymentModal, togglePaymentModel}) => {
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
            <div className="bg-white flex justify-between pl-[60px] border-b-[1px] items-center pt-[20px] pb-0">
                <div className="flex">
                    <div className={`flex flex-col items-center w-[160px] pb-2 ${orOption === 'upcoming' && "border-b-step-color border-b-2"}`}>
                        <p className="font-sans font-semi-normal text-black-light text-[14px] leading-[21px] cursor-pointer" onClick={() =>switchOption("upcoming")}>Upcoming</p>
                    </div>
                    <div className={`flex flex-col items-center w-[160px] pb-2 ${orOption === 'past' && "border-b-step-color border-b-2"}`}>
                        <p className="font-sans font-semi-normal text-text-grey text-[14px] leading-[21px] cursor-pointer" onClick={() =>switchOption("past")}>Past events</p>
                    </div>
                    <div className={`flex flex-col items-center w-[160px] pb-2 ${orOption === 'draft' && "border-b-step-color border-b-2"}`}>
                        <p className="font-sans font-semi-normal text-text-grey text-[14px] leading-[21px] cursor-pointer" onClick={() =>switchOption("draft")}>Draft</p>
                    </div>
                </div>
            </div>

            <section className="mt-4 flex flex-col items-center">
                {/*<EmptyEvent />*/}
                {renderView()}
                <PaymentSettingsModal toggle={activatePaymentModal} option={togglePaymentModel} />
            </section>
        </>
    );
}

export default OrganizerSectionView;