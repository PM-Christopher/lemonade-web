import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isOpen ? "visible bg-gray-800/50 opacity-100" : "invisible opacity-0"}`}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="hide-scrollbar h-screen w-screen scale-100 transform overflow-y-auto rounded-none bg-white p-6 shadow-2xl transition-all duration-300 hover:scale-100 laptop:h-auto laptop:max-h-[90vh] laptop:w-[480px] laptop:scale-95 laptop:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="rounded-full p-2 transition-all hover:bg-gray-100"
            >
              <CloseIcon className="w-[12px]" />
            </button>
            <p className="text-[16px] font-semibold text-gray-800">Connect</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 flex flex-col items-center space-y-2 text-center">
          {/* Profile Avatar */}
          <div className="relative h-[40px] w-[40px]">
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
          <div className="mt-3 flex items-center gap-2 text-[12px] text-mid-green">
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
            <p className="mt-6 text-[12px] text-text-grey">You are already connected!</p>
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
                  className="h-[120px] w-full resize-none rounded-xl border-0 bg-light_grey p-3 px-4 text-sm text-gray-700 outline-none transition-all focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Send Button */}
              <div className="mt-6 w-full">
                <Button
                  type="submit"
                  className="h-[48px] w-full rounded-xl bg-gradient-green shadow-custom-bottom transition-all hover:brightness-110"
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
    </div>
  );
};

export default ConnectModal;
