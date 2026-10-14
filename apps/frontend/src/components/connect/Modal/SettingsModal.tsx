"use client";
import { images } from "@/lib/images";
import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import Switch from "react-switch";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useUpdateVisibilityMutation } from "@/features/connect/mutations";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { ConnectionInfo } from "@/features/connect/api";

type SettingsInterface = {
  toggle: () => void;
  isOpen: boolean;
  user_connect: ConnectionInfo | undefined;
};

const SettingsModal: React.FC<SettingsInterface> = ({ toggle, isOpen, user_connect }) => {
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(Boolean(user_connect?.user?.visibility));
  const updateVisibilityMutation = useUpdateVisibilityMutation();

  const handleChange = () => {
    updateVisibilityMutation.mutate(!checked, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Visibility updated",
            type: "success",
          }),
        );
        setChecked(!checked);
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
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Visibility settings"}</DialogTitle>
        <div className="laptop:h-[40vh] laptop:w-120 laptop:rounded-lg h-screen w-screen rounded-none bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon className="w-2.75" />
              </div>
              <p className="text-body-l font-semibold">Visibility settings</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <div className="bg-light-green-10 flex w-full flex-col items-center justify-center rounded-xl pt-3 pb-3">
                <div className="relative">
                  <Image src={images.LEMON} alt="lemon" width={33} height={41} />
                  <p className="text-meta absolute bottom-3.5 left-2 text-center leading-normal font-semibold text-black">
                    {user_connect?.user?.lemon_id_short}
                  </p>
                </div>
                <p className="text-body-xl font-semibold">{user_connect?.user?.lemon_id_full}</p>
              </div>
              <div className="mt-8 flex justify-between">
                <div className="flex flex-col">
                  <p className="text-body-l font-semibold">Turn on visibility</p>
                  <p className="font-semi-normal text-text-grey text-meta leading-normal">
                    Your live location will be visible to everybody
                  </p>
                </div>
                <div>
                  <Switch
                    onChange={() => {
                      handleChange();
                    }}
                    checked={checked}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    onColor="#9BE303"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default SettingsModal;
