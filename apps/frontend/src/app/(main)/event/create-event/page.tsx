import type { Metadata } from "next";
import CreateEventClient from "./CreateEventClient";

export const metadata: Metadata = { title: "Add event" };

export default function CreateEventPage() {
  return <CreateEventClient />;
}
