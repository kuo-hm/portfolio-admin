"use client";

interface PaginationControlsProps {
  skip: number;
  limit: number;
  total: number;
  onPageChange: (newSkip: number) => void;
}

export function PaginationControls({
  skip,
  limit,
  total,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div className="flex gap-2 mt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(skip - limit)}
        className="border px-3 py-1 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(skip + limit)}
        className="border px-3 py-1 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
