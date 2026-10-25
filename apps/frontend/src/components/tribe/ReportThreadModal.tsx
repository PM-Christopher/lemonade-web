import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Label, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch } from "@/redux/hook";
import { useReportThreadMutation } from "@/features/tribes/mutations";
import { useReportCategoriesQuery } from "@/features/tribes/queries";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";

type ReportThreadIF = {
  toggle: () => void;
  isOpen: boolean;
  threadId: null | string;
};

const ReportThreadModal: React.FC<ReportThreadIF> = ({ toggle, isOpen, threadId }) => {
  const dispatch = useAppDispatch();
  const reportThreadMutation = useReportThreadMutation();

  const { data: reportCategories } = useReportCategoriesQuery({ enabled: isOpen });
  const categories = reportCategories?.categories ?? [];
  const [pickedReport, setSelectedReport] = useState("");
  // Until someone picks, the first reason is selected.
  const selectedReport = pickedReport || (categories[0]?.name ?? "");

  const submitThread = () => {
    if (threadId === null || selectedReport === "") return;
    reportThreadMutation.mutate(
      { id: threadId, data: { report: selectedReport } },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage("Report submitted. Thanks for keeping the platform safe."),
              type: "success",
            }),
          );
          setSelectedReport("");
          toggle();
        },
        onError: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Could not submit report.",
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
        <DialogTitle className="sr-only">Report thread</DialogTitle>
        <div className="w-160 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
              <p className="text-body-xl font-sans font-semibold">Report thread</p>
            </div>
            <div>
              <Button
                className="auth-button border-step-color rounded-xl p-2.5 px-3.5"
                type="button"
                onClick={submitThread}
                loading={reportThreadMutation.isPending}
                disabled={selectedReport === ""}
              >
                <p className="font-semi-normal text-meta font-sans leading-normal">Submit</p>
              </Button>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4 p-6">
            <p className="font-semiBold text-black-light text-title-r leading-normal">
              What is wrong with this thread?
            </p>
            <div className="flex flex-col">
              <RadioGroup value={selectedReport} onValueChange={setSelectedReport}>
                <div className="flex flex-col gap-5">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="border-grey-20 flex items-center space-x-2 rounded-xl border-2 p-3 px-4"
                    >
                      <RadioGroupItem value={category.name} id={`report-${category.id}`} />
                      <div className="flex flex-col">
                        <Label
                          className="text-black-light text-body-l font-sans font-normal"
                          htmlFor={`report-${category.id}`}
                        >
                          {category.name}
                        </Label>
                        {category.description && (
                          <p className="text-text-grey text-meta leading-normal font-normal">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
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
