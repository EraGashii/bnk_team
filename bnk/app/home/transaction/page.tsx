"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { format } from "date-fns"
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, MoreHorizontal, SearchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "./dashboard-layout"

export default function TransactionsPage() {
  const { isAuthenticated, user, loading } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [weeklySpending, setWeeklySpending] = useState(0)
  const [monthlySpending, setMonthlySpending] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions()
    }
  }, [isAuthenticated])

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/transactions/user", { withCredentials: true })
      setTransactions(response.data)
      calculateSpending(response.data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  const calculateSpending = (transactions) => {
    const today = new Date()
    const weekAgo = new Date(today.setDate(today.getDate() - 7))
    const monthAgo = new Date(today.setMonth(today.getMonth() - 1))

    setWeeklySpending(
      transactions
        .filter((t) => new Date(t.createdAt) >= weekAgo)
        .reduce((sum, t) => sum + t.amount, 0)
    )

    setMonthlySpending(
      transactions
        .filter((t) => new Date(t.createdAt) >= monthAgo)
        .reduce((sum, t) => sum + t.amount, 0)
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight">My Transactions</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Spending</CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${weeklySpending.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlySpending.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full mb-4">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(new Date(transaction.createdAt), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{transaction.receiverCardNumber}</TableCell>
                        <TableCell className="text-right font-medium">${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === "completed" ? "default" : "destructive"}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
