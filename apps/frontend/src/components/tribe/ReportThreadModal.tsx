import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Label, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch } from "@/redux/hook";
import { useReportThreadMutation } from "@/features/tribes/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

type ReportThreadIF = {
  toggle: () => void;
  isOpen: boolean;
  threadId: null | number;
};

const ReportThreadModal: React.FC<ReportThreadIF> = ({ toggle, isOpen, threadId }) => {
  const dispatch = useAppDispatch();
  const reportThreadMutation = useReportThreadMutation();

  const [selectedReport, setSelectedReport] = useState("Inappropriate content");

  const submitThread = () => {
    if (threadId !== null) {
      reportThreadMutation.mutate({
        id: threadId,
        data: { report: selectedReport },
      });
    }
    dispatch(
      updateToastifyReducer({
        show: true,
        message: "Report submitted. Thanks for keeping the platform safe.",
        type: "success",
      }),
    );
    setSelectedReport("Inappropriate content");
    toggle();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Report thread</DialogTitle>
        <div className="w-[640px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Report thread</p>
            </div>
            <div>
              <Button
                className="auth-button border-step-color shadow-custom-bottom rounded-xl p-2.5 px-3.5"
                type="button"
                onClick={submitThread}
              >
                <p className="font-semi-normal font-sans text-[12px]">Submit</p>
              </Button>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4 p-6">
            <p className="font-semiBold text-black-light text-[20px]">
              What is wrong with this thread?
            </p>
            <div className="flex flex-col">
              <RadioGroup
                defaultValue="Inappropriate_content"
                onValueChange={(value) => setSelectedReport(value)}
              >
                <div className="flex flex-col gap-5">
                  <div className="border-grey-20 flex items-center space-x-2 rounded-xl border-2 p-3 px-4">
                    <RadioGroupItem value="Inappropriate_content" id="option-one" />
                    <div className="flex flex-col">
                      <Label
                        className="text-black-light font-sans text-[16px] font-normal"
                        htmlFor="option-one"
                      >
                        Inappropriate content
                      </Label>
                      <p className="text-text-grey text-[12px] font-normal">
                        Posts containing nudity, pornography, or other sexually suggestive content
                      </p>
                    </div>
                  </div>
                  <div className="border-grey-20 flex items-center space-x-2 rounded-xl border-2 p-3 px-4">
                    <RadioGroupItem value="Abuse & Harassment" id="option-two" />
                    <div className="flex flex-col">
                      <Label
                        className="text-black-light font-sans text-[16px] font-normal"
                        htmlFor="option-one"
                      >
                        Abuse & Harassment
                      </Label>
                      <p className="text-text-grey text-[12px] font-normal">
                        Attacks, insults, threats, or other malicious behavior directed towards
                        another user.
                      </p>
                    </div>
                  </div>
                  <div className="border-grey-20 flex items-center space-x-2 rounded-xl border-2 p-3 px-4">
                    <RadioGroupItem value="Hate speech" id="option-three" />
                    <div className="flex flex-col">
                      <Label
                        className="text-black-light font-sans text-[16px] font-normal"
                        htmlFor="option-one"
                      >
                        Hate speech
                      </Label>
                      <p className="text-text-grey text-[12px] font-normal">
                        Content that attacks a person or group on the basis of attributes like race,
                        religion, ethnic origin, national origin, sex, disability, sexual
                        orientation, or gender identity.
                      </p>
                    </div>
                  </div>
                  <div className="border-grey-20 flex items-center space-x-2 rounded-xl border-2 p-3 px-4">
                    <RadioGroupItem value="Spam or irrelevant content" id="option-four" />
                    <div className="flex flex-col">
                      <Label
                        className="text-black-light font-sans text-[16px] font-normal"
                        htmlFor="option-one"
                      >
                        Spam or irrelevant content
                      </Label>
                      <p className="text-text-grey text-[12px] font-normal">
                        Posts promoting unrelated products or services, excessive self-promotion, or
                        repetitive messages.
                      </p>
                    </div>
                  </div>
                  <div className="border-grey-20 flex items-center space-x-2 rounded-xl border-2 p-3 px-4">
                    <RadioGroupItem value="Illegal activity" id="option-five" />
                    <div className="flex flex-col">
                      <Label
                        className="text-black-light font-sans text-[16px] font-normal"
                        htmlFor="option-one"
                      >
                        Illegal activity
                      </Label>
                      <p className="text-text-grey text-[12px] font-normal">
                        Posts promoting or encouraging illegal activity. Threats of violence: Any
                        content that threatens violence against oneself or others.
                      </p>
                    </div>
                  </div>
                  <div className="border-grey-20 flex items-center space-x-2 rounded-xl border-2 p-3 px-4">
                    <RadioGroupItem value="Misinformation or disinformation" id="option-six" />
                    <div className="flex flex-col">
                      <Label
                        className="text-black-light font-sans text-[16px] font-normal"
                        htmlFor="option-one"
                      >
                        Misinformation or disinformation
                      </Label>
                      <p className="text-text-grey text-[12px] font-normal">
                        The sharing of false or misleading information intended to deceive or
                        manipulate others.
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};
export default ReportThreadModal;
