import React, { lazy, Suspense } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import CheckedIcon from "@/images/icons/checkedIcon.svg";
import { useAppDispatch } from "@/redux/hook";
import { useJoinTribeMutation } from "@/features/tribes/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import type { TribeInterface } from "@/interfaces/TribeInterface";

const ColorRing = lazy(() =>
  import("react-loader-spinner").then((mod) => ({ default: mod.ColorRing })),
);

type JoinTribeInterface = {
  toggle: () => void;
  isOpen: boolean;
  tribe: TribeInterface | null;
};

const JoinTribeModal: React.FC<JoinTribeInterface> = ({ toggle, isOpen, tribe }) => {
  const dispatch = useAppDispatch();
  const joinTribeMutation = useJoinTribeMutation(tribe?.slug ?? "");
  const tribeLoading = joinTribeMutation.isPending;

  const handleJoinTribe = (id: string) => {
    const redirect_url = `${process.env.NEXT_PUBLIC_APP_URL}/tribe/${id}`;
    joinTribeMutation.mutate(
      { redirect_url },
      {
        onSuccess: (result) => {
          if (result.authorization_url) {
            window.location.href = result.authorization_url;
          }
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Joined tribe successfully",
              type: "success",
            }),
          );
          toggle();
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Unlock Exclusive content!</DialogTitle>
        <div className="w-[640px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
              <p className="font-sans text-[18px] leading-[27px] font-semibold">
                Unlock Exclusive content!
              </p>
            </div>
            <div>
              <Button
                className="auth-button shadow-green-inset hover:shadow-green-inset-strong rounded-xl p-2.5 px-3.5"
                onClick={() => handleJoinTribe(tribe?.slug ?? "")}
                disabled={tribeLoading}
              >
                {tribeLoading ? (
                  <Suspense fallback={null}><ColorRing
                    visible={true}
                    height="30"
                    width="30"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
                  /></Suspense>
                ) : (
                  <p className="font-semi-normal font-sans text-[16px] leading-[19.2px]">
                    Join Tribe now
                  </p>
                )}
              </Button>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center">
            <div className="flex justify-center">
              <div className="border-step-color bg-light-green-10 flex w-[544px] flex-col items-center rounded-xl border-2 p-4">
                <p className="font-semi-normal font-sans text-[14px] leading-[21px]">
                  Membership fee
                </p>
                <p className="mt-2 font-sans text-[24px] leading-[33.6px] font-semibold">
                  N {formatNumberWithCommas(tribe?.membership_fee)}
                </p>
              </div>
            </div>

            <div className="my-6 flex justify-center">
              <div className="flex w-[544px] justify-center">
                <p className="text-center font-sans text-[14px] leading-[21px] font-semibold">
                  {tribe?.tribe_name}{" "}
                  <span className="font-semi-normal">
                    offers exclusive content and discussions for a membership fee set by the Tribe
                    creator. Join now and enjoy this exclusive benefits
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-light_grey flex justify-center rounded-xl">
              <div className="flex w-[544px] flex-col gap-4 p-4 py-6">
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal font-sans text-[14px] leading-[21px]">
                    Access to in-depth content
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal font-sans text-[14px] leading-[21px]">
                    Gain valuable knowledge
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal font-sans text-[14px] leading-[21px]">
                    Connect with your community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default JoinTribeModal;
