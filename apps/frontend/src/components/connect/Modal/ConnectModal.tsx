import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import { Button, Label, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import * as yup from "yup";
import { useFormik } from "formik";
import { useAppDispatch } from "@/redux/hook";
import { useSendInviteMutation } from "@/features/connect/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { getDistanceFromLatLonInKm } from "@/lib/helper";

type ConnectInterface = {
  toggle: () => void;
  isOpen: boolean;
  users: any;
  authUser: any;
};

const ConnectModal: React.FC<ConnectInterface> = ({ toggle, isOpen, users, authUser }) => {
  const dispatch = useAppDispatch();
  const sendInviteMutation = useSendInviteMutation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = users[currentIndex];
  const connectSchema = yup.object({
    message: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: connectSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      sendConnect(values);
    },
  });

  const sendConnect = (values: { message: string }) => {
    sendInviteMutation.mutate(
      { ...values, invitee_id: user?.id },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Invite sent successfully",
              type: "success",
            }),
          );
          formik.resetForm();
          toggle();
        },
        onError: (err: any) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: err?.message || "Something went wrong",
              type: "error",
            }),
          );
          formik.resetForm();
        },
      },
    );
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!user) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Connect"}</DialogTitle>
        <form
          onSubmit={formik.handleSubmit}
          className="hide-scrollbar laptop:h-auto laptop:max-h-[90vh] laptop:w-[480px] laptop:scale-95 laptop:rounded-2xl h-screen w-screen scale-100 transform overflow-y-auto rounded-none bg-white p-6 shadow-2xl transition-all duration-300 hover:scale-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                className="rounded-full p-2 transition-all hover:bg-gray-100"
              >
                <CloseIcon className="w-3" />
              </button>
              <p className="text-[16px] font-semibold text-gray-800">Connect</p>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 flex flex-col items-center space-y-2 text-center">
            {/* Profile Avatar */}
            <div className="relative h-10 w-10">
              <Image src="/images/lemon.png" alt="lemon" width={40} height={40} />
              <p className="absolute bottom-2 left-2 text-[12px] font-semibold text-black">
                L{user?.short_lemon_id}
              </p>
            </div>

            {/* User Info */}
            <p className="text-[18px] font-semibold text-gray-900">{user?.long_lemon_id}</p>
            <p className="text-[14px] text-gray-700">{user?.username}</p>
            <p className="text-[12px] text-gray-500">{user?.industry}</p>

            {/* Distance */}
            <div className="text-mid-green mt-3 flex items-center gap-2 text-[12px]">
              <LocationIcon />
              <p>
                {getDistanceFromLatLonInKm(
                  authUser?.connect_info?.latitude,
                  authUser?.connect_info?.longitude,
                  user?.connect_info?.latitude,
                  user?.connect_info?.longitude,
                )}{" "}
                kms away
              </p>
            </div>

            {/* Already Connected */}
            {user?.hasConnected ? (
              <p className="text-text-grey mt-6 text-[12px]">You are already connected!</p>
            ) : (
              <>
                {/* Invite Message */}
                <div className="mt-6 grid w-full gap-2">
                  <div className="flex justify-between text-[13px] text-gray-500">
                    <Label htmlFor="message">Invite message</Label>
                    <span>100 characters</span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    onChange={formik.handleChange}
                    value={formik.values.message}
                    placeholder="Write a short friendly invite..."
                    className="bg-light_grey h-[120px] w-full resize-none rounded-xl border-0 p-3 px-4 text-sm text-gray-700 transition-all outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>

                {/* Send Button */}
                <div className="mt-6 w-full">
                  <Button
                    type="submit"
                    className="bg-gradient-green shadow-custom-bottom h-12 w-full rounded-xl transition-all hover:brightness-110"
                  >
                    <p className="text-[16px] font-medium">Send Invite</p>
                  </Button>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex w-full justify-between px-2">
              <Button
                variant="outline"
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="transition-all hover:bg-gray-100"
              >
                ← Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentIndex === users.length - 1}
                onClick={handleNext}
                className="transition-all hover:bg-gray-100"
              >
                Next →
              </Button>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default ConnectModal;
