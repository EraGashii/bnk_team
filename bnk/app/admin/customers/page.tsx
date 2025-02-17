import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Customers</h1>
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Customer management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

