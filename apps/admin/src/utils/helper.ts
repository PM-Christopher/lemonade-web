export function getFirstLetterCapitalized(str: string | null | undefined): string {
  if (!str) return ""; // Handle empty string case
  return str.charAt(0).toUpperCase();
}

export function capitalizeWords(str: string | null | undefined): string {
  if (!str) return ""; // Handle null, undefined, and empty strings

  return str
    .split(" ") // Split into words
    .map((word) => word?.charAt(0).toUpperCase() + word?.slice(1).toLowerCase()) // Capitalize first letter
    .join(" "); // Join back into a string
}

export function capitalizeSpecial(str: string): string {
  return str
    .split(/[-_]/) // Split by special characters like '-' or '_'
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const GetStatusClass = (status: string) => {
  let color;
  switch (status) {
    case "Pending":
    case "pending":
    case "Draft":
      color = "text-warning-bold"; // Text color for Pending
      break;
    case "Rejected":
    case "Suspended":
    case "Deactivated":
    case "Deleted":
    case "Removed":
    case "Inactive":
    case "INACTIVE":
    case "inactive":
      color = "text-red-1"; // Text color for Rejected
      break;
    case "Scheduled":
      color = "text-blue-accent-2"; // Text color for Rejected
      break;
    case "Successful":
    case "Success":
    case "Completed":
    case "Resolved":
    case "Sent":
    case "Active":
    case "ACTIVE":
    case "active":
      color = "text-light-green-70"; // Text color for Successful
      break;
    default:
      color = "black"; // Default text color
  }
  return color;
};

export const formatThousandSeparator = (num: number | string): string => {
  return Number(num).toLocaleString();
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/** How a payment, payout or withdrawal status reads on screen, and its colour. */
export const transactionStatus = (status: string | null | undefined) => {
  switch ((status ?? "").toLowerCase()) {
    case "success":
    case "successful":
    case "paid":
    case "active":
      return { label: "Successful", className: "text-light-green-70", chip: "bg-green-50" };
    case "pending":
      return { label: "Pending", className: "text-warning-bold", chip: "bg-orange-50" };
    case "approved":
    case "processing":
      return { label: "Processing", className: "text-warning-bold", chip: "bg-orange-50" };
    case "rejected":
      return { label: "Rejected", className: "text-red-1", chip: "bg-red-50" };
    case "failed":
    case "abandoned":
      return { label: "Failed", className: "text-red-1", chip: "bg-red-50" };
    case "reversed":
      return { label: "Reversed", className: "text-red-1", chip: "bg-red-50" };
    default:
      return { label: capitalizeWords(status), className: "", chip: "bg-gray-100" };
  }
};

export const downloadCSV = (csvString: string, filename: string = "data.csv") => {
  if (!csvString) {
    console.error("CSV data is empty");
    return;
  }

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// The `name` of a nested user object, or "" when it's missing.
function userName(user: unknown): string {
  if (!user || typeof user !== "object" || !("name" in user)) return "";
  return typeof user.name === "string" ? user.name : "";
}

export const manualTransactionsExport = (data: Array<Record<string, unknown>>, type: string) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error("No data to export");
    return;
  }

  // Define headers based on data type
  let headers = [];

  if (type === "plan-subscriptions") {
    headers = [
      "ID",
      "Transaction ID",
      "User ID",
      "Subscription ID",
      "Amount",
      "Full Name",
      "Status",
      "Plan",
      "Created At",
    ];
  } else if (type === "wallet-withdrawals") {
    headers = ["ID", "Transaction ID", "Full Name", "Amount", "Image", "Status", "Created At"];
  } else if (type === "events") {
    headers = [
      "ID",
      "Event Name",
      "Event Image",
      "Organizer",
      "Tickets Sold",
      "Status",
      "Created At",
    ];
  } else if (type === "tribe-payments") {
    headers = ["Reference", "User", "Tribe", "Amount", "Paid At", "Status"];
  } else if (type === "boosting" || type === "services" || type === "promotions") {
    headers = ["Reference", "User", "Amount", "Provider", "Paid At", "Status"];
  } else {
    // Default: use object keys as headers
    headers = Object.keys(data[0]);
  }

  // Create CSV content
  let csvContent = headers.join(",") + "\n";

  // Add data rows
  data.forEach((item) => {
    let row = [];

    if (type === "plan-subscriptions") {
      row = [
        item.id || "",
        item.txn_id || "",
        item.user_id || "",
        item.subscription_id || "",
        item.amount || "",
        item.fullname || "",
        item.status || "",
        item.plan || "",
        item.created_at || "",
      ];
    } else if (type === "wallet-withdrawals") {
      row = [
        item.id || "",
        item.txn_id || "",
        item.fullname || "",
        item.amount || "",
        item.image || "",
        item.status || "",
        item.created_at || "",
      ];
    } else if (type === "events") {
      row = [
        item.id || "",
        item.event_name || "",
        item.event_image || "",
        item.organizer || "",
        item.tickets_sold || "",
        item.status || "",
        item.created_at || "",
      ];
    } else if (type === "tribe-payments") {
      row = [
        item.reference || "",
        userName(item.user),
        item.tribe_name || "",
        item.amount || "",
        item.paid_at || "",
        item.status || "",
      ];
    } else if (type === "boosting" || type === "services" || type === "promotions") {
      row = [
        item.reference || "",
        userName(item.user),
        item.amount || "",
        item.provider || "",
        item.paid_at || "",
        item.status || "",
      ];
    } else {
      // Default: use all object values
      row = headers.map((header) => item[header] || "");
    }

    // Handle values that might contain commas
    const processedRow = row.map((value) => {
      // Convert to string and check if it needs quotes
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        // Escape quotes and wrap in quotes
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });

    csvContent += processedRow.join(",") + "\n";
  });

  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  // Set file name based on type
  const filename = `${type}-${new Date().toISOString().split("T")[0]}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
