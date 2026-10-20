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
  // Until the buyer picks one, show the saved choice (weekly if none).
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const paymentType = selectedType ?? payment_setting?.type ?? "weekly";

  const handleUpdate = () => {
    updatePaymentSettingMutation.mutate(
      { type: paymentType },
      {
        onSuccess: () => {
          setSelectedType(null);
          toggle();
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
      <DialogContentBare className="w-[calc(100vw-2rem)] max-w-160 gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Payment settings"}</DialogTitle>
        <div className="w-full rounded-lg bg-white p-6">
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
                <p className="font-semi-normal text-meta font-sans leading-normal">Save changes</p>
              </Button>
            </div>
          </div>
          <div className="mt-10">
            <RadioGroup value={paymentType} onValueChange={setSelectedType}>
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
