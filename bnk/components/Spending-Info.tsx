import { useEffect, useState } from "react";
import { DashboardCard } from "./ui/dashboard-card";
import { Progress } from "@/components/ui/progress";

export function SpendingInfo() {
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(1500); // Example budget, can be dynamic
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:4000/transactions", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const transactions = await response.json();

      // Get the current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Filter transactions for the current month and sum the total spent
      const total = transactions
        .filter((txn) => {
          const txnDate = new Date(txn.createdAt);
          return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
        })
        .reduce((sum, txn) => sum + txn.amount, 0);

      setTotalSpent(total);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const spendingPercentage = (totalSpent / monthlyBudget) * 100;

  return (
    <DashboardCard title="Spending This Month">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Total Spent</span>
          <span className="font-bold">${loading ? "Loading..." : totalSpent.toFixed(2)}</span>
        </div>
        <Progress value={spendingPercentage} className="w-full" />
        <p className="text-sm text-muted-foreground">
          {loading ? "Calculating..." : `${spendingPercentage.toFixed(1)}% of monthly budget`}
        </p>
      </div>
    </DashboardCard>
  );
}
