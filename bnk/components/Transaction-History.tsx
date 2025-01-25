"use client"

import { DashboardCard } from "./ui/dashboard-card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", amount: 400 },
  { name: "Feb", amount: 300 },
  { name: "Mar", amount: 600 },
  { name: "Apr", amount: 800 },
  { name: "May", amount: 700 },
  { name: "Jun", amount: 900 },
]

export function TransactionHistory() {
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
  )
}

