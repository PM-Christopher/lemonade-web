import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import {
  Button,
  Label,
  Dialog,
  DialogContentBare,
  DialogTitle,
} from "@lemonade/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch } from "@/redux/hook";
import { usePaymentSettingQuery } from "@/features/events/queries";
import { useUpdatePaymentSettingMutation } from "@/features/events/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

type PaymentSettingsInterface = {
  toggle: () => void;
  option: boolean;
};

const PaymentSettingsModal: React.FC<PaymentSettingsInterface> = ({
  toggle,
  option,
}) => {
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
              message: "Payment setting updated successfully",
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
        <div className="w-[640px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
              <p className="font-sans font-semibold leading-[27px] tracking-custom text-[18p]">
                Payment settings
              </p>
            </div>
            <div>
              <Button
                className="auth-button rounded-[12px] border-step-color p-[10px] px-[14px] shadow-custom-bottom"
                onClick={handleUpdate}
              >
                <p className="font-sans text-[12px] font-semi-normal">
                  Save Changes
                </p>
              </Button>
            </div>
          </div>
          <div className="mt-10">
            <RadioGroup
              value={paymentType}
              onValueChange={(val) => setPaymentType(val)}
            >
              <div className="flex gap-2">
                <RadioGroupItem
                  value="weekly"
                  id="weekly"
                  className="border-[2.5px] border-light-grey-60 text-green-500 checked:border-step-color checked:bg-gradient-green focus:border-step-color"
                />
                <div className="flex flex-col">
                  <Label
                    htmlFor="weekly"
                    className="font-sans text-[16px] font-semi-normal leading-[24px] tracking-custom text-black-light"
                  >
                    Weekly payment
                  </Label>
                  <span className="font-sans text-[12px] font-normal leading-[16.8px] text-text-grey">
                    Ticket earnings will be transferred in batch to the account
                    details every Friday
                  </span>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <RadioGroupItem
                  value="monthly"
                  id="monthly"
                  className="border-[2.5px] border-light-grey-60 text-green-500 checked:border-step-color checked:bg-gradient-green focus:border-step-color"
                />
                <div className="flex flex-col">
                  <Label
                    htmlFor="monthly"
                    className="font-sans text-[16px] font-semi-normal leading-[24px] tracking-custom text-black-light"
                  >
                    Monthly payment
                  </Label>
                  <span className="font-sans text-[12px] font-normal leading-[16.8px] text-text-grey">
                    Ticket earnings will be transferred in batch to the account
                    details on the last Friday of the <br /> month
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
