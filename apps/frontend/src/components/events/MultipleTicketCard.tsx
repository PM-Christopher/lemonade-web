"use client";
import React, {useEffect} from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TicketDetails } from "@/interfaces/EventInterface";
import {useFormikContext} from "formik";

const MultipleTicketCard= ({ ticket, index, formik }: any) => {
  const namePrefix = `assigned_tickets[${index}]`;

  useEffect(() => {
    formik.setFieldValue(`assigned_tickets[${index}].id`, ticket.id);
    formik.setFieldValue(`assigned_tickets[${index}].quantity`, ticket?.quantity);
    // formik (a Formik instance passed down as a prop) is recreated on every
    // keystroke — this must only seed the field once, on mount, for this card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-[24px] bg-grey-20 p-[16px] rounded-[12px] gap-[16px]">
      <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom text-black-light">
        {ticket?.ticket_name ?? "N/A"}
      </p>
      <div className="grid gap-2 mt-[24px]">
        <Label
            htmlFor={`fullname-${index}`}
            className="text-text-grey font-sans font-normal text-[14px] leading-[16.8px]"
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
        {formik.touched.assigned_tickets?.[index]?.fullname && formik.errors.assigned_tickets?.[index]?.fullname && (
            <div className="text-red-500 text-sm">{formik.errors.assigned_tickets[index].fullname}</div>
        )}
      </div>
      <div className="grid gap-2 mt-[16px]">
        <Label
            htmlFor={`email-${index}`}
            className="text-text-grey font-sans font-normal text-[14px] leading-[16.8px]"
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
        {formik.touched.assigned_tickets?.[index]?.email && formik.errors.assigned_tickets?.[index]?.email && (
            <div className="text-red-500 text-sm">{formik.errors.assigned_tickets[index].email}</div>
        )}
      </div>
      <div className="flex justify-between items-center bg-light_grey rounded-[12px] py-[10px] px-[12px] mt-[16px]">
        <div>
          <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
            Ticket quantity
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center">
            <p className="">-</p>
          </div>
          <div className="p-4 rounded-[8px] bg-mid-grey w-[27.75px] h-[28px] flex items-center justify-center">
            <p className="text-[16px] font-sans font-semi-normal leading-[24px] tracking-custom">
              {ticket?.quantity}
            </p>
          </div>
          <div className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center">
            <p className="">+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleTicketCard;
