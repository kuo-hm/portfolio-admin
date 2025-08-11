"use client";

import { useState } from "react";
import { EmailTable } from "../../../components/email-table";
import { PaginationControls } from "../../../components/pagination";
import { useEmails } from "../../../hooks/use-emails";

export default function EmailPage() {
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const { data, isLoading, error } = useEmails({ skip, limit });

  if (isLoading) return <p>Loading emails...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!data) return <p>No emails found.</p>;

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Emails</h1>
      </div>

      <div className="flex flex-col justify-between h-full">
        <EmailTable emails={data.data} />
        {data && data.meta && data.meta.totalPages == 1 && (
          <PaginationControls
            skip={skip}
            limit={limit}
            total={data.meta.total}
            onPageChange={(newSkip) => setSkip(Math.max(0, newSkip))}
          />
        )}
      </div>
    </div>
  );
}
