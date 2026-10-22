// Headers that hold numbers (counts, money). Their column is centered, head and cells.
const NUMERIC_HEADERS = new Set([
  "amount",
  "balance",
  "members",
  "access fee",
  "total earned",
  "subscribers",
  "tickets sold",
  "total referrals",
  "subscribed referrals",
  "referral earnings",
  "no. of programs",
  "monthly charge",
  "yearly charge",
  "admins",
  "permissions",
]);

// Full class names, so Tailwind can see them. Column numbers start at 1.
const CENTER_COLUMN = [
  "",
  "[&_th:nth-child(1)]:text-center [&_td:nth-child(1)]:text-center",
  "[&_th:nth-child(2)]:text-center [&_td:nth-child(2)]:text-center",
  "[&_th:nth-child(3)]:text-center [&_td:nth-child(3)]:text-center",
  "[&_th:nth-child(4)]:text-center [&_td:nth-child(4)]:text-center",
  "[&_th:nth-child(5)]:text-center [&_td:nth-child(5)]:text-center",
  "[&_th:nth-child(6)]:text-center [&_td:nth-child(6)]:text-center",
  "[&_th:nth-child(7)]:text-center [&_td:nth-child(7)]:text-center",
  "[&_th:nth-child(8)]:text-center [&_td:nth-child(8)]:text-center",
  "[&_th:nth-child(9)]:text-center [&_td:nth-child(9)]:text-center",
  "[&_th:nth-child(10)]:text-center [&_td:nth-child(10)]:text-center",
];

/** Table classes that center every numeric column, found by header label. */
export function centerNumericColumns(headers: ReadonlyArray<string>): string {
  return headers
    .map((header, index) =>
      NUMERIC_HEADERS.has(header.trim().toLowerCase()) ? (CENTER_COLUMN[index + 1] ?? "") : "",
    )
    .filter(Boolean)
    .join(" ");
}
