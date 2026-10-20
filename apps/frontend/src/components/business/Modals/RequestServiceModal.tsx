"use client";
import React from "react";
import { MoneyInput } from "@/components/global/MoneyInput";
import CloseIcon from "@/images/icons/close.svg";
import { Label, Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import { formatStringUCFirst } from "@/lib/helper";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestServiceSchema, type RequestServiceInput } from "@/features/business/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { SubmitButton } from "@/components/global/SubmitButton";
import { useAppDispatch } from "@/redux/hook";
import { useRequestServiceMutation } from "@/features/business/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";

type RequestServiceInterface = {
  isOpen: boolean;
  toggleMenu: () => void;
  // Was typed `[]` (the empty-tuple type) — a pre-existing typo only
  // surfaced now that `business?.services` is properly typed instead of
  // `any`.
  services: string[] | undefined;
  id: number | string;
};

const RequestServiceModal: React.FC<RequestServiceInterface> = ({
  isOpen,
  toggleMenu,
  services,
  id,
}) => {
  const dispatch = useAppDispatch();
  const requestServiceMutation = useRequestServiceMutation(id);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RequestServiceInput>({
    resolver: zodResolver(requestServiceSchema),
    defaultValues: {
      services: [],
      amount: "",
      additional_information: "",
    },
    mode: "onTouched",
  });

  const selectedServices = useWatch({ control, name: "services" }) ?? [];

  const handleServicesClick = (item: string) => {
    const updatedServices = selectedServices.includes(item)
      ? selectedServices.filter((service: string) => service !== item)
      : [...selectedServices, item];
    setValue("services", updatedServices, { shouldValidate: true });
  };

  const onSubmit = (values: RequestServiceInput) => {
    requestServiceMutation.mutate(values, {
      onSuccess: () => {
        toggleMenu();
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage("Quote sent"),
            type: "success",
          }),
        );
      },
      onError: (error: Error) => {
        if (applyServerErrors(error, setError, ["services", "amount", "additional_information"]))
          return;
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Request service"}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="laptop:w-160 w-full px-4 py-[5vh]">
            <div className="hide-scrollbar max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="cursor-pointer" onClick={toggleMenu}>
                    <CloseIcon />
                  </div>
                  <p className="tracking-custom text-body-xl font-sans font-semibold">
                    Request service
                  </p>
                </div>
                <div className="laptop:block hidden">
                  <SubmitButton title="Send quote" isValid={isValid} loading={isSubmitting} />
                </div>
              </div>
              <div className="flex flex-col gap-y-62.5">
                <div className="mt-10">
                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="amount"
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      I want to book you for
                    </Label>
                    <div className="bg-light_grey flex h-12 w-full items-center gap-3 rounded-xl p-2 px-3">
                      <div>
                        <p className="font-semi-normal text-body-s">₦</p>
                      </div>
                      <div className="w-full">
                        <Controller
                          name="amount"
                          control={control}
                          render={({ field }) => (
                            <MoneyInput
                              id="amount"
                              allowDecimals={false}
                              className="bg-light_grey text-body-s h-auto w-full border-0 p-0 shadow-none focus:border-transparent focus:ring-0 focus:outline-none focus-visible:ring-0"
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <FieldError message={errors.amount?.message} />
                  </div>
                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="fullname"
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Required services
                    </Label>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {services?.map((service, index) => (
                          <div
                            className={`w-fit cursor-pointer rounded-xl p-3 px-4 ${
                              selectedServices.includes(service)
                                ? "bg-gradient-green-2 shadow-event-custom"
                                : "bg-light_grey"
                            }`}
                            key={index}
                            onClick={() => handleServicesClick(service)}
                          >
                            <p className="text-text-grey text-body-s font-normal">
                              {formatStringUCFirst(service)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <FieldError message={errors.services?.message} />
                  </div>
                  <div className="mt-6 grid gap-2">
                    <div className="flex justify-between">
                      <Label
                        htmlFor="additional-information"
                        className="text-text-grey text-label font-sans font-normal"
                      >
                        Additional information
                      </Label>
                      <p className="text-text-grey text-meta leading-normal font-normal">
                        200 characters
                      </p>
                    </div>
                    <textarea
                      id="additional-information"
                      placeholder=""
                      className="bg-light_grey text-body-s h-32 resize-none rounded-xl border-0 p-4 font-normal"
                      readOnly={false}
                      {...register("additional_information")}
                    />
                    <FieldError message={errors.additional_information?.message} />
                  </div>
                </div>
                <div className="laptop:hidden">
                  <SubmitButton
                    title="Send quote"
                    isValid={isValid}
                    loading={isSubmitting}
                    classes="w-full rounded-xl h-12 px-12 py-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default RequestServiceModal;
