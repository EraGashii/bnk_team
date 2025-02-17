import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentTransactions } from "@/components/recent-transactions"

export default function TransactionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTransactions />
        </CardContent>
      </Card>
    </div>
  )
}

