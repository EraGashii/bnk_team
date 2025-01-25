import { DashboardCard } from "./ui/dashboard-card"
import { Progress } from "@/components/ui/progress"

export function SpendingInfo() {
  return (
    <DashboardCard title="Spending This Month">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Total Spent</span>
          <span className="font-bold">$876.54</span>
        </div>
        <Progress value={66} className="w-full" />
        <p className="text-sm text-muted-foreground">66% of monthly budget</p>
      </div>
    </DashboardCard>
  )
}

