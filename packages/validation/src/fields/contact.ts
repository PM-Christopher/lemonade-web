import * as yup from "yup";
import { getConfig } from "../config";

export const phoneNumberField = yup
  .string()
  .trim()
  .matches(/^[+]?\d{10,15}$/, () => getConfig().messages.phoneNumber.invalid)
  .required(() => `${getConfig().fieldNames.phoneNumber} is required`);
