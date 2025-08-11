"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Email } from "../hooks/use-emails";
interface EmailTableProps {
  emails: Email[];
}

export function EmailTable({ emails }: EmailTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Sent At</TableHead>
          <TableHead>Read All</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emails.map((email) => (
          <TableRow key={email.id} className={email.isSeen ? "opacity-50" : ""}>
            <TableCell>{email.email}</TableCell>
            <TableCell>{email.type}</TableCell>
            <TableCell>{email.subject}</TableCell>
            <TableCell>
              {format(new Date(email.createdAt), "dd/MM/yyyy")}
            </TableCell>
            <TableCell>
              <EmailDetail email={email} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmailDetail({ email }: { email: Email }) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Read The email</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Email Detail</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>
                From: <span className="font-extrabold">{email.email}</span>
              </Label>
              <Label>
                Type of email:{" "}
                <span className="font-extrabold uppercase underline">
                  {email.type}
                </span>
              </Label>
              <Label>
                Subject: <span className="font-extrabold">{email.subject}</span>
              </Label>
              <Label>
                Sent At:{" "}
                <span className="font-extrabold">
                  {format(new Date(email.createdAt), "dd/MM/yyyy")}
                </span>
              </Label>
            </div>
            <div className="grid">
              <Label>Content:</Label>
              <p className="px-2 font-extrabold">{email.message}</p>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
