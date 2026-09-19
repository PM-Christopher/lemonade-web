"use client";
import React, { useEffect, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import Switch from "react-switch";
import { useAppDispatch } from "@/redux/hook";
import { useUpdateNotificationSettingsMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
type NotificationSettingsInterface = {
  toggle: () => void;
  isOpen: boolean;
  settings: any;
  renderHeader: any;
  type: any;
};

const NotificationSettingsModal: React.FC<NotificationSettingsInterface> = ({
  toggle,
  isOpen,
  settings,
  renderHeader,
  type,
}) => {
  const dispatch = useAppDispatch();
  const updateNotificationSettingsMutation =
    useUpdateNotificationSettingsMutation();
  const [emailChecked, setEmailChecked] = useState(false);
  const [inAppChecked, setInAppChecked] = useState(false);

  const handleChange = (type: string) => {
    if (type === "email") {
      setEmailChecked((prev) => !prev);
    } else if (type === "in-app") {
      setInAppChecked((prev) => !prev);
    }
    handleUpdateSettings(type);
  };

  const handleUpdateSettings = (s_type: string) => {
    const data = {
      type,
      settings: {
        email: s_type === "email" ? !emailChecked : emailChecked,
        in_app_notification: s_type === "in-app" ? !inAppChecked : inAppChecked,
      },
    };
    updateNotificationSettingsMutation.mutate(data, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "App settings Updated",
            type: "success",
          }),
        );
        toggle();
      },
      onError: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Something went wrong",
            type: "error",
          }),
        );
      },
    });
  };

  useEffect(() => {
    setEmailChecked(settings.email);
    setInAppChecked(settings.in_app_notification);
  }, [settings]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Notification settings</DialogTitle>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="modal"
              className="w-full rounded-none bg-white p-6 shadow-lg laptop:w-[640px] laptop:rounded-lg"
              initial={{ y: "50%" }}
              animate={{ y: 0 }}
              exit={{ y: "50%" }}
              transition={{ type: "spring", stiffness: 50, damping: 30 }}
            >
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="cursor-pointer" onClick={toggle}>
                      <CloseIcon className="w-[11.25px]" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[16px] font-semibold">
                        {renderHeader()?.title}
                      </p>
                      <p className="text-[14px] font-normal text-text-grey">
                        {renderHeader()?.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-[24px]">
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center justify-between">
                      <p className="text-[16px] font-normal">
                        In-app notification
                      </p>
                      <Switch
                        onChange={(change) => {
                          handleChange("in-app");
                        }}
                        checked={inAppChecked}
                        checkedIcon={false}
                        uncheckedIcon={false}
                        onColor="#9BE303"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[16px] font-normal">Email</p>
                      <Switch
                        onChange={(change) => {
                          handleChange("email");
                        }}
                        checked={emailChecked}
                        checkedIcon={false}
                        uncheckedIcon={false}
                        onColor="#9BE303"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContentBare>
    </Dialog>
  );
};

export default NotificationSettingsModal;
