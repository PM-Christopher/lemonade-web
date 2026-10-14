"use client";
import React, { useEffect } from "react";
import { Label, Input } from "@lemonade/ui";
import { TicketDetails } from "@/interfaces/EventInterface";
import type { Control, FieldErrors, UseFormSetValue, UseFormRegister } from "react-hook-form";
import type { AssignEventTicketsInput } from "@/features/events/schema";
import { FieldError } from "@/components/global/FieldError";

const MultipleTicketCard = ({
  ticket,
  index,
  register,
  setValue,
  errors,
}: {
  ticket: TicketDetails;
  index: number;
  control: Control<AssignEventTicketsInput>;
  register: UseFormRegister<AssignEventTicketsInput>;
  setValue: UseFormSetValue<AssignEventTicketsInput>;
  errors: FieldErrors<AssignEventTicketsInput>;
}) => {
  useEffect(() => {
    setValue(`assigned_tickets.${index}.id`, String(ticket.id));
    setValue(`assigned_tickets.${index}.quantity`, ticket?.quantity ?? 0);
    // Seed id/quantity once when the card mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-grey-20 mt-6 gap-4 rounded-xl p-4">
      <p className="font-semi-normal tracking-custom text-black-light text-body-l font-sans">
        {ticket?.ticket_name ?? "N/A"}
      </p>
      <div className="mt-6 grid gap-2">
        <Label
          htmlFor={`fullname-${index}`}
          className="text-text-grey text-label font-sans font-normal"
        >
          Full name
        </Label>
        <Input
          id={`fullname-${index}`}
          type="text"
          placeholder="e.g. Jano doe"
          {...register(`assigned_tickets.${index}.fullname`)}
        />
        <FieldError message={errors.assigned_tickets?.[index]?.fullname?.message} />
      </div>
      <div className="mt-4 grid gap-2">
        <Label
          htmlFor={`email-${index}`}
          className="text-text-grey text-label font-sans font-normal"
        >
          Email address
        </Label>
        <Input
          id={`email-${index}`}
          type="email"
          placeholder="e.g. Janodoe@email.com"
          {...register(`assigned_tickets.${index}.email`)}
        />
        <FieldError message={errors.assigned_tickets?.[index]?.email?.message} />
      </div>
      <div className="bg-light_grey mt-4 flex items-center justify-between rounded-xl px-3 py-2.5">
        <div>
          <p className="font-semi-normal tracking-custom text-body-s font-sans">Ticket quantity</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-light-white flex h-6 w-6 items-center justify-center rounded-lg p-3">
            <p className="">-</p>
          </div>
          <div className="bg-mid-grey flex h-7 w-7 items-center justify-center rounded-lg p-4">
            <p className="font-semi-normal tracking-custom text-body-l font-sans">
              {ticket?.quantity}
            </p>
          </div>
          <div className="bg-light-white flex h-6 w-6 items-center justify-center rounded-lg p-3">
            <p className="">+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleTicketCard;
