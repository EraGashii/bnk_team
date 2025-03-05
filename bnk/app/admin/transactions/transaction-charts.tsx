import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function TransactionCharts() {
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const res = await fetch("http://localhost:4000/admin/monthly-transactions", { credentials: "include" });
        const data = await res.json();
        setTransactionData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }

    fetchChartData();
  }, []);

  return (
    <AreaChart data={transactionData} width={500} height={300}>
      <XAxis dataKey="month" />
      <YAxis />
      <Area dataKey="totalAmount" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorAmount)" />
    </AreaChart>
  );
}
