"use client";
import React, {useState} from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import ChevronRightFilled from "@/images/icons/chevronRightFilled.svg";
import MainLayout from "@/components/layouts/MainLayout";
import {useRouter} from "next/navigation";
import {useAppDispatch} from "@/redux/hook";
import {usePromotionsQuery} from "@/features/events/queries";
import {usePayForPromotionMutation} from "@/features/events/mutations";
import {PromotionInterface} from "@/interfaces/EventInterface";
import moment, {now} from "moment";
import {ColorRing} from "react-loader-spinner";
import {updateToastifyReducer} from "@/redux/toastifySlice";

function PromoteEventPage({params}: { params: { id: number } }) {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const {data: promotionsData, isLoading: loading} = usePromotionsQuery()
    const promotions = promotionsData?.promotions ?? []
    const payForPromotionMutation = usePayForPromotionMutation()
    const promotionLoading = payForPromotionMutation.isPending
    const [selectedPromotion, setSelectedPromotion] = useState<PromotionInterface | null>(null)
    const [unit, setUnit] = useState<number>(1);

    const handleSelectPromotion = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value)
        const foundPromotion = promotions.find((promotion) => promotion.id === selectedId) || null
        setSelectedPromotion(foundPromotion)
        setUnit(1)
    }

    const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers
        if (/^\d*$/.test(value)) {
            setUnit(value === "" ? 0 : Number(value));
        }
    };

    const cost = selectedPromotion ? selectedPromotion.price : 0;
    const subtotal = cost * unit;
    const formattedCurrency = (amount?: number) =>
        amount ? `₦${amount.toLocaleString("en-NG")}` : '-';


    const handlePaymentForPromotion = async () => {
        const formatted = moment().format("YYYY-MM-DD");
        const redirect_url = `${process.env.NEXT_PUBLIC_APP_URL}/event/${params.id}/details`;
        const payload = {
            promo: selectedPromotion?.id,
            unit,
            promotion_date: formatted,
            redirect_url,
        }
        payForPromotionMutation.mutate({id: params.id, data: payload}, {
            onSuccess: (result) => {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Redirecting to payment gateway. Please wait",
                        type: "success",
                    })
                );

                // Wait 2 seconds before redirect
                setTimeout(() => {
                    window.location.href = result.authorization_url;
                }, 2000);
            },
            onError: () => {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Something went wrong while paying for promotion. Please try again.",
                        type: "error",
                    })
                );
            },
        })
    }
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div
                        className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">
                            Promote event
                        </p>
                    </div>
                </div>
                <section className="mt-4 flex flex-col items-center">
                    <div className="flex justify-between gap-[100px]">
                        <div className="flex flex-col">
                            <div className="w-[640px] p-[24px] px-[48px] bg-white rounded-[12px]">
                                <div className="grid gap-2 mt-[24px]">
                                    <Label
                                        htmlFor="fullname"
                                        className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                                    >
                                        Service
                                    </Label>
                                    {
                                        loading ? (
                                            <div></div>
                                        ) : (
                                            <select
                                                className="h-12 rounded-xl bg-light_grey form-font border-0 p-[12px]"
                                                onChange={handleSelectPromotion} value={selectedPromotion?.id}>
                                                <option>Select service</option>
                                                {
                                                    promotions?.length > 0 && promotions?.map((promotion, index: number) => (
                                                        <option key={index} value={promotion.id}>
                                                            {promotion.name}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        )
                                    }
                                </div>
                                <div className="flex gap-[16px]">
                                    <div className="grid gap-2 mt-[24px]">
                                        <Label
                                            htmlFor="fullname"
                                            className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                                        >
                                            Cost
                                        </Label>
                                        <Input
                                            id="fullname"
                                            type="text"
                                            placeholder="N0.00"
                                            className="h-[48px] rounded-xl bg-light_grey font-sans font-medium text-[14px] text-text-grey border-0 focus:outline-none w-[380px] px-[10px]"
                                            defaultValue={selectedPromotion ? formattedCurrency(selectedPromotion.price) : ""}
                                        />
                                    </div>
                                    <div className="grid gap-2 mt-[24px]">
                                        <Label
                                            htmlFor="fullname"
                                            className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                                        >
                                            Unit
                                        </Label>
                                        <Input
                                            id="fullname"
                                            type="text"
                                            placeholder="1"
                                            className="h-[48px] rounded-xl bg-light_grey form-font border-0 focus:outline-none px-[10px] w-[148px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {
                                <div
                                    className="w-[640px] p-[16px] px-[16px] bg-light-tint rounded-[12px] mt-[24px] border-[1px] border-light-green-tint">
                                    <p className="font-sans font-semibold text-[12px] leading-[14.4px]">
                                        BREAKDOWN
                                    </p>
                                    <div className="flex flex-col mt-[12px] gap-[12px]">
                                        {
                                            selectedPromotion && selectedPromotion?.breakdown?.length > 0 && selectedPromotion?.breakdown?.map((breakdown, index: number) => (
                                                <div className="flex gap-[8px] items-center" key={index}>
                                                    <ChevronRightFilled/>
                                                    <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-black-light">
                                                        {breakdown}
                                                    </p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                        <div>
                            <div className="w-[480px] rounded-[12px] p-[24px] px-[16px] bg-white">
                                <p className="font-sans font-semibold text-[20px] leading-[28px]">
                                    Summary
                                </p>
                                <div className="flex justify-between mt-[16px]">
                                    <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">
                                        {selectedPromotion ? selectedPromotion?.name : "-"}
                                    </p>
                                    <p className="font-sans font-semibold text-[14px] leading-[21px]">
                                        {formattedCurrency(selectedPromotion?.price)}
                                    </p>
                                </div>
                                <div className="flex justify-between mt-[16px]">
                                    <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">
                                        Unit
                                    </p>
                                    <p className="font-sans font-semibold text-[14px] leading-[21px]">
                                        {selectedPromotion ? unit : "-"}
                                    </p>
                                </div>
                                <div className="border-t-[1px] border-t-mid-grey my-[16px]"></div>
                                <div className="flex justify-between mt-[16px]">
                                    <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">
                                        Subtotal
                                    </p>
                                    <p className="font-sans font-semibold text-[14px] leading-[21px]">
                                        {selectedPromotion ? formattedCurrency(subtotal) : "-"}
                                    </p>
                                </div>
                                <div className="border-t-[1px] border-t-mid-grey my-[16px]"></div>
                                <div className="flex justify-between mt-[16px]">
                                    <p className="font-sans font-normal text-[18px] leading-[21px] tracking-custom text-text-grey">
                                        Total
                                    </p>
                                    <p className="font-sans font-semibold text-[18px] leading-[21px]">
                                        {selectedPromotion ? formattedCurrency(subtotal) : "-"}
                                    </p>
                                </div>
                                <div
                                    className="mt-[24px] flex justify-around gap-[16px] items-center pt-[16px] pl-[16px] pr-[16px]">
                                    <div className="">
                                        <p className="font-sans font-bold text-mid-green">
                                            {selectedPromotion ? formattedCurrency(subtotal) : "-"}
                                        </p>
                                    </div>
                                    <div className="relative flex flex-col items-center group">
                                        <button
                                            className={`bg-gradient-green px-[48px] p-[14px] h-[48px] flex items-center rounded-[12px] border-step-color shadow-custom-bottom ${
                                                selectedPromotion === null || promotionLoading
                                                    ? "opacity-60 cursor-not-allowed"
                                                    : ""
                                            }`}
                                            onClick={handlePaymentForPromotion}
                                            type="button"
                                            disabled={promotionLoading || selectedPromotion === null}
                                        >
                                            {promotionLoading ? (
                                                <ColorRing
                                                    visible={true}
                                                    height="30"
                                                    width="30"
                                                    ariaLabel="color-ring-loading"
                                                    wrapperStyle={{}}
                                                    wrapperClass="color-ring-wrapper"
                                                    colors={[
                                                        "#e15b64",
                                                        "#f47e60",
                                                        "#f8b26a",
                                                        "#abbd81",
                                                        "#849b87",
                                                    ]}
                                                />
                                            ) : (
                                                <p className="font-sans font-semi-normal text-[16px] text-white">
                                                    Pay now
                                                </p>
                                            )}
                                        </button>

                                        {/* Tooltip — only shows on hover */}
                                        {(selectedPromotion === null || promotionLoading) && (
                                            <div
                                                className="absolute top-full mt-2 w-max bg-gray-800 text-white text-xs font-sans rounded-md px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                                {selectedPromotion === null
                                                    ? "Please select a promotion first"
                                                    : "Please wait, processing..."}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </MainLayout>
    );
}

export default PromoteEventPage;
