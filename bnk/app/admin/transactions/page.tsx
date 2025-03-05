"use client"

import { useState } from "react"
import AdminNavigationComponent from "@/components/AdminNavigationComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionsTable } from "./transactions-table"
import { TransactionCharts } from "./transaction-charts"
import { TransactionFilters } from "./transaction-filters"
import { TransactionStats } from "./transaction-stats"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

export default function TransactionsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // In a real implementation, this would fetch data from your API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <AdminNavigationComponent>
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage and monitor all transactions in the system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <TransactionStats />

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
          <TransactionFilters />
        </div>

        <TabsContent value="all" className="space-y-6">
          <TransactionCharts />
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>A complete list of all transactions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Transactions</CardTitle>
              <CardDescription>Transactions that are awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable isLoading={isLoading} status="pending" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Transactions</CardTitle>
              <CardDescription>Successfully processed transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable isLoading={isLoading} status="completed" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Failed Transactions</CardTitle>
              <CardDescription>Transactions that could not be processed</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable isLoading={isLoading} status="failed" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </AdminNavigationComponent >
  )
}

