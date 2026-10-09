import type { Metadata } from "next";
import VerifyCodeClient from "./VerifyCodeClient";

export const metadata: Metadata = { title: "Enter your code" };

export default function Page() {
  return <VerifyCodeClient />;
}
