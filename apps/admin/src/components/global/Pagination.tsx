import React from "react";

interface PaginationCompProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  perPage: number;
}

const PaginationComp: React.FC<PaginationCompProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // First, last and the pages around the current one, with "…" for the gaps (e.g. 1 … 4 5 6 … 20).
  const pages: Array<number | "gap"> = [];
  for (let page = 1; page <= totalPages; page++) {
    const isNear = Math.abs(page - currentPage) <= 1;
    if (page === 1 || page === totalPages || isNear) pages.push(page);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }

  return (
    <div className="bg-mid-grey flex items-center justify-between rounded-br-lg rounded-bl-lg p-4 px-10">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="border-light-grey-50 flex h-9 items-center gap-2 rounded-lg border-2 p-2 text-gray-500 disabled:opacity-50"
      >
        Previous
      </button>
      <div className="flex gap-2">
        {pages.map((page, index) =>
          page === "gap" ? (
            <span key={`gap-${index}`} className="flex h-8 items-end px-1 text-gray-500">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 rounded-lg p-2 text-sm font-medium ${
                page === currentPage ? "bg-light-white text-text-grey" : "text-gray-500"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <button
        disabled={Number(currentPage) === Number(totalPages)}
        onClick={() => onPageChange(currentPage + 1)}
        className="border-light-grey-50 flex h-9 items-center gap-2 rounded-lg border-2 p-2 text-gray-500 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComp;
