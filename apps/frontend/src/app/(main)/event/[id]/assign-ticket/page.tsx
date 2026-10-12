import type { Metadata } from "next";
import AssignTicketClient from "./AssignTicketClient";

export const metadata: Metadata = { title: "Assign ticket" };

export default async function AssignTicketPage(props: { params: Promise<{ id: number }> }) {
  const { id } = await props.params;
  return <AssignTicketClient id={id} />;
}
