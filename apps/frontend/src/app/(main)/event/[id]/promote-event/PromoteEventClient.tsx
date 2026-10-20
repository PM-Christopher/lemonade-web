"use client";
import { routes } from "@/lib/routes";
import { appUrl } from "@/lib/app-url";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState, lazy, Suspense } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Label, Input, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { ChevronUp, X } from "lucide-react";
import ChevronRightFilled from "@/images/icons/chevronRightFilled.svg";
import MainLayout from "@/components/layouts/MainLayout";

import { useAppDispatch } from "@/redux/hook";
import { usePromotionsQuery } from "@/features/events/queries";
import { usePayForPromotionMutation } from "@/features/events/mutations";
import { PromotionInterface } from "@/interfaces/EventInterface";
import moment from "moment";
import { updateToastifyReducer } from "@/redux/toastifySlice";

const ColorRing = lazy(() =>
  import("react-loader-spinner").then((mod) => ({ default: mod.ColorRing })),
);

function PromoteEventClient({ id }: { id: number }) {
  const { back } = useNavigation();
  const dispatch = useAppDispatch();
  const { data: promotionsData, isLoading: loading } = usePromotionsQuery();
  const promotions = promotionsData?.promotions ?? [];
  const payForPromotionMutation = usePayForPromotionMutation();
  const promotionLoading = payForPromotionMutation.isPending;
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionInterface | null>(null);
  const [unit, setUnit] = useState<number>(1);
  const [summaryOpen, setSummaryOpen] = useState(false);

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
    const redirect_url = appUrl(routes.EVENT_DETAILS(id));
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
  const payButton = (
    <div className="group relative flex flex-col items-center">
      <button
        className={`border-step-color bg-gradient-green flex h-12 items-center rounded-xl p-3.5 px-12 ${
          selectedPromotion === null || promotionLoading ? "cursor-not-allowed opacity-60" : ""
        }`}
        onClick={handlePaymentForPromotion}
        type="button"
        disabled={promotionLoading || selectedPromotion === null}
      >
        {promotionLoading ? (
          <Suspense fallback={null}>
            <ColorRing
              visible={true}
              height="30"
              width="30"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </Suspense>
        ) : (
          <p className="font-semi-normal text-body-l font-sans text-white">Pay now</p>
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
  );

  const summaryRows = (
    <>
      <div className="mt-4 flex justify-between">
        <p className="tracking-custom text-text-grey text-body-s font-sans font-normal">
          {selectedPromotion ? selectedPromotion?.name : "-"}
        </p>
        <p className="text-body-s font-sans font-semibold">
          {formattedCurrency(selectedPromotion?.price)}
        </p>
      </div>
      <div className="mt-4 flex justify-between">
        <p className="tracking-custom text-text-grey text-body-s font-sans font-normal">Unit</p>
        <p className="text-body-s font-sans font-semibold">{selectedPromotion ? unit : "-"}</p>
      </div>
      <div className="border-t-mid-grey my-4 border-t"></div>
      <div className="mt-4 flex justify-between">
        <p className="tracking-custom text-text-grey text-body-s font-sans font-normal">Subtotal</p>
        <p className="text-body-s font-sans font-semibold">
          {selectedPromotion ? formattedCurrency(subtotal) : "-"}
        </p>
      </div>
      <div className="border-t-mid-grey my-4 border-t"></div>
      <div className="mt-4 flex justify-between">
        <p className="tracking-custom text-text-grey text-body-xl font-sans leading-5.25 font-normal">
          Total
        </p>
        <p className="text-body-xl font-sans leading-5.25 font-semibold">
          {selectedPromotion ? formattedCurrency(subtotal) : "-"}
        </p>
      </div>
    </>
  );

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between bg-white p-3 px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => back()}
          >
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">Promote event</p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center px-4">
          <div className="laptop:w-auto laptop:flex-row laptop:gap-25 flex w-full flex-col justify-between gap-4">
            <div className="laptop:w-auto flex w-full min-w-0 flex-col">
              <div className="laptop:w-160 laptop:px-12 laptop:p-6 w-full rounded-xl bg-white p-4">
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="fullname"
                    className="text-text-grey text-label font-sans font-normal"
                  >
                    Service
                  </Label>
                  {loading ? (
                    <div></div>
                  ) : (
                    <select
                      className="form-font bg-light_grey h-12 w-full min-w-0 rounded-xl border-0 p-3"
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
                  <div className="laptop:flex-none mt-6 grid min-w-0 flex-1 gap-2">
                    <Label
                      htmlFor="fullname"
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Cost
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="N0.00"
                      className="bg-light_grey text-text-grey text-body-s laptop:w-95 h-12 w-full rounded-xl border-0 px-2.5 font-sans font-medium focus:outline-none"
                      defaultValue={
                        selectedPromotion ? formattedCurrency(selectedPromotion.price) : ""
                      }
                    />
                  </div>
                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="fullname"
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Unit
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="1"
                      className="form-font bg-light_grey laptop:w-37 h-12 w-24 rounded-xl border-0 px-2.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {
                <div className="border-light-green-tint bg-light-tint laptop:w-160 mt-4 w-full rounded-xl border p-4 px-4">
                  <p className="text-meta font-sans font-semibold">BREAKDOWN</p>
                  <div className="mt-3 flex flex-col gap-3">
                    {selectedPromotion &&
                      selectedPromotion?.breakdown?.length > 0 &&
                      selectedPromotion?.breakdown?.map((breakdown, index: number) => (
                        <div className="flex items-center gap-2" key={index}>
                          <ChevronRightFilled />
                          <p className="tracking-custom text-black-light text-body-s font-sans font-normal">
                            {breakdown}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              }
            </div>
            <div className="laptop:block hidden">
              <div className="laptop:w-120 w-full rounded-xl bg-white p-6 px-4">
                <p className="text-title-r font-sans font-semibold">Summary</p>
                {summaryRows}
                <div className="mt-6 flex items-center justify-around gap-4 pt-4 pr-4 pl-4">
                  <div className="">
                    <p className="text-mid-green font-sans font-bold">
                      {selectedPromotion ? formattedCurrency(subtotal) : "-"}
                    </p>
                  </div>
                  {payButton}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="laptop:hidden border-mid-grey fixed inset-x-0 bottom-16 z-40 flex items-center justify-between gap-4 border-t bg-white p-4">
          <button
            type="button"
            onClick={() => setSummaryOpen(true)}
            className="text-mid-green flex cursor-pointer items-center gap-2 font-sans font-bold"
            aria-label="View summary"
          >
            {selectedPromotion ? formattedCurrency(subtotal) : "-"}
            <ChevronUp className="h-4 w-4" />
          </button>
          {payButton}
        </div>
        <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
          <DialogContentBare className="laptop:hidden fixed top-auto bottom-0 left-0 w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-t-2xl rounded-b-none border-0 bg-white p-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-title-r font-sans font-semibold">Summary</DialogTitle>
              <button type="button" aria-label="Close" onClick={() => setSummaryOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            {summaryRows}
            <div className="mt-6 flex justify-end">{payButton}</div>
          </DialogContentBare>
        </Dialog>
      </section>
    </MainLayout>
  );
}

export default PromoteEventClient;
