import { DashboardCard } from "./ui/dashboard-card"

export function SavingsInfo() {
  return (
    <DashboardCard title="Savings">
      <div className="space-y-2">
        <p className="text-2xl font-bold">$10,000.00</p>
        <p className="text-sm text-muted-foreground">+5% from last month</p>
        <p>Goal: $20,000 by end of year</p>
      </div>
    </DashboardCard>
  )
}
