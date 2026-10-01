import React from "react";

// Define the type for table props
interface TableProps {
  headers: string[];
  content: Array<Record<string, string | number | null | undefined>>;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

const GlobalTable: React.FC<TableProps> = ({
  headers,
  content,
  currentPage = 1,
  totalPages = 1,
}) => {
  const getStatusClass = (status: string) => {
    let color;
    switch (status) {
      case "Pending":
      case "pending":
      case "Draft":
        color = "text-warning-bold"; // Text color for Pending
        break;
      case "Rejected":
      case "Suspended":
      case "Removed":
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
        color = "text-light-green-70"; // Text color for Successful
        break;
      default:
        color = "black"; // Default text color
    }
    return color;
  };
  return (
    <div className="rounded-lg bg-white shadow-md">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-mid-grey">
            {headers.map((header, idx) => (
              <th className="font-semiBold text-text-grey p-4 text-left text-[12px]" key={idx}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content?.length > 0 ? (
            content.map((row, index) => (
              <tr key={index} className="border-grey-20 h-[72px] border-b">
                {Object.keys(row).map((key, cellIdx) => (
                  <td
                    className={`p-4 font-sans text-sm font-medium ${
                      key === "status" || "STATUS" ? getStatusClass(String(row[key])) : ""
                    }`}
                    key={cellIdx}
                  >
                    {key === "avatar" ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={(row[key] as string) || "https://via.placeholder.com/40"}
                          alt="avatar"
                          className="h-8 w-8 rounded-full"
                        />
                        {row.fullName}
                      </div>
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="p-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="bg-mid-grey flex items-center justify-between rounded-br-lg rounded-bl-lg p-4 px-10">
        <button
          disabled={currentPage === 1}
          // onClick={() => onPageChange(currentPage - 1)}
          className="border-light-grey-50 flex h-9 items-center gap-2 rounded-lg border-2 p-2 text-gray-500 disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              // onClick={() => onPageChange(page)}
              className={`h-8 w-8 rounded-lg p-2 text-sm font-medium ${
                page === currentPage ? "bg-light-white text-text-grey" : "text-gray-500"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          disabled={currentPage === totalPages}
          // onClick={() => onPageChange(currentPage + 1)}
          className="border-light-grey-50 flex h-9 items-center gap-2 rounded-lg border-2 p-2 text-gray-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GlobalTable;
