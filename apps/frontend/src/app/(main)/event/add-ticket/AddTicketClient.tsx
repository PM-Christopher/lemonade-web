"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Label, Input, Button } from "@lemonade/ui";
import { PlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import CloseIcon from "@/images/icons/close.svg";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventTicketsFormSchema, type EventTicketsFormInput } from "@/features/events/schema";
import { FieldError } from "@/components/global/FieldError";
import { applyServerErrors } from "@/lib/form-errors";
import { createTickets, resetEventState } from "@/features/events/event.slice";
import { useCreateEventMutation } from "@/features/events/mutations";
import { SubmitButton } from "@/components/global/SubmitButton";
import { useAppDispatch } from "@/redux/hook";
import MainLayout from "@/components/layouts/MainLayout";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { routes } from "@/lib/routes";
import { errorMessage } from "@/lib/api-error";

// Lazy-loaded; only needed once the bank-account section opens.
const BankAccountModal = dynamic(() => import("@/components/events/Modals/BankAccountModal"), {
  ssr: false,
});

const emptyTicket = {
  ticket_id: "",
  ticket_type: "",
  name: "",
  price: "",
  transfer_commission: false,
  stock_type: "",
  ticket_stock: "",
  purchase_limit: "",
  description: "",
};

// Ticket setup form; the last step of creating an event.
const AddTicketClient = () => {
  const dispatch = useAppDispatch();
  const { push, back } = useNavigation();
  const [toggleModal, setToggleModal] = useState(false);
  const activateModal = () => {
    setToggleModal(!toggleModal);
  };
  const { event } = useSelector((state: RootState) => state.event);
  const createEventMutation = useCreateEventMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting, touchedFields, submitCount },
  } = useForm<EventTicketsFormInput>({
    resolver: zodResolver(eventTicketsFormSchema),
    defaultValues: { tickets: [emptyTicket] },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "tickets" });
  const tickets = useWatch({ control, name: "tickets" });

  const ticketFieldError = (index: number, field: keyof typeof emptyTicket) => {
    const fieldError = errors.tickets?.[index]?.[field]?.message;
    const touched = touchedFields.tickets?.[index]?.[field as never];
    if ((touched || submitCount > 0) && fieldError) {
      return <FieldError message={fieldError} />;
    }
    return null;
  };

  const onSubmit = async (values: EventTicketsFormInput) => {
    const normalizedTickets = values.tickets.map((ticket) => ({
      ...ticket,
      price: ticket.ticket_type === "paid" ? Number(ticket.price || 0) : 0,
      ticket_stock:
        ticket.stock_type === "unlimited"
          ? 0
          : Number(String(ticket.ticket_stock).replace(/,/g, "") || 0),
      purchase_limit: Number(String(ticket.purchase_limit).replace(/,/g, "") || 0),
    }));

    const ticketTypes = hasPaidTicket(normalizedTickets);

    if (ticketTypes) {
      try {
        await createEventMutation.mutateAsync({
          event,
          tickets: normalizedTickets,
        });
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Event created successfully",
            type: "success",
          }),
        );
        dispatch(resetEventState());
        push(routes.EVENT);
      } catch (err) {
        if (applyServerErrors(err, setError, ["tickets"])) return;
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(err, "Error creating event"),
            type: "error",
          }),
        );
      }
    } else {
      dispatch(createTickets({ tickets: normalizedTickets }));
      setToggleModal(!toggleModal);
    }
  };

  const saveAsDraft = () => {
    const data = {
      event: { ...event, status: "draft" },
      tickets: tickets.map((ticket) => ({
        ...ticket,
        price: ticket.ticket_type === "paid" ? Number(ticket.price || 0) : 0,
        ticket_stock:
          ticket.stock_type === "unlimited"
            ? 0
            : Number(String(ticket.ticket_stock).replace(/,/g, "") || 0),
        purchase_limit: Number(String(ticket.purchase_limit).replace(/,/g, "") || 0),
      })),
    };
    createEventMutation.mutate(data, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Event saved as draft",
            type: "success",
          }),
        );
        dispatch(resetEventState());
        push(routes.EVENT);
      },
      onError: (err) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(err, "Error creating event"),
            type: "error",
          }),
        );
      },
    });
  };

  function hasPaidTicket(list: Array<{ ticket_type: string }>): boolean {
    return list.some((ticket) => ticket.ticket_type === "paid");
  }

  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => back()}
          >
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">Add ticket</p>
          </div>
        </div>
        <section className="laptop:mt-4 mt-0 flex flex-col items-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="laptop:w-160 mt-10 flex w-full flex-col rounded-xl bg-white p-12">
              {fields.map((field, index) => (
                <div className="mb-6" key={field.id}>
                  {index > 0 && (
                    <div className="bg-grey-20 mb-4 flex items-center justify-between rounded-lg p-2 px-4">
                      <p className="text-body-s font-normal">Ticket {index + 1}</p>
                      <CloseIcon
                        className="h-2.5 w-2.5 cursor-pointer"
                        onClick={() => remove(index)}
                      />
                    </div>
                  )}
                  <p className="text-text-grey text-label font-sans font-normal">Ticket type</p>
                  <div className="mt-4 flex gap-2">
                    <div
                      className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-6 ${
                        tickets[index]?.ticket_type === "free"
                          ? "bg-gradient-green-2 shadow-event-custom"
                          : "bg-light_grey text-text-grey"
                      }`}
                      onClick={() =>
                        setValue(`tickets.${index}.ticket_type`, "free", { shouldValidate: true })
                      }
                    >
                      <p className="tracking-custom text-body-s font-sans font-normal">Free</p>
                    </div>
                    <div
                      className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-6 ${
                        tickets[index]?.ticket_type === "paid"
                          ? "bg-gradient-green-2 shadow-event-custom"
                          : "bg-light_grey text-text-grey"
                      }`}
                      onClick={() =>
                        setValue(`tickets.${index}.ticket_type`, "paid", { shouldValidate: true })
                      }
                    >
                      <p className="tracking-custom text-body-s font-sans font-normal">Paid</p>
                    </div>
                  </div>
                  {ticketFieldError(index, "ticket_type")}

                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor={`ticket-name-${index}`}
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Ticket name
                    </Label>
                    <Input
                      id={`ticket-name-${index}`}
                      type="text"
                      placeholder=""
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      {...register(`tickets.${index}.name`)}
                    />
                    {ticketFieldError(index, "name")}
                  </div>

                  {tickets[index]?.ticket_type === "paid" && (
                    <>
                      <div className="mt-6 grid gap-2">
                        <Label
                          htmlFor={`ticket-price-${index}`}
                          className="text-text-grey text-label font-sans font-normal"
                        >
                          Ticket price
                        </Label>
                        <Input
                          id={`ticket-price-${index}`}
                          type="text"
                          inputMode="numeric"
                          placeholder=""
                          className="form-font bg-light_grey h-12 rounded-xl border-0"
                          value={tickets[index]?.price || ""}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^0-9.]/g, "");
                            setValue(`tickets.${index}.price`, numericValue, {
                              shouldValidate: true,
                            });
                          }}
                          onKeyDown={(e) => {
                            if (["e", "E", "+", "-"].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onBlur={register(`tickets.${index}.price`).onBlur}
                          name={`tickets.${index}.price`}
                        />
                      </div>
                      {ticketFieldError(index, "price")}
                      <div className="mt-6 flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="border-text-grey w-5 border"
                          {...register(`tickets.${index}.transfer_commission`)}
                        />
                        <p className="tracking-custom text-text-grey text-body-s font-sans font-normal">
                          Transfer commission to guest
                        </p>
                      </div>
                      {ticketFieldError(index, "transfer_commission")}
                    </>
                  )}

                  <div className="mt-6 grid w-full gap-2">
                    <Label
                      htmlFor={`ticket-stock-${index}`}
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Ticket stock
                    </Label>
                    <div className="flex w-full justify-between gap-3">
                      <select
                        {...register(`tickets.${index}.stock_type`)}
                        className="form-font bg-light_grey h-12 w-full rounded-xl border-0 p-2"
                      >
                        <option value="">Select stock</option>
                        <option value="limited">Limited stock</option>
                        <option value="unlimited">Unlimited stock</option>
                      </select>
                      {tickets[index]?.stock_type !== "unlimited" && (
                        <Input
                          type="text"
                          placeholder=""
                          className="form-font bg-light_grey h-12 w-full rounded-xl border-0"
                          {...register(`tickets.${index}.ticket_stock`)}
                          readOnly={tickets[index]?.stock_type === "unlimited"}
                        />
                      )}
                    </div>
                    {ticketFieldError(index, "stock_type")}
                    {ticketFieldError(index, "ticket_stock")}
                  </div>

                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor={`ticket-limit-${index}`}
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Purchase limit
                    </Label>
                    <Input
                      id={`ticket-limit-${index}`}
                      type="text"
                      inputMode="numeric"
                      placeholder=""
                      className="form-font bg-light_grey h-12 w-full rounded-xl border-0"
                      {...register(`tickets.${index}.purchase_limit`)}
                    />
                    {ticketFieldError(index, "purchase_limit")}
                  </div>

                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor={`ticket-description-${index}`}
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Ticket description
                    </Label>
                    <textarea
                      {...register(`tickets.${index}.description`)}
                      className="form-font bg-light_grey h-32.75 resize-none rounded-xl border-0 p-4"
                    />
                    {ticketFieldError(index, "description")}
                  </div>
                </div>
              ))}

              <Button
                className="bg-light-green-10 mt-6 h-12 rounded-xl border-0 p-3.5 px-12 shadow-none"
                onClick={() => append(emptyTicket)}
                type="button"
              >
                <div className="flex items-center gap-1">
                  <PlusIcon className="text-light-green" />
                  <p className="font-semi-normal text-light-green text-field font-sans">
                    Add another ticket
                  </p>
                </div>
              </Button>

              <div className="flex justify-between gap-3">
                <Button
                  className="border-light-grey-50 bg-light-grey-50 mt-6 h-12 w-full rounded-xl border p-3.5 px-12 shadow-none"
                  type="button"
                  onClick={saveAsDraft}
                >
                  <div className="flex items-center gap-1">
                    <p className="font-semi-normal text-text-grey text-field font-sans">
                      Save as draft
                    </p>
                  </div>
                </Button>
                <SubmitButton
                  title="Publish"
                  loading={isSubmitting}
                  isValid={isValid}
                  classes="rounded-xl h-12 p-3.5 px-12 mt-6 border-0 shadow-none w-full"
                />
              </div>
            </div>
          </form>
          <BankAccountModal toggle={activateModal} option={toggleModal} />
        </section>
      </section>
    </MainLayout>
  );
};

export default AddTicketClient;
