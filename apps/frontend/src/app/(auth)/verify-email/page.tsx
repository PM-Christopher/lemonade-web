import type { Metadata } from "next";
import VerifyEmailClient from "./VerifyEmailClient";

export const metadata: Metadata = { title: "Verify your email" };

export default function Page() {
  return <VerifyEmailClient />;
}
