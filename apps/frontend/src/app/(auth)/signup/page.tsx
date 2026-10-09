import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = { title: "Create account" };

export default function Page() {
  return <SignupClient />;
}
