"use client";
import React, { useEffect } from "react";
import { Label, Input } from "@lemonade/ui";
import { TicketDetails } from "@/interfaces/EventInterface";

interface AssignedTicket {
  id?: number | string;
  quantity?: number;
  fullname?: string;
  email?: string;
}

interface AssignTicketFormik {
  values: { assigned_tickets: AssignedTicket[] };
  touched: { assigned_tickets?: unknown };
  errors: { assigned_tickets?: unknown };
  setFieldValue: (field: string, value: unknown) => unknown;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const MultipleTicketCard = ({
  ticket,
  index,
  formik,
}: {
  ticket: TicketDetails;
  index: number;
  formik: AssignTicketFormik;
}) => {
  const namePrefix = `assigned_tickets[${index}]`;
  const touchedTickets = formik.touched.assigned_tickets as
    | Array<{ fullname?: boolean; email?: boolean }>
    | undefined;
  const errorTickets = formik.errors.assigned_tickets as
    | Array<{ fullname?: string; email?: string }>
    | undefined;

  useEffect(() => {
    formik.setFieldValue(`assigned_tickets[${index}].id`, ticket.id);
    formik.setFieldValue(`assigned_tickets[${index}].quantity`, ticket?.quantity);
    // formik (a Formik instance passed down as a prop) is recreated on every
    // keystroke — this must only seed the field once, on mount, for this card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-grey-20 mt-6 gap-4 rounded-xl p-4">
      <p className="font-semi-normal tracking-custom text-black-light font-sans text-[16px] leading-[24px]">
        {ticket?.ticket_name ?? "N/A"}
      </p>
      <div className="mt-6 grid gap-2">
        <Label
          htmlFor={`fullname-${index}`}
          className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
        >
          Full name
        </Label>
        <Input
          id={`fullname-${index}`}
          name={`${namePrefix}.fullname`}
          type="text"
          placeholder="e.g. Jano doe"
          value={formik.values.assigned_tickets[index]?.fullname || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {touchedTickets?.[index]?.fullname && errorTickets?.[index]?.fullname && (
          <div className="text-sm text-red-500">{errorTickets[index].fullname}</div>
        )}
      </div>
      <div className="mt-4 grid gap-2">
        <Label
          htmlFor={`email-${index}`}
          className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
        >
          Email address
        </Label>
        <Input
          id={`email-${index}`}
          name={`${namePrefix}.email`}
          type="email"
          placeholder="e.g. Janodoe@email.com"
          value={formik.values.assigned_tickets[index]?.email || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {touchedTickets?.[index]?.email && errorTickets?.[index]?.email && (
          <div className="text-sm text-red-500">{errorTickets[index].email}</div>
        )}
      </div>
      <div className="bg-light_grey mt-4 flex items-center justify-between rounded-xl px-3 py-2.5">
        <div>
          <p className="font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
            Ticket quantity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-light-white flex h-6 w-6 items-center justify-center rounded-[8px] p-3">
            <p className="">-</p>
          </div>
          <div className="bg-mid-grey flex h-7 w-[27.75px] items-center justify-center rounded-[8px] p-4">
            <p className="font-semi-normal tracking-custom font-sans text-[16px] leading-[24px]">
              {ticket?.quantity}
            </p>
          </div>
          <div className="bg-light-white flex h-6 w-6 items-center justify-center rounded-[8px] p-3">
            <p className="">+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleTicketCard;
