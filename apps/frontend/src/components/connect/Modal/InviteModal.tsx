import { images } from "@/lib/images";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { formatDistanceAway, formatStringUCFirst } from "@/lib/helper";
import { useAppDispatch } from "@/redux/hook";
import { useInviteResponseMutation } from "@/features/connect/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { ChatInvite } from "@/features/connect/api";

type InviteInterface = {
  toggle: () => void;
  isOpen: boolean;
  invite: ChatInvite;
};

const InviteModal: React.FC<InviteInterface> = ({ toggle, isOpen, invite }) => {
  const dispatch = useAppDispatch();
  const distance = formatDistanceAway(invite?.distance_km);
  const inviteResponseMutation = useInviteResponseMutation();

  const requestAction = (action: "accepted" | "rejected") => {
    inviteResponseMutation.mutate(
      { id: invite.id, option: action },
      {
        onSuccess: (res) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: res.message,
              type: "success",
            }),
          );
          toggle();
        },
        onError: (err: { message?: string }) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: err?.message || "Something went wrong",
              type: "error",
            }),
          );
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
        <DialogTitle className="sr-only">{"New Invite"}</DialogTitle>
        <div className="hide-scrollbar laptop:h-auto laptop:max-h-[90vh] laptop:w-120 laptop:rounded-lg flex h-screen w-full flex-col justify-between overflow-y-auto rounded-none bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full p-2 transition-all hover:bg-gray-100"
                onClick={toggle}
              >
                <CloseIcon className="w-3" />
              </button>
              <p className="text-body-l font-semibold text-gray-900">New Invite</p>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 flex flex-col items-center space-y-3 text-center">
            {/* Avatar */}
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              <Image src={images.LEMON} alt="lemon" fill className="object-contain" />
              <p className="text-meta absolute inset-0 flex items-center justify-center leading-normal font-semibold text-black">
                {invite?.invitee?.lemon_id_short}
              </p>
            </div>

            {/* User Info */}
            <p className="text-body-xl font-semibold text-gray-900">
              {invite?.invitee?.lemon_id_full}
            </p>
            <p className="text-body-s text-gray-700">{invite?.invitee?.username}</p>
            {invite?.invitee?.bio && (
              <p className="text-body-s text-gray-700">{invite?.invitee?.bio}</p>
            )}
            {invite?.invitee?.industry && (
              <p className="text-meta leading-normal text-gray-500">
                {formatStringUCFirst(invite?.invitee?.industry)}
              </p>
            )}

            {/* Distance */}
            {distance && (
              <div className="text-mid-green text-meta mt-2 flex items-center gap-2 leading-normal">
                <LocationIcon />
                <p>{distance}</p>
              </div>
            )}

            {/* Message */}
            {invite?.message && (
              <div className="bg-light_grey mt-4 flex w-full max-w-96 flex-col rounded-lg p-4">
                <p className="text-meta leading-normal font-medium text-gray-500">Message</p>
                <p className="text-body-s mt-1 text-gray-800">{invite?.message}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex w-full gap-4">
            <Button
              className="h-12 flex-1 rounded-lg border border-gray-300 bg-white transition-all hover:bg-gray-50"
              onClick={() => requestAction("rejected")}
              loading={
                inviteResponseMutation.isPending &&
                inviteResponseMutation.variables?.option === "rejected"
              }
              disabled={inviteResponseMutation.isPending}
            >
              <p className="text-body-l font-medium text-gray-900">Reject Invite</p>
            </Button>
            <Button
              className="bg-gradient-green h-12 flex-1 rounded-lg shadow-lg transition-all hover:brightness-105"
              onClick={() => requestAction("accepted")}
              loading={
                inviteResponseMutation.isPending &&
                inviteResponseMutation.variables?.option === "accepted"
              }
              disabled={inviteResponseMutation.isPending}
            >
              <p className="text-body-l font-medium">Accept Invite</p>
            </Button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default InviteModal;
