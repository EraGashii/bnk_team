"use client";

import { DashboardCard } from "./ui/dashboard-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

interface TransactionData {
  name: string;
  amount: number;
}

export function TransactionHistory() {
  const [data, setData] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/transactions", {
          credentials: "include", // ✅ To send cookies if needed
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transaction history");
        }

        const result = await response.json();

        console.log("Fetched transactions:", result); // ✅ Debugging log

        // Transform the data to fit the expected frontend format
        const formattedData = result.map((transaction: any) => ({
          name: `Transaction #${transaction.id}`,
          amount: transaction.amount,
        }));

        setData(formattedData);
      } catch (err) {
        console.error(err);
        setError("Error fetching transaction history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading transaction history...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <DashboardCard title="Transaction History">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
