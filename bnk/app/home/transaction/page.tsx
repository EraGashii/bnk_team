"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { format } from "date-fns"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CreditCard,
  DollarSign,
  MoreHorizontal,
  SearchIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "./dashboard-layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function TransactionsPage() {
  const { isAuthenticated, user, loading } = useAuth()
  const [userCard, setUserCard] = useState<{ id: number; cardNumber: string } | null>(null)
  const [receiverCardNumber, setReceiverCardNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserCreditCard()
      fetchTransactions()
    }
  }, [isAuthenticated, user])

  const fetchUserCreditCard = async () => {
    try {
      setTransactionLoading(true)
      console.log("Fetching user credit card...")
      const response = await axios.get("http://localhost:4000/transactions/getcc", {
        withCredentials: true,
      })
      console.log("API Response:", response.data)
      setUserCard(response.data)
    } catch (error) {
      console.error("Error fetching credit card:", error)
      if (error.response) {
        console.error("Server Response:", error.response.data)
      }
      setMessage("Failed to fetch your credit card details.")
    } finally {
      setTransactionLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/transactions", {
        withCredentials: true,
      })
      setTransactions(response.data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    if (!userCard) {
      setMessage("Your credit card is not found.")
      return
    }

    try {
      setTransactionLoading(true)
      const transactionData = {
        receiverCardNumber,
        amount: Number.parseFloat(amount),
        reason,
      }

      await axios.post("http://localhost:4000/transactions", transactionData, {
        withCredentials: true,
      })

      setMessage("Transaction successfully sent!")
      setReceiverCardNumber("")
      setAmount("")
      setReason("")
      fetchTransactions() // Refresh the transactions list
    } catch (error) {
      console.error("Transaction error:", error)
      setMessage("Failed to send transaction. Please try again.")
    } finally {
      setTransactionLoading(false)
    }
  }

  // Calculate weekly and monthly spending
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const weeklySpending = transactions
    .filter((t) => new Date(t.createdAt) >= weekAgo && new Date(t.createdAt) <= today)
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlySpending = transactions
    .filter((t) => new Date(t.createdAt) >= monthAgo && new Date(t.createdAt) <= today)
    .reduce((sum, t) => sum + t.amount, 0)

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchQuery === "" ||
      transaction.receiverCardNumber.includes(searchQuery) ||
      transaction.amount.toString().includes(searchQuery)

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    const transactionDate = new Date(transaction.createdAt)
    const matchesDate =
      !date ||
      (transactionDate.getDate() === date.getDate() &&
        transactionDate.getMonth() === date.getMonth() &&
        transactionDate.getFullYear() === date.getFullYear())

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Transactions</h1>
          <Dialog open={isNewTransactionModalOpen} onOpenChange={setIsNewTransactionModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <DollarSign className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Make a Transaction</DialogTitle>
              </DialogHeader>
              {loading ? (
                <p className="text-gray-600">Checking authentication...</p>
              ) : !isAuthenticated ? (
                <p className="text-red-500">You must be logged in to make a transaction.</p>
              ) : (
                <>
                  {/* Display User's Credit Card */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Your Credit Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {transactionLoading ? (
                        <p>Loading...</p>
                      ) : userCard ? (
                        <p className="text-lg font-semibold">**** {userCard.cardNumber.slice(-4)}</p>
                      ) : (
                        <p className="text-red-500">No credit card found.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Transaction Form */}
                  <form onSubmit={handleSubmit}>
                    {/* To Card */}
                    <div className="mb-4">
                      <Label htmlFor="receiverCardNumber">Recipient's Card Number</Label>
                      <Input
                        id="receiverCardNumber"
                        type="text"
                        placeholder="Enter recipient's card number"
                        value={receiverCardNumber}
                        onChange={(e) => setReceiverCardNumber(e.target.value)}
                        required
                      />
                    </div>

                    {/* Reason */}
                    <div className="mb-4">
                      <Label htmlFor="reason">Reason</Label>
                      <Input
                        id="reason"
                        type="text"
                        placeholder="Payment description"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      />
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        step="0.01"
                        min="5.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>

                    {/* Success/Error Message */}
                    {message && (
                      <p
                        className={`text-center text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}
                      >
                        {message}
                      </p>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" disabled={transactionLoading} className="w-full">
                      {transactionLoading ? "Processing..." : "Send Payment"}
                    </Button>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Spending</CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${weeklySpending.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlySpending.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCard ? 1 : 0}</div>
              <p className="text-xs text-muted-foreground">
                {userCard ? `**** ${userCard.cardNumber.slice(-4)}` : "No active cards"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View and manage your transaction history.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative w-full md:w-64">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {(date || statusFilter !== "all" || searchQuery) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDate(undefined)
                    setStatusFilter("all")
                    setSearchQuery("")
                  }}
                  className="h-8 px-2"
                >
                  Reset filters
                </Button>
              )}
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(new Date(transaction.createdAt), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{transaction.receiverCardNumber}</TableCell>
                        <TableCell className="text-right font-medium">${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : transaction.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.reason}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Download receipt</DropdownMenuItem>
                              {transaction.status === "pending" && (
                                <DropdownMenuItem>Cancel transaction</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

