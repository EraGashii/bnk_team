"use client";

import { useState, useEffect } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

// Define the Transaction type
type Transaction = {
  id: string;
  senderCardId: number;
  senderCardNumber: string;
  senderName: string;
  receiverCardId: number;
  receiverCardNumber: string;
  receiverName: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
};

// Define the columns for the table
const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "senderName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Sender
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("senderName")}</div>
        <div className="text-sm text-muted-foreground">{row.original.senderCardNumber}</div>
      </div>
    ),
  },
  {
    accessorKey: "receiverName",
    header: "Receiver",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("receiverName")}</div>
        <div className="text-sm text-muted-foreground">{row.original.receiverCardNumber}</div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="justify-end">
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge variant={status === "completed" ? "success" : status === "pending" ? "outline" : "destructive"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      );
    },
  },
];

// Transactions Table Component
export function TransactionsTable({ status }: { status?: "pending" | "completed" | "failed" }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        const url = status
          ? `http://localhost:4000/admin/transactions?status=${status}`
          : "http://localhost:4000/admin/transactions";

        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();

        // Ensure data is an array before setting state
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]); // Ensure transactions is always an array
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [status]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                <Skeleton className="h-6 w-full" />
              </td>
            </tr>
          ) : Array.isArray(transactions) && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                {columns.map((column) => (
                  <TableCell key={column.accessorKey}>
                    {transaction[column.accessorKey as keyof Transaction]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
