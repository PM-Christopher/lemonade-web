"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import CloseIcon from "@/images/icons/close.svg";
import * as yup from "yup";
import { useFormik, FieldArray } from "formik";
import { createTickets, resetEventState } from "@/features/events/event.slice";
import { useCreateEventMutation } from "@/features/events/mutations";
import { FormikButton } from "@/components/global/FormikButton";
import { useAppDispatch } from "@/redux/hook";
import MainLayout from "@/components/layouts/MainLayout";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { getIn } from "yup";

// Off the initial bundle — only needed once the bank-account section is
// opened (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const BankAccountModal = dynamic(
  () => import("@/components/events/Modals/BankAccountModal"),
  {
    ssr: false,
  },
);

type Ticket = {
  ticket_type: string; // was: "free" | "paid"
  name: string;
  price: string | number;
  transfer_commission: boolean;
  stock_type: string; // was: "unlimited" | "limited"
  ticket_stock: number | string;
  purchase_limit: number;
  description: string;
};

const AddTicketPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [toggleModal, setToggleModal] = useState(false);
  const activateModal = () => {
    setToggleModal(!toggleModal);
  };
  const { event } = useSelector((state: RootState) => state.event);
  const createEventMutation = useCreateEventMutation();

  const ticketSchema = yup.object().shape({
    ticket_type: yup.string().required("Ticket type is required"),

    name: yup.string().required("Ticket name is required"),

    price: yup
      .string()
      .when(
        "ticket_type",
        (values: any[], schema: yup.StringSchema<string | undefined>) => {
          // Yup's typings say `values` is any[], so we read from index 0
          const ticket_type = Array.isArray(values) ? values[0] : values;

          // Only validate price when ticket is paid
          if (ticket_type === "paid") {
            return schema
              .required("Ticket price is required")
              .test(
                "valid-price",
                "Ticket price must be greater than 0",
                (value) => {
                  if (!value) return false; // required already, but keeps TS happy
                  const cleaned = value.replace(/,/g, "");
                  const num = Number(cleaned);
                  return !Number.isNaN(num) && num > 0;
                },
              );
          }

          // For "free" or unset ticket_type → no validation
          return schema.notRequired();
        },
      ),

    transfer_commission: yup.boolean().optional(),

    stock_type: yup.string().required("Stock type is required"),

    ticket_stock: yup
      .number()
      .transform((value, originalValue) => {
        if (
          originalValue === "" ||
          originalValue === null ||
          originalValue === undefined
        ) {
          return undefined;
        }
        const cleaned = String(originalValue).replace(/,/g, "");
        const num = Number(cleaned);
        return Number.isNaN(num) ? undefined : num;
      })
      .when(
        "stock_type",
        (stock_type: any, schema: yup.NumberSchema<number | undefined>) => {
          if (stock_type === "limited") {
            // REQUIRED and must be > 0
            return schema
              .required("Ticket stock is required")
              .moreThan(0, "Ticket stock must be greater than 0");
          }
          // Unlimited → not required
          return schema.notRequired();
        },
      ),

    purchase_limit: yup
      .number()
      .transform((value, originalValue) => {
        if (
          originalValue === "" ||
          originalValue === null ||
          originalValue === undefined
        ) {
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

  const formik = useFormik({
    initialValues: {
      tickets: [
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
    },
    validationSchema: addTicketSchema,
    onSubmit: async (values) => {
      const normalizedTickets = values.tickets.map((ticket) => ({
        ...ticket,
        price: ticket.ticket_type === "paid" ? Number(ticket.price || 0) : 0,
      }));

      const ticketTypes = hasPaidTicket(normalizedTickets);

      if (ticketTypes) {
        const data = {
          event,
          tickets: normalizedTickets,
        };

        createEventMutation.mutate(data, {
          onSuccess: () => {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "Event created successfully",
                type: "success",
              }),
            );
            dispatch(resetEventState());
            router.push("/event");
          },
          onError: () => {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "Error creating event",
                type: "error",
              }),
            );
          },
        });
      } else {
        const data = {
          tickets: normalizedTickets,
        };
        dispatch(createTickets(data));
        setToggleModal(!toggleModal);
      }
    },
  });

  const getTicketFieldError = (index: number, field: keyof Ticket) => {
    const ticketsErrors = formik.errors.tickets;
    const ticketsTouched = formik.touched.tickets;

    if (!Array.isArray(ticketsErrors)) return null;

    const fieldError = (ticketsErrors[index] as any)?.[field];
    const fieldTouched = Array.isArray(ticketsTouched)
      ? (ticketsTouched[index] as any)?.[field]
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

  const saveAsDraft = () => {
    const data = {
      event: { ...event, status: "draft" },
      tickets: formik.values.tickets,
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
        router.push("/event");
      },
      onError: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Error creating event",
            type: "error",
          }),
        );
      },
    });
  };

  function hasPaidTicket(tickets: Ticket[]): boolean {
    return tickets.some((ticket) => ticket.ticket_type === "paid");
  }

  return (
    <MainLayout>
      <section className="bg-white pb-10 laptop:bg-light_grey">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] border-b-grey-20 border-t-grey-20 bg-white p-[12px] px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">
              Add ticket
            </p>
          </div>
        </div>
        <section className="mt-0 flex flex-col items-center laptop:mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-10 flex w-full flex-col rounded-[12px] bg-white p-[48px] laptop:w-[640px]">
              {formik.values.tickets.map((ticket, index) => (
                <div className="mb-[24px]" key={index}>
                  {index > 0 && (
                    <div className="mb-[16px] flex items-center justify-between rounded-[8px] bg-grey-20 p-[8px] px-[16px]">
                      <p className="text-[14px] font-normal">
                        Ticket {index + 1}
                      </p>
                      <CloseIcon
                        className="h-[10px] w-[10px] cursor-pointer"
                        onClick={() => removeTicket(index)}
                      />
                    </div>
                  )}
                  <p className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey">
                    Ticket type
                  </p>
                  <div className="mt-[16px] flex gap-2">
                    <div
                      className={`flex cursor-pointer items-center gap-2 rounded-[12px] p-[12px] px-[24px] ${
                        ticket.ticket_type === "free"
                          ? "bg-gradient-green-2 shadow-event-custom"
                          : "bg-light_grey text-text-grey"
                      }`}
                      onClick={() =>
                        formik.setFieldValue(
                          `tickets[${index}].ticket_type`,
                          "free",
                        )
                      }
                    >
                      <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom">
                        Free
                      </p>
                    </div>
                    <div
                      className={`flex cursor-pointer items-center gap-2 rounded-[12px] p-[12px] px-[24px] ${
                        ticket.ticket_type === "paid"
                          ? "bg-gradient-green-2 shadow-event-custom"
                          : "bg-light_grey text-text-grey"
                      }`}
                      onClick={() =>
                        formik.setFieldValue(
                          `tickets[${index}].ticket_type`,
                          "paid",
                        )
                      }
                    >
                      <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom">
                        Paid
                      </p>
                    </div>
                  </div>

                  <div className="mt-[24px] grid gap-2">
                    <Label
                      htmlFor={`ticket-name-${index}`}
                      className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                    >
                      Ticket name
                    </Label>
                    <Input
                      id={`ticket-name-${index}`}
                      type="text"
                      placeholder=""
                      className="form-font h-12 rounded-xl border-0 bg-light_grey"
                      value={formik.values.tickets[index].name}
                      onChange={formik.handleChange}
                      name={`tickets[${index}].name`}
                    />
                    {getTicketFieldError(index, "name")}
                  </div>

                  {ticket.ticket_type === "paid" && (
                    <>
                      <div className="mt-[24px] grid gap-2">
                        <Label
                          htmlFor={`ticket-price-${index}`}
                          className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                        >
                          Ticket price
                        </Label>
                        <Input
                          id={`ticket-price-${index}`}
                          type="text"
                          inputMode="numeric"
                          placeholder=""
                          className="form-font h-12 rounded-xl border-0 bg-light_grey"
                          value={formik.values.tickets[index].price || ""}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /[^0-9.]/g,
                              "",
                            );
                            formik.setFieldValue(
                              `tickets[${index}].price`,
                              numericValue,
                            );
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
                      <div className="mt-[24px] flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-[20px] border-[1px] border-text-grey"
                          checked={
                            formik.values.tickets[index].transfer_commission
                          }
                          onChange={formik.handleChange}
                          name={`tickets[${index}].transfer_commission`}
                        />
                        <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom text-text-grey">
                          Transfer commission to guest
                        </p>
                      </div>
                      {getTicketFieldError(index, "transfer_commission")}
                    </>
                  )}

                  <div className="mt-[24px] grid w-full gap-2">
                    <Label
                      htmlFor={`ticket-stock-${index}`}
                      className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                    >
                      Ticket stock
                    </Label>
                    <div className="flex w-full justify-between gap-3">
                      <select
                        value={formik.values.tickets[index].stock_type}
                        onChange={formik.handleChange}
                        className="form-font h-12 w-full rounded-xl border-0 bg-light_grey p-2"
                        name={`tickets[${index}].stock_type`}
                      >
                        <option value="">Select stock</option>
                        <option value="limited">Limited stock</option>
                        <option value="unlimited">Unlimited stock</option>
                      </select>
                      {formik.values.tickets[index].stock_type !==
                        "unlimited" && (
                        <Input
                          type="text"
                          placeholder=""
                          className="form-font h-12 w-full rounded-xl border-0 bg-light_grey"
                          value={formik.values.tickets[index].ticket_stock}
                          onChange={formik.handleChange}
                          name={`tickets[${index}].ticket_stock`}
                          readOnly={
                            formik.values.tickets[index].stock_type ===
                            "unlimited"
                          }
                        />
                      )}
                    </div>
                    {getTicketFieldError(index, "stock_type")}
                    {getTicketFieldError(index, "ticket_stock")}
                  </div>

                  <div className="mt-[24px] grid gap-2">
                    <Label
                      htmlFor={`ticket-limit-${index}`}
                      className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                    >
                      Purchase limit
                    </Label>
                    <Input
                      id={`ticket-limit-${index}`}
                      name={`tickets[${index}].purchase_limit`}
                      type="number"
                      placeholder=""
                      className="form-font h-12 w-full rounded-xl border-0 bg-light_grey"
                      value={formik.values.tickets[index].purchase_limit}
                      onChange={formik.handleChange}
                      min={0}
                    />
                    {getTicketFieldError(index, "purchase_limit")}
                  </div>

                  <div className="mt-[24px] grid gap-2">
                    <Label
                      htmlFor={`ticket-description-${index}`}
                      className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                    >
                      Ticket description
                    </Label>
                    <textarea
                      value={formik.values.tickets[index].description}
                      onChange={formik.handleChange}
                      className="form-font h-[131px] resize-none rounded-xl border-0 bg-light_grey p-4"
                      name={`tickets[${index}].description`}
                    />
                    {getTicketFieldError(index, "description")}
                  </div>
                </div>
              ))}

              <Button
                className="mt-[24px] h-[48px] rounded-[12px] border-0 bg-light-green-10 p-[14px] px-[48px] shadow-none"
                onClick={addTicket}
                type="button"
              >
                <div className="flex items-center gap-1">
                  <PlusIcon className="text-light-green" />
                  <p className="font-sans text-[16px] font-semi-normal leading-[19.2px] text-light-green">
                    Add another ticket
                  </p>
                </div>
              </Button>

              <div className="flex justify-between gap-3">
                <Button
                  className="mt-[24px] h-[48px] w-full rounded-[12px] border-[1px] border-light-grey-50 bg-light-grey-50 p-[14px] px-[48px] shadow-none"
                  type="button"
                  onClick={saveAsDraft}
                >
                  <div className="flex items-center gap-1">
                    <p className="font-sans text-[16px] font-semi-normal leading-[19.2px] text-text-grey">
                      Save as draft
                    </p>
                  </div>
                </Button>
                <FormikButton
                  title="Publish"
                  loading={formik.isSubmitting}
                  error={formik.isValid}
                  classes="rounded-[12px] h-[48px] p-[14px] px-[48px] mt-[24px] border-0 shadow-none w-full"
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

export default AddTicketPage;
