import React from "react";
import { AlertTriangleIcon, ShieldCheckIcon } from "lucide-react";
import type { PayoutRisk } from "@/features/wallet/api";

const LEVELS = {
  low: { label: "Low risk", className: "bg-green-50 text-light-green-70" },
  medium: { label: "Medium risk", className: "bg-orange-50 text-warning-bold" },
  high: { label: "High risk", className: "bg-red-50 text-red-1" },
} as const;

// A small coloured label for how risky a payout looks.
export function RiskBadge({ risk }: { risk: PayoutRisk | undefined }) {
  if (!risk) return <span className="text-text-grey">N/A</span>;
  const level = LEVELS[risk.level];
  return (
    <span
      title={risk.flags.map((flag) => flag.label).join("\n") || "Nothing unusual"}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${level.className}`}
    >
      {risk.level === "low" ? (
        <ShieldCheckIcon className="h-3 w-3" />
      ) : (
        <AlertTriangleIcon className="h-3 w-3" />
      )}
      {level.label}
    </span>
  );
}

// The reasons behind a payout's risk label, for a reviewer to read before deciding.
export function RiskFlagList({ risk }: { risk: PayoutRisk | undefined }) {
  if (!risk) return null;
  const level = LEVELS[risk.level];

  return (
    <div className={`rounded-xl p-3 ${level.className}`}>
      <p className="text-body-s font-semibold">{level.label}</p>
      {risk.flags.length > 0 ? (
        <ul className="text-body-s mt-1 list-disc pl-5 font-normal text-black">
          {risk.flags.map((flag) => (
            <li key={flag.code}>{flag.label}</li>
          ))}
        </ul>
      ) : (
        <p className="text-body-s mt-1 font-normal text-black">
          Nothing unusual about this request.
        </p>
      )}
    </div>
  );
}
