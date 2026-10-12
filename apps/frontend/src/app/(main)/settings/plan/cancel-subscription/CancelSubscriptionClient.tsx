"use client";
import React, { useState } from "react";
import CancelSection from "@/components/settings/Sections/CancelSection";
import ReasonSection from "@/components/settings/Sections/ReasonSection";

// Steps through picking a reason, then confirming the cancellation.
const CancelSubscriptionClient = () => {
  const [section, setSection] = useState("reason");

  const toggleSection = (secName: string) => {
    setSection(secName);
  };

  const renderSection = () => {
    switch (section) {
      case "cancel":
        return <CancelSection />;
      case "reason":
        return <ReasonSection toggle={toggleSection} />;
      default:
        return <CancelSection />;
    }
  };

  return <section className="mt-12 flex flex-col items-center">{renderSection()}</section>;
};

export default CancelSubscriptionClient;
