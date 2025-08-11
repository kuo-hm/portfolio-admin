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

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EmailTable emails={data.data} />
        <PaginationControls
          skip={skip}
          limit={limit}
          total={data.meta.total}
          onPageChange={(newSkip) => setSkip(Math.max(0, newSkip))}
        />
      </div>
    </div>
  );
}
