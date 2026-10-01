"use client";
import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import Switch from "react-switch";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useUpdateVisibilityMutation } from "@/features/connect/mutations";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";

type SettingsInterface = {
  toggle: () => void;
  isOpen: boolean;
  user_connect: any;
};

const SettingsModal: React.FC<SettingsInterface> = ({ toggle, isOpen, user_connect }) => {
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(user_connect?.user?.visibility ?? false);
  const { user } = useSelector((state: any) => state.auth);
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
      onError: (err: any) => {
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
        <div className="laptop:h-[40vh] laptop:w-[480px] laptop:rounded-lg h-screen w-screen rounded-none bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon className="w-[11.25px]" />
              </div>
              <p className="text-[16px] font-semibold">Visibility settings</p>
            </div>
          </div>
          <div className="mt-[24px]">
            <div className="flex flex-col">
              <div className="bg-light-green-10 flex w-full flex-col items-center justify-center rounded-[12px] pt-[12px] pb-[12px]">
                <div className="relative">
                  <Image src={"/images/lemon.png"} alt="lemon" width={33} height={41} />
                  <p className="absolute bottom-3.5 left-2 text-center text-[12px] font-semibold text-black">
                    {user_connect?.user?.lemon_id_short}
                  </p>
                </div>
                <p className="text-[18px] font-semibold">{user_connect?.user?.lemon_id_full}</p>
              </div>
              <div className="mt-[32px] flex justify-between">
                <div className="flex flex-col">
                  <p className="text-[16px] font-semibold">Turn on visibility</p>
                  <p className="font-semi-normal text-text-grey text-[12px]">
                    Your live location will be visible to everybody
                  </p>
                </div>
                <div>
                  <Switch
                    onChange={(change) => {
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
