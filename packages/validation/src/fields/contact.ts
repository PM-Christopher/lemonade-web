import { z } from "zod";
import { getConfig } from "../config";

export const phoneNumberField = z
  .string()
  .trim()
  .min(1, { error: () => `${getConfig().fieldNames.phoneNumber} is required` })
  .regex(/^[+]?\d{10,15}$/, { error: () => getConfig().messages.phoneNumber.invalid });
