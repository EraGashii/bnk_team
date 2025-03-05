"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import AdminNavigationComponent from "@/components/AdminNavigationComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionsTable } from "./transactions-table";
import { TransactionFilters } from "./transaction-filters";
import { TransactionStats } from "./transaction-stats";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

export default function TransactionsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "Admin")) {
      router.push("/login"); // Redirect non-admins
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role !== "Admin") return null; // Prevents flicker

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

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

        <Tabs defaultValue="all" className="space-y-4" onValueChange={handleTabChange}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
            <TransactionFilters onFilter={setFilters} />
          </div>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>A complete list of all transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsTable isLoading={isLoading} filters={filters} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Transactions</CardTitle>
                <CardDescription>Transactions that are currently in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsTable isLoading={isLoading} filters={filters} status="pending" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Transactions</CardTitle>
                <CardDescription>Successfully completed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsTable isLoading={isLoading} filters={filters} status="completed" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="failed">
            <Card>
              <CardHeader>
                <CardTitle>Failed Transactions</CardTitle>
                <CardDescription>Transactions that failed to process</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsTable isLoading={isLoading} filters={filters} status="failed" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminNavigationComponent>
  );
}
