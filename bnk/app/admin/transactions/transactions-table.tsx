"use client"

import { useState, useEffect } from "react"
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
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

// Define the Transaction type
type Transaction = {
  id: string
  senderCardId: number
  senderCardNumber: string
  senderName: string
  receiverCardId: number
  receiverCardNumber: string
  receiverName: string
  amount: number
  status: "pending" | "completed" | "failed"
  createdAt: string
}

type TransactionFilters = {
  searchQuery?: string
  status?: string | null
  amountMin?: number | null
  amountMax?: number | null
  date?: string | null
  dateRange?: string | null
}

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
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-end"
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "completed" ? "success" : status === "pending" ? "outline" : "destructive"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
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
      const date = new Date(row.getValue("createdAt"))
      return (
        <div>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      )
    },
  },
]

// Transactions Table Component
export function TransactionsTable({
  isLoading = false,
  filters = {},
  status,
}: {
  isLoading?: boolean
  filters?: TransactionFilters
  status?: "pending" | "completed" | "failed"
}) {
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true)

        // Build the URL with query parameters for filtering
        const url = new URL("http://localhost:4000/admin/transactions")

        // Add status filter if provided
        if (status && status !== "all") {
          url.searchParams.append("status", status)
        }

        // Add amount filters if provided
        if (filters.amountMin !== null && filters.amountMin !== undefined) {
          url.searchParams.append("minAmount", filters.amountMin.toString())
        }

        if (filters.amountMax !== null && filters.amountMax !== undefined) {
          url.searchParams.append("maxAmount", filters.amountMax.toString())
        }

        // Add date filter if provided
        if (filters.date) {
          url.searchParams.append("date", new Date(filters.date).toISOString().split("T")[0])
        }

        // Add date range filter if provided
        if (filters.dateRange && filters.dateRange !== "all") {
          url.searchParams.append("dateRange", filters.dateRange)
        }

        // Add search query if provided
        if (filters.searchQuery) {
          url.searchParams.append("search", filters.searchQuery)
        }

        const response = await fetch(url.toString(), { credentials: "include" })
        let fetchedData = await response.json()

        // Ensure data is an array
        if (!Array.isArray(fetchedData)) {
          fetchedData = []
        }

        // Client-side filtering for search if the API doesn't support it
        if (filters.searchQuery && !url.searchParams.has("search")) {
          const searchLower = filters.searchQuery.toLowerCase()
          fetchedData = fetchedData.filter(
            (tx: Transaction) =>
              tx.id.toLowerCase().includes(searchLower) ||
              tx.senderName.toLowerCase().includes(searchLower) ||
              tx.receiverName.toLowerCase().includes(searchLower) ||
              tx.senderCardNumber.includes(searchLower) ||
              tx.receiverCardNumber.includes(searchLower),
          )
        }

        setData(fetchedData)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [status, filters])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {table
                .getHeaderGroups()
                .map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )),
                )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {Array.from({ length: columns.length }).map((_, cellIndex) => (
                    <TableCell key={`loading-cell-${cellIndex}`}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          {table.getRowModel().rows.length > 0
            ? `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                data.length,
              )} of ${data.length}`
            : "0"}{" "}
          entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

