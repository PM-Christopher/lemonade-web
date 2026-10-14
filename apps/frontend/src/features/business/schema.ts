import { z } from "zod";
import {
  amountField,
  emailField,
  optionalTextField,
  requiredTextField,
} from "@lemonade/validation";

// Optional decimal string; empty means null on submit.
const optionalServiceRateField = z
  .string()
  .trim()
  .refine((value) => {
    const cleaned = value.replace(/,/g, "");
    return cleaned === "" || /^\d+(\.\d{1,2})?$/.test(cleaned);
  }, { error: "Service rate must be a number with at most 2 decimal places" });

// Mirrors App\Http\Requests\Business\CreateBusinessRequest.
export const createBusinessSchema = z.object({
  image: z.string().min(1, { error: "Business image is required" }),
  name: z.string().trim().min(1, { error: "Business name is required" }),
  categories: z.array(z.string()).min(1, { error: "At least one category is required" }),
  description: z.string().trim().min(1, { error: "Description is required" }),
  city: requiredTextField("city"),
  country: requiredTextField("country"),
  services: z.array(z.string()).min(1, { error: "At least one service is required" }),
  service_rate: optionalServiceRateField,
  gallery: z.array(z.string()),
  email: emailField,
  phone_number: z.string().trim().min(1, { error: "Phone number is required" }),
  website_url: z
    .string()
    .trim()
    .min(1, { error: "Website url is required" })
    .url({ error: "Website must be a valid URL" }),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;

// Mirrors App\Http\Requests\Business\UpdateBusinessRequest.
export const updateBusinessSchema = createBusinessSchema.extend({
  gallery: z.array(z.string()),
});

export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;

// Mirrors App\Http\Requests\Business\BoostBusinessRequest.
export const boostBusinessSchema = z.object({
  package: z.string().min(1, { error: "Package is required" }),
  option: z.string().min(1, { error: "Option is required" }),
  start_date: z.string().min(1, { error: "Start date is required" }),
  start_time: z.string().min(1, { error: "Start time is required" }),
});

export type BoostBusinessInput = z.infer<typeof boostBusinessSchema>;

// Mirrors App\Http\Requests\Business\DisputeJobRequest.
export const disputeJobSchema = z.object({
  dispute: z.string().trim().min(1, { error: "Dispute is required" }),
  attachments: z.array(z.string()).min(1, { error: "Attachments are required" }),
});
export type DisputeJobInput = z.infer<typeof disputeJobSchema>;

// Mirrors App\Http\Requests\Business\RequestBusinessServiceRequest.
export const requestServiceSchema = z.object({
  services: z.array(z.string()).min(1, { error: "At least one service is required" }),
  amount: amountField(),
  additional_information: optionalTextField(),
});
export type RequestServiceInput = z.infer<typeof requestServiceSchema>;

// Client-only business browse filter (no matching FormRequest).
export const businessFilterSchema = z.object({
  category: optionalTextField(),
  location: optionalTextField(),
  service_type: optionalTextField(),
  start_range: optionalTextField(),
  end_range: optionalTextField(),
});
export type BusinessFilterInput = z.infer<typeof businessFilterSchema>;
