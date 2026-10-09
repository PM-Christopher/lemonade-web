import type { Metadata } from "next";
import ProfileSetupClient from "./ProfileSetupClient";

export const metadata: Metadata = { title: "Set up your profile" };

export default function Page() {
  return <ProfileSetupClient />;
}
