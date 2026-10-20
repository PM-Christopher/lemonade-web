import { routes } from "@/lib/routes";
import { appUrl } from "@/lib/app-url";
import React, { lazy, Suspense } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import CheckedIcon from "@/images/icons/checkedIcon.svg";
import { useAppDispatch } from "@/redux/hook";
import { useJoinTribeMutation } from "@/features/tribes/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { errorMessage } from "@/lib/api-error";
import { formatNairaWhole } from "@/lib/formatNumber";
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
    const redirect_url = appUrl(routes.TRIBE_DETAIL(id));
    joinTribeMutation.mutate(
      { redirect_url },
      {
        onSuccess: (result) => {
          // A paid tribe goes to checkout first. The page confirms the join once payment clears.
          if (result.authorization_url) {
            window.location.href = result.authorization_url;
            return;
          }
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage("Joined tribe successfully"),
              type: "success",
            }),
          );
          toggle();
        },
        onError: (error) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: errorMessage(error, "Could not join tribe"),
              type: "error",
            }),
          );
        },
      },
    );
  };

  const joinButton = (
    <Button
      className="auth-button laptop:h-auto laptop:w-auto h-12 w-full rounded-xl p-2.5 px-3.5"
      onClick={() => handleJoinTribe(tribe?.slug ?? "")}
      disabled={tribeLoading}
    >
      {tribeLoading ? (
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
        <p className="font-semi-normal text-field font-sans">Join Tribe now</p>
      )}
    </Button>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="laptop:top-[50%] laptop:bottom-auto laptop:left-[50%] laptop:w-fit laptop:translate-x-[-50%] laptop:translate-y-[-50%] laptop:rounded-lg fixed top-auto bottom-0 left-0 w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-t-2xl rounded-b-none border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Unlock Exclusive content!</DialogTitle>
        <div className="laptop:w-160 laptop:rounded-lg w-full rounded-t-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </button>
              <p className="text-body-xl laptop:block hidden font-sans font-semibold">
                Unlock Exclusive content!
              </p>
            </div>
            <div className="laptop:block hidden">{joinButton}</div>
          </div>
          <p className="text-body-xl laptop:hidden mt-6 text-center font-sans font-semibold">
            Unlock Exclusive Content!
          </p>
          <div className="laptop:mt-10 mt-4 flex flex-col items-center">
            <div className="flex justify-center">
              <div className="border-step-color bg-light-green-10 laptop:w-136 flex w-full flex-col items-center rounded-xl border-2 p-4">
                <p className="font-semi-normal text-body-s font-sans">Membership fee</p>
                <p className="text-title-l mt-2 font-sans font-semibold">
                  {formatNairaWhole(tribe?.membership_fee)}
                </p>
              </div>
            </div>

            <div className="my-6 flex justify-center">
              <div className="laptop:w-136 flex w-full justify-center">
                <p className="text-body-s text-center font-sans font-semibold">
                  {tribe?.tribe_name}{" "}
                  <span className="font-semi-normal">
                    offers exclusive content and discussions for a membership fee set by the Tribe
                    creator. Join now and enjoy this exclusive benefits
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-light_grey flex justify-center rounded-xl">
              <div className="laptop:w-136 flex w-full flex-col gap-4 p-4 py-6">
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal text-body-s font-sans">
                    Access to in-depth content
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal text-body-s font-sans">Gain valuable knowledge</p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal text-body-s font-sans">
                    Connect with your community
                  </p>
                </div>
              </div>
            </div>
            <div className="laptop:hidden mt-6 w-full">{joinButton}</div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default JoinTribeModal;
