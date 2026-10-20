import type { Metadata } from "next";
import SupportClient from "./SupportClient";

export const metadata: Metadata = { title: "Support messages" };

export default function SupportPage() {
  return <SupportClient />;
}
