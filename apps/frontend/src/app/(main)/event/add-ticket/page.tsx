import type { Metadata } from "next";
import AddTicketClient from "./AddTicketClient";

export const metadata: Metadata = { title: "Add ticket" };

export default function AddTicketPage() {
  return <AddTicketClient />;
}
