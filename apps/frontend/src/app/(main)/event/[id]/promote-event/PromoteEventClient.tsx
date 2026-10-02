"use client";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Label, Input } from "@lemonade/ui";
import ChevronRightFilled from "@/images/icons/chevronRightFilled.svg";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { usePromotionsQuery } from "@/features/events/queries";
import { usePayForPromotionMutation } from "@/features/events/mutations";
import { PromotionInterface } from "@/interfaces/EventInterface";
import moment from "moment";
import { ColorRing } from "react-loader-spinner";
import { updateToastifyReducer } from "@/redux/toastifySlice";

function PromoteEventClient({ id }: { id: number }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: promotionsData, isLoading: loading } = usePromotionsQuery();
  const promotions = promotionsData?.promotions ?? [];
  const payForPromotionMutation = usePayForPromotionMutation();
  const promotionLoading = payForPromotionMutation.isPending;
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionInterface | null>(null);
  const [unit, setUnit] = useState<number>(1);

  const handleSelectPromotion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const foundPromotion = promotions.find((promotion) => promotion.id === selectedId) || null;
    setSelectedPromotion(foundPromotion);
    setUnit(1);
  };

  const cost = selectedPromotion ? selectedPromotion.price : 0;
  const subtotal = cost * unit;
  const formattedCurrency = (amount?: number) =>
    amount ? `₦${amount.toLocaleString("en-NG")}` : "-";

  const handlePaymentForPromotion = async () => {
    const formatted = moment().format("YYYY-MM-DD");
    const redirect_url = `${process.env.NEXT_PUBLIC_APP_URL}/event/${id}/details`;
    const payload = {
      promo: selectedPromotion?.id,
      unit,
      promotion_date: formatted,
      redirect_url,
    };
    payForPromotionMutation.mutate(
      { id, data: payload },
      {
        onSuccess: (result) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Redirecting to payment gateway. Please wait",
              type: "success",
            }),
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
            }),
          );
        },
      },
    );
  };
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Promote event</p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <div className="flex justify-between gap-[100px]">
            <div className="flex flex-col">
              <div className="w-[640px] rounded-xl bg-white p-6 px-12">
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="fullname"
                    className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                  >
                    Service
                  </Label>
                  {loading ? (
                    <div></div>
                  ) : (
                    <select
                      className="form-font bg-light_grey h-12 rounded-xl border-0 p-3"
                      onChange={handleSelectPromotion}
                      value={selectedPromotion?.id}
                    >
                      <option>Select service</option>
                      {promotions?.length > 0 &&
                        promotions?.map((promotion, index: number) => (
                          <option key={index} value={promotion.id}>
                            {promotion.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="fullname"
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Cost
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="N0.00"
                      className="bg-light_grey text-text-grey h-12 w-[380px] rounded-xl border-0 px-2.5 font-sans text-[14px] font-medium focus:outline-none"
                      defaultValue={
                        selectedPromotion ? formattedCurrency(selectedPromotion.price) : ""
                      }
                    />
                  </div>
                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="fullname"
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Unit
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="1"
                      className="form-font bg-light_grey h-12 w-[148px] rounded-xl border-0 px-2.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {
                <div className="border-light-green-tint bg-light-tint mt-6 w-[640px] rounded-xl border p-4 px-4">
                  <p className="font-sans text-[12px] leading-[14.4px] font-semibold">BREAKDOWN</p>
                  <div className="mt-3 flex flex-col gap-3">
                    {selectedPromotion &&
                      selectedPromotion?.breakdown?.length > 0 &&
                      selectedPromotion?.breakdown?.map((breakdown, index: number) => (
                        <div className="flex items-center gap-2" key={index}>
                          <ChevronRightFilled />
                          <p className="tracking-custom text-black-light font-sans text-[14px] leading-[21px] font-normal">
                            {breakdown}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              }
            </div>
            <div>
              <div className="w-[480px] rounded-xl bg-white p-6 px-4">
                <p className="font-sans text-[20px] leading-[28px] font-semibold">Summary</p>
                <div className="mt-4 flex justify-between">
                  <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                    {selectedPromotion ? selectedPromotion?.name : "-"}
                  </p>
                  <p className="font-sans text-[14px] leading-[21px] font-semibold">
                    {formattedCurrency(selectedPromotion?.price)}
                  </p>
                </div>
                <div className="mt-4 flex justify-between">
                  <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                    Unit
                  </p>
                  <p className="font-sans text-[14px] leading-[21px] font-semibold">
                    {selectedPromotion ? unit : "-"}
                  </p>
                </div>
                <div className="border-t-mid-grey my-4 border-t"></div>
                <div className="mt-4 flex justify-between">
                  <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                    Subtotal
                  </p>
                  <p className="font-sans text-[14px] leading-[21px] font-semibold">
                    {selectedPromotion ? formattedCurrency(subtotal) : "-"}
                  </p>
                </div>
                <div className="border-t-mid-grey my-4 border-t"></div>
                <div className="mt-4 flex justify-between">
                  <p className="tracking-custom text-text-grey font-sans text-[18px] leading-[21px] font-normal">
                    Total
                  </p>
                  <p className="font-sans text-[18px] leading-[21px] font-semibold">
                    {selectedPromotion ? formattedCurrency(subtotal) : "-"}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-around gap-4 pt-4 pr-4 pl-4">
                  <div className="">
                    <p className="text-mid-green font-sans font-bold">
                      {selectedPromotion ? formattedCurrency(subtotal) : "-"}
                    </p>
                  </div>
                  <div className="group relative flex flex-col items-center">
                    <button
                      className={`border-step-color bg-gradient-green shadow-custom-bottom flex h-12 items-center rounded-xl p-3.5 px-12 ${
                        selectedPromotion === null || promotionLoading
                          ? "cursor-not-allowed opacity-60"
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
                          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
                        />
                      ) : (
                        <p className="font-semi-normal font-sans text-[16px] text-white">Pay now</p>
                      )}
                    </button>

                    {/* Tooltip — only shows on hover */}
                    {(selectedPromotion === null || promotionLoading) && (
                      <div className="pointer-events-none absolute top-full mt-2 w-max rounded-md bg-gray-800 px-3 py-2 font-sans text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
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

export default PromoteEventClient;
