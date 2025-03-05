import { useEffect, useState } from "react";
import { DashboardCard } from "./ui/dashboard-card";

export function SavingsInfo() {
  const [savings, setSavings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavings();
  }, []);

  const fetchSavings = async () => {
    try {
      const response = await fetch("http://localhost:4000/deposit/getSavings", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch savings");
      }

      const data = await response.json();
      setSavings(data.balance || 0);
    } catch (err) {
      console.error("Error fetching savings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardCard title="Savings">
      <div className="space-y-2">
        <p className="text-2xl font-bold">
          ${loading ? "Loading..." : savings.toFixed(2)}
        </p>
        <p className="text-sm text-muted-foreground">+5% from last month</p>
        <p>Goal: $20,000 by end of year</p>
      </div>
    </DashboardCard>
  );
}
