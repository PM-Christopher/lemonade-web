import { z } from "zod";
import { amountField, emailField, requiredTextField } from "@lemonade/validation";

const endAfterStart = (data: {
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
}) => {
  if (!data.start_date || !data.start_time || !data.end_date || !data.end_time) return true;
  return (
    new Date(`${data.end_date}T${data.end_time}`) > new Date(`${data.start_date}T${data.start_time}`)
  );
};

// Mirrors App\Http\Requests\Event\CreateEventRequest `event.*` (create wizard step 1).
export const createEventDetailsSchema = z
  .object({
    event_image: z.string().min(1, { error: "Event image is required" }),
    event_name: z.string().trim().min(1, { error: "Event name is required" }),
    event_description: z.string().trim().min(1, { error: "Description is required" }),
    category: z.string().trim().min(1, { error: "Category is required" }),
    event_type: z.string().min(1, { error: "Event type is required" }),
    location: z.string(),
    hosting_platform: z.string(),
    meeting_link: z.string(),
    meeting_passcode: z.string(),
    time_zone: z.string().min(1, { error: "Time zone is required" }),
    start_date: z.string().min(1, { error: "Start date is required" }),
    start_time: z.string().min(1, { error: "Start time is required" }),
    end_date: z.string().min(1, { error: "End date is required" }),
    end_time: z.string().min(1, { error: "End time is required" }),
    affiliate_program: z.boolean(),
    commission: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.event_type === "physical" && !data.location?.trim()) {
      ctx.addIssue({ code: "custom", message: "Location is required", path: ["location"] });
    }
    if (data.event_type === "online") {
      if (!data.hosting_platform?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Hosting platform is required",
          path: ["hosting_platform"],
        });
      }
      if (!data.meeting_link?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Meeting link is required",
          path: ["meeting_link"],
        });
      } else {
        const url = z.string().url().safeParse(data.meeting_link);
        if (!url.success) {
          ctx.addIssue({
            code: "custom",
            message: "Meeting link must be a valid url",
            path: ["meeting_link"],
          });
        }
      }
      if (!data.meeting_passcode?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Meeting passcode is required",
          path: ["meeting_passcode"],
        });
      }
    }
    if (!endAfterStart(data)) {
      ctx.addIssue({
        code: "custom",
        message: "End date and time cannot be before start date and time",
        path: ["end_date"],
      });
      ctx.addIssue({
        code: "custom",
        message: "End date and time cannot be before start date and time",
        path: ["end_time"],
      });
    }
    if (data.affiliate_program) {
      const n = Number(String(data.commission).replace(/,/g, ""));
      if (data.commission === "" || Number.isNaN(n)) {
        ctx.addIssue({
          code: "custom",
          message: "Commission rate is required",
          path: ["commission"],
        });
      } else if (n < 0) {
        ctx.addIssue({
          code: "custom",
          message: "Commission can't be negative",
          path: ["commission"],
        });
      } else if (n > 100) {
        ctx.addIssue({
          code: "custom",
          message: "Commission can't exceed 100%",
          path: ["commission"],
        });
      }
    }
  });

export type CreateEventDetailsInput = z.infer<typeof createEventDetailsSchema>;

const eventSocialsSchema = z.object({
  instagram: z.string(),
  linkedin: z.string(),
  facebook: z.string(),
  twitter: z.string(),
  website: z.string(),
});

// Mirrors App\Http\Requests\Event\UpdateEventRequest `event.*` (edit form includes socials).
export const updateEventDetailsSchema = createEventDetailsSchema.and(
  z.object({ socials: eventSocialsSchema }),
);

export type UpdateEventDetailsInput = z.infer<typeof updateEventDetailsSchema>;

// Mirrors ticket rules in CreateEventRequest / EditEventTicketsRequest.
export const eventTicketSchema = z
  .object({
    ticket_id: z.string(),
    ticket_type: z.string().min(1, { error: "Ticket type is required" }),
    name: z.string().trim().min(1, { error: "Ticket name is required" }),
    price: z.string().trim(),
    transfer_commission: z.boolean(),
    stock_type: z.string().min(1, { error: "Stock type is required" }),
    ticket_stock: z.string().trim(),
    purchase_limit: z.string().trim(),
    description: z.string().trim().min(1, { error: "Ticket description is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.ticket_type === "paid") {
      const parsed = amountField({ label: "Ticket price" }).safeParse(data.price);
      if (!parsed.success) {
        ctx.addIssue({
          code: "custom",
          message: parsed.error.issues[0]?.message ?? "Ticket price is required",
          path: ["price"],
        });
      }
    }
    if (data.stock_type === "limited") {
      const cleaned = data.ticket_stock.replace(/,/g, "");
      const num = Number(cleaned);
      if (!cleaned || Number.isNaN(num)) {
        ctx.addIssue({
          code: "custom",
          message: "Ticket stock is required",
          path: ["ticket_stock"],
        });
      } else if (num <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Ticket stock must be greater than 0",
          path: ["ticket_stock"],
        });
      }
    }
    if (data.purchase_limit !== "") {
      const cleaned = data.purchase_limit.replace(/,/g, "");
      const num = Number(cleaned);
      if (Number.isNaN(num) || num <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Purchase limit must be greater than 0",
          path: ["purchase_limit"],
        });
      }
    }
  });

export type EventTicketInput = z.infer<typeof eventTicketSchema>;

// Mirrors App\Http\Requests\Event\CreateEventRequest `tickets` / EditEventTicketsRequest.
export const eventTicketsFormSchema = z.object({
  tickets: z.array(eventTicketSchema).min(1, { error: "At least one ticket is required" }),
});

export type EventTicketsFormInput = z.infer<typeof eventTicketsFormSchema>;

const assignedTicketSchema = z.object({
  id: z.string().min(1),
  quantity: z.number(),
  fullname: z.string().trim().min(1, { error: "Full name is required" }),
  email: emailField,
});

// Mirrors App\Http\Requests\Event\AssignEventTicketsRequest.
export const assignEventTicketsSchema = z
  .object({
    fullname: requiredTextField("fullname"),
    email: emailField,
    assign_multiple: z.boolean(),
    assigned_tickets: z.array(assignedTicketSchema),
  })
  .superRefine((data, ctx) => {
    if (!data.assign_multiple) return;
    if (data.assigned_tickets.length < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Assigned tickets are required",
        path: ["assigned_tickets"],
      });
    }
  });

export type AssignEventTicketsInput = z.infer<typeof assignEventTicketsSchema>;
