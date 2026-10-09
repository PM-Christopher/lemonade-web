import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = { title: "Forgot password" };

export default function Page() {
  return <ForgotPasswordClient />;
}
