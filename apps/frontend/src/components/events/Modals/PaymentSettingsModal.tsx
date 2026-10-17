import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Label, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch } from "@/redux/hook";
import { usePaymentSettingQuery } from "@/features/events/queries";
import { useUpdatePaymentSettingMutation } from "@/features/events/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";

type PaymentSettingsInterface = {
  toggle: () => void;
  option: boolean;
};

const PaymentSettingsModal: React.FC<PaymentSettingsInterface> = ({ toggle, option }) => {
  const dispatch = useAppDispatch();
  const { data: paymentSettingData } = usePaymentSettingQuery({
    enabled: option,
  });
  const payment_setting = paymentSettingData?.payment_setting;
  const updatePaymentSettingMutation = useUpdatePaymentSettingMutation();
  const [paymentType, setPaymentType] = useState(payment_setting?.type || "");

  const handleUpdate = () => {
    if (paymentType === null) {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Please select a payment type",
          type: "error",
        }),
      );
      return;
    }
    updatePaymentSettingMutation.mutate(
      { type: paymentType },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage("Payment setting updated successfully"),
              type: "success",
            }),
          );
        },
      },
    );
  };

  return (
    <Dialog
      open={option}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Payment settings"}</DialogTitle>
        <div className="w-160 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
              <p className="tracking-custom font-sans leading-6.75 font-semibold text-[18p]">
                Payment settings
              </p>
            </div>
            <div>
              <Button
                className="auth-button border-step-color rounded-xl p-2.5 px-3.5"
                onClick={handleUpdate}
                loading={updatePaymentSettingMutation.isPending}
              >
                <p className="font-semi-normal text-meta font-sans leading-normal">Save Changes</p>
              </Button>
            </div>
          </div>
          <div className="mt-10">
            <RadioGroup value={paymentType} onValueChange={(val) => setPaymentType(val)}>
              <div className="flex gap-2">
                <RadioGroupItem
                  value="weekly"
                  id="weekly"
                  className="border-light-grey-60 checked:border-step-color checked:bg-gradient-green focus:border-step-color border-3 text-green-500"
                />
                <div className="flex flex-col">
                  <Label
                    htmlFor="weekly"
                    className="font-semi-normal tracking-custom text-black-light text-body-l font-sans"
                  >
                    Weekly payment
                  </Label>
                  <span className="text-text-grey text-meta font-sans leading-4.25 font-normal">
                    Ticket earnings will be transferred in batch to the account details every Friday
                  </span>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <RadioGroupItem
                  value="monthly"
                  id="monthly"
                  className="border-light-grey-60 checked:border-step-color checked:bg-gradient-green focus:border-step-color border-3 text-green-500"
                />
                <div className="flex flex-col">
                  <Label
                    htmlFor="monthly"
                    className="font-semi-normal tracking-custom text-black-light text-body-l font-sans"
                  >
                    Monthly payment
                  </Label>
                  <span className="text-text-grey text-meta font-sans leading-4.25 font-normal">
                    Ticket earnings will be transferred in batch to the account details on the last
                    Friday of the <br /> month
                  </span>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PaymentSettingsModal;
