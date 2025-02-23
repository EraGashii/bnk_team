import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const transactions = [
  { id: 1, name: "John Doe", amount: "$250.00", date: "2025-02-23" },
  { id: 2, name: "Jane Smith", amount: "$1000.00", date: "2025-02-22" },
  { id: 3, name: "Bob Johnson", amount: "$50.00", date: "2025-02-21" },
  { id: 4, name: "Alice Brown", amount: "$500.00", date: "2025-02-20" },
]

export function RecentTransactions() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${transaction.name.replace(" ", "")}.png`}
                  alt={transaction.name}
                />
                <AvatarFallback>
                  {transaction.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
              <div className="ml-auto font-medium">{transaction.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

