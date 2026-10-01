"use client";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Label, Input, Button } from "@lemonade/ui";
import { PlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import CloseIcon from "@/images/icons/close.svg";
import * as yup from "yup";
import { useFormik, type FormikErrors, type FormikTouched } from "formik";
import { resetEventState } from "@/features/events/event.slice";
import { useEventTicketsQuery } from "@/features/events/queries";
import { useEditEventTicketsMutation, useCreateEventMutation } from "@/features/events/mutations";
import { FormikButton } from "@/components/global/FormikButton";
import { useAppDispatch } from "@/redux/hook";
import MainLayout from "@/components/layouts/MainLayout";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

// Off the initial bundle — only needed once the bank-account section is
// opened (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const BankAccountModal = dynamic(() => import("@/components/events/Modals/BankAccountModal"), {
  ssr: false,
});

type Ticket = {
  ticket_type: string; // was: "free" | "paid"
  name: string;
  price: string | number;
  transfer_commission: boolean;
  stock_type: string; // was: "unlimited" | "limited"
  ticket_stock: number | string;
  purchase_limit: number;
  description: string;
  ticket_id?: string;
};

interface RawTicket {
  ticket_id?: string;
  ticket_type?: string;
  name?: string;
  price?: string | number | null;
  transfer_commission?: boolean;
  stock_type?: string;
  ticket_stock?: number | string | null;
  purchase_limit?: number | null;
  description?: string;
}

const AddTicketClient = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [toggleModal, setToggleModal] = useState(false);
  const activateModal = () => {
    setToggleModal(!toggleModal);
  };
  const { event } = useSelector((state: RootState) => state.event);
  const { data: eventTicketsData } = useEventTicketsQuery(id);
  const event_tickets = eventTicketsData?.tickets ?? [];
  const editEventTicketsMutation = useEditEventTicketsMutation(id);
  const createEventMutation = useCreateEventMutation();

  const ticketSchema = yup.object().shape({
    ticket_id: yup.string(),
    ticket_type: yup.string().required("Ticket type is required"),

    name: yup.string().required("Ticket name is required"),

    price: yup
      .string()
      .when("ticket_type", (values: unknown[], schema: yup.StringSchema<string | undefined>) => {
        // Yup's typings say `values` is unknown[], so we read from index 0
        const ticket_type = Array.isArray(values) ? values[0] : values;

        // Only validate price when ticket is paid
        if (ticket_type === "paid") {
          return schema
            .required("Ticket price is required")
            .test("valid-price", "Ticket price must be greater than 0", (value) => {
              if (!value) return false; // required already, but keeps TS happy
              const cleaned = value.replace(/,/g, "");
              const num = Number(cleaned);
              return !Number.isNaN(num) && num > 0;
            });
        }

        // For "free" or unset ticket_type → no validation
        return schema.notRequired();
      }),

    transfer_commission: yup.boolean().optional(),

    stock_type: yup.string().required("Stock type is required"),

    ticket_stock: yup
      .number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue === null || originalValue === undefined) {
          return undefined;
        }
        const cleaned = String(originalValue).replace(/,/g, "");
        const num = Number(cleaned);
        return Number.isNaN(num) ? undefined : num;
      })
      .when("stock_type", (stock_type: unknown, schema: yup.NumberSchema<number | undefined>) => {
        if (stock_type === "limited") {
          // REQUIRED and must be > 0
          return schema
            .required("Ticket stock is required")
            .moreThan(0, "Ticket stock must be greater than 0");
        }
        // Unlimited → not required
        return schema.notRequired();
      }),

    purchase_limit: yup
      .number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue === null || originalValue === undefined) {
          return undefined;
        }
        const cleaned = String(originalValue).replace(/,/g, "");
        const num = Number(cleaned);
        return Number.isNaN(num) ? undefined : num;
      })
      .nullable()
      .notRequired()
      .test(
        "min-1",
        "Purchase limit must be greater than 0",
        (value) => value == null || value > 0,
      ),

    description: yup.string().required("Ticket description is required"),
  });

  const addTicketSchema = yup.object().shape({
    tickets: yup
      .array()
      .of(ticketSchema)
      .min(1, "At least one ticket is required")
      .required("Tickets is required"),
  });

  // Build initial tickets from Redux state (event_tickets) if available
  const hasExistingTickets = Array.isArray(event_tickets) && event_tickets.length > 0;

  const initialTickets: Ticket[] = hasExistingTickets
    ? (event_tickets as RawTicket[]).map((t) => ({
        ticket_id: t.ticket_id ?? "",
        ticket_type: t.ticket_type ?? "",
        name: t.name ?? "",
        // ensure price is a string for the text input
        price: t.price !== null && t.price !== undefined ? String(t.price) : "",
        transfer_commission: Boolean(t.transfer_commission),
        stock_type: t.stock_type ?? "",
        ticket_stock: t.ticket_stock !== null && t.ticket_stock !== undefined ? t.ticket_stock : "",
        purchase_limit:
          t.purchase_limit !== null && t.purchase_limit !== undefined
            ? Number(t.purchase_limit)
            : 0,
        description: t.description ?? "",
      }))
    : [
        {
          ticket_type: "",
          name: "",
          price: "",
          transfer_commission: false,
          stock_type: "",
          ticket_stock: 0,
          purchase_limit: 0,
          description: "",
        },
      ];

  const formik = useFormik({
    initialValues: {
      tickets: initialTickets,
    },
    validationSchema: addTicketSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      const normalizedTickets = values.tickets.map((ticket) => ({
        ...ticket,
        price: ticket.ticket_type === "paid" ? Number(ticket.price || 0) : 0,
      }));

      const data = {
        tickets: normalizedTickets,
      };
      editEventTicketsMutation.mutate(data, {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Tickets updated successfully",
              type: "success",
            }),
          );
          dispatch(resetEventState());
          router.push(`/event/${id}/details`);
        },
        onError: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error updating tickets. Please try again.",
              type: "error",
            }),
          );
        },
      });
    },
  });

  const getTicketFieldError = (index: number, field: keyof Ticket) => {
    const ticketsErrors = formik.errors.tickets;
    const ticketsTouched = formik.touched.tickets;

    if (!Array.isArray(ticketsErrors)) return null;

    const fieldError = (ticketsErrors[index] as FormikErrors<Ticket> | undefined)?.[field];
    const fieldTouched = Array.isArray(ticketsTouched)
      ? (ticketsTouched[index] as FormikTouched<Ticket> | undefined)?.[field]
      : false;

    // Show error if:
    // - field was touched OR form was submitted at least once
    if ((fieldTouched || formik.submitCount > 0) && fieldError) {
      return <p className="mt-1 text-sm text-red-600">{String(fieldError)}</p>;
    }

    return null;
  };

  const addTicket = () => {
    formik.setValues({
      tickets: [
        ...formik.values.tickets,
        {
          ticket_type: "",
          name: "",
          price: "",
          transfer_commission: false,
          stock_type: "",
          ticket_stock: 0,
          purchase_limit: 0,
          description: "",
        },
      ],
    });
  };

  const removeTicket = (index: number) => {
    const updatedTickets = formik.values.tickets.filter((_, i) => i !== index);
    formik.setValues({ tickets: updatedTickets });
  };

  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Add ticket</p>
          </div>
        </div>
        <section className="laptop:mt-4 mt-0 flex flex-col items-center">
          <form onSubmit={formik.handleSubmit}>
            <div className="laptop:w-[640px] mt-10 flex w-full flex-col rounded-xl bg-white p-12">
              {formik.values.tickets.map((ticket, index) => (
                <div className="mb-6" key={index}>
                  <input type="hidden" name="ticket_id" value={ticket.ticket_id} />
                  {index > 0 && (
                    <div className="bg-grey-20 mb-4 flex items-center justify-between rounded-[8px] p-2 px-4">
                      <p className="text-[14px] font-normal">Ticket {index + 1}</p>
                      <CloseIcon
                        className="h-2.5 w-2.5 cursor-pointer"
                        onClick={() => removeTicket(index)}
                      />
                    </div>
                  )}
                  <p className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal">
                    Ticket type
                  </p>
                  <div className="mt-4 flex gap-2">
                    <div
                      className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-6 ${
                        ticket.ticket_type === "free"
                          ? "bg-gradient-green-2 shadow-event-custom"
                          : "bg-light_grey text-text-grey"
                      }`}
                      onClick={() => formik.setFieldValue(`tickets[${index}].ticket_type`, "free")}
                    >
                      <p className="tracking-custom font-sans text-[14px] leading-[21px] font-normal">
                        Free
                      </p>
                    </div>
                    <div
                      className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-6 ${
                        ticket.ticket_type === "paid"
                          ? "bg-gradient-green-2 shadow-event-custom"
                          : "bg-light_grey text-text-grey"
                      }`}
                      onClick={() => formik.setFieldValue(`tickets[${index}].ticket_type`, "paid")}
                    >
                      <p className="tracking-custom font-sans text-[14px] leading-[21px] font-normal">
                        Paid
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor={`ticket-name-${index}`}
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Ticket name
                    </Label>
                    <Input
                      id={`ticket-name-${index}`}
                      type="text"
                      placeholder=""
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      value={formik.values.tickets[index].name}
                      onChange={formik.handleChange}
                      name={`tickets[${index}].name`}
                    />
                    {getTicketFieldError(index, "name")}
                  </div>

                  {ticket.ticket_type === "paid" && (
                    <>
                      <div className="mt-6 grid gap-2">
                        <Label
                          htmlFor={`ticket-price-${index}`}
                          className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                        >
                          Ticket price
                        </Label>
                        <Input
                          id={`ticket-price-${index}`}
                          type="text"
                          inputMode="numeric"
                          placeholder=""
                          className="form-font bg-light_grey h-12 rounded-xl border-0"
                          value={formik.values.tickets[index].price || ""}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^0-9.]/g, "");
                            formik.setFieldValue(`tickets[${index}].price`, numericValue);
                          }}
                          onKeyDown={(e) => {
                            if (["e", "E", "+", "-"].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onBlur={formik.handleBlur} // 👈 important
                          name={`tickets[${index}].price`}
                        />
                      </div>
                      {getTicketFieldError(index, "price")}
                      <div className="mt-6 flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="border-text-grey w-5 border"
                          checked={formik.values.tickets[index].transfer_commission}
                          onChange={formik.handleChange}
                          name={`tickets[${index}].transfer_commission`}
                        />
                        <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                          Transfer commission to guest
                        </p>
                      </div>
                      {getTicketFieldError(index, "transfer_commission")}
                    </>
                  )}

                  <div className="mt-6 grid w-full gap-2">
                    <Label
                      htmlFor={`ticket-stock-${index}`}
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Ticket stock
                    </Label>
                    <div className="flex w-full justify-between gap-3">
                      <select
                        value={formik.values.tickets[index].stock_type}
                        onChange={formik.handleChange}
                        className="form-font bg-light_grey h-12 w-full rounded-xl border-0 p-2"
                        name={`tickets[${index}].stock_type`}
                      >
                        <option value="">Select stock</option>
                        <option value="limited">Limited stock</option>
                        <option value="unlimited">Unlimited stock</option>
                      </select>
                      {formik.values.tickets[index].stock_type !== "unlimited" && (
                        <Input
                          type="text"
                          placeholder=""
                          className="form-font bg-light_grey h-12 w-full rounded-xl border-0"
                          value={formik.values.tickets[index].ticket_stock}
                          onChange={formik.handleChange}
                          name={`tickets[${index}].ticket_stock`}
                          readOnly={formik.values.tickets[index].stock_type === "unlimited"}
                        />
                      )}
                    </div>
                    {getTicketFieldError(index, "stock_type")}
                    {getTicketFieldError(index, "ticket_stock")}
                  </div>

                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor={`ticket-limit-${index}`}
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Purchase limit
                    </Label>
                    <Input
                      id={`ticket-limit-${index}`}
                      name={`tickets[${index}].purchase_limit`}
                      type="number"
                      placeholder=""
                      className="form-font bg-light_grey h-12 w-full rounded-xl border-0"
                      value={formik.values.tickets[index].purchase_limit}
                      onChange={formik.handleChange}
                      min={0}
                    />
                    {getTicketFieldError(index, "purchase_limit")}
                  </div>

                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor={`ticket-description-${index}`}
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Ticket description
                    </Label>
                    <textarea
                      value={formik.values.tickets[index].description}
                      onChange={formik.handleChange}
                      className="form-font bg-light_grey h-[131px] resize-none rounded-xl border-0 p-4"
                      name={`tickets[${index}].description`}
                    />
                    {getTicketFieldError(index, "description")}
                  </div>
                </div>
              ))}

              <Button
                className="bg-light-green-10 mt-6 h-12 rounded-xl border-0 p-3.5 px-12 shadow-none"
                onClick={addTicket}
                type="button"
              >
                <div className="flex items-center gap-1">
                  <PlusIcon className="text-light-green" />
                  <p className="font-semi-normal text-light-green font-sans text-[16px] leading-[19.2px]">
                    Add another ticket
                  </p>
                </div>
              </Button>

              <div className="flex justify-between gap-3">
                <FormikButton
                  title="Save ticket"
                  loading={formik.isSubmitting}
                  error={formik.isValid}
                  classes="rounded-xl h-12 p-3.5 px-12 mt-6 border-0 w-full"
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
