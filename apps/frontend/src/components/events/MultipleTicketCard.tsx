"use client";
import React, { useEffect } from "react";
import { Label, Input } from "@lemonade/ui";
import { TicketDetails } from "@/interfaces/EventInterface";
import { useFormikContext } from "formik";

const MultipleTicketCard = ({ ticket, index, formik }: any) => {
  const namePrefix = `assigned_tickets[${index}]`;

  useEffect(() => {
    formik.setFieldValue(`assigned_tickets[${index}].id`, ticket.id);
    formik.setFieldValue(`assigned_tickets[${index}].quantity`, ticket?.quantity);
    // formik (a Formik instance passed down as a prop) is recreated on every
    // keystroke — this must only seed the field once, on mount, for this card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-grey-20 mt-[24px] gap-[16px] rounded-[12px] p-[16px]">
      <p className="font-semi-normal tracking-custom text-black-light font-sans text-[16px] leading-[24px]">
        {ticket?.ticket_name ?? "N/A"}
      </p>
      <div className="mt-[24px] grid gap-2">
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
        {formik.touched.assigned_tickets?.[index]?.fullname &&
          formik.errors.assigned_tickets?.[index]?.fullname && (
            <div className="text-sm text-red-500">
              {formik.errors.assigned_tickets[index].fullname}
            </div>
          )}
      </div>
      <div className="mt-[16px] grid gap-2">
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
        {formik.touched.assigned_tickets?.[index]?.email &&
          formik.errors.assigned_tickets?.[index]?.email && (
            <div className="text-sm text-red-500">
              {formik.errors.assigned_tickets[index].email}
            </div>
          )}
      </div>
      <div className="bg-light_grey mt-[16px] flex items-center justify-between rounded-[12px] px-[12px] py-[10px]">
        <div>
          <p className="font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
            Ticket quantity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-light-white flex h-[24px] w-[24px] items-center justify-center rounded-[8px] p-3">
            <p className="">-</p>
          </div>
          <div className="bg-mid-grey flex h-[28px] w-[27.75px] items-center justify-center rounded-[8px] p-4">
            <p className="font-semi-normal tracking-custom font-sans text-[16px] leading-[24px]">
              {ticket?.quantity}
            </p>
          </div>
          <div className="bg-light-white flex h-[24px] w-[24px] items-center justify-center rounded-[8px] p-3">
            <p className="">+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleTicketCard;
