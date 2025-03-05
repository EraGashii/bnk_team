import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, DollarSign, Users } from "lucide-react";

export function TransactionStats() {
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const transactionsRes = await fetch("http://localhost:4000/admin/total-transactions", { credentials: "include" });
        const depositsRes = await fetch("http://localhost:4000/admin/total-deposits", { credentials: "include" });
        const usersRes = await fetch("http://localhost:4000/admin/active-users", { credentials: "include" });

        const transactionsData = await transactionsRes.json();
        const depositsData = await depositsRes.json();
        const usersData = await usersRes.json();

        setTotalTransactions(transactionsData.totalTransactions || 0);
        setTotalDeposits(depositsData.totalDeposits || 0);
        setActiveUsers(usersData.activeUsers || 0);
      } catch (error) {
        console.error("Error fetching transaction stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTransactions.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalDeposits.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
