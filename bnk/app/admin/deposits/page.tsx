"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Deposit {
  id: number;
  creditCardId: number;
  amount: number;
  method: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

const AdminDeposits = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/admin/deposits");
      const data = await response.json();
      setDeposits(data);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveDeposit = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/deposits/${id}/approve`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to approve deposit");
      }

      fetchDeposits();
    } catch (error) {
      console.error("Error approving deposit:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading deposits...</p>
          ) : deposits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>{deposit.id}</TableCell>
                    <TableCell>{deposit.amount} USD</TableCell>
                    <TableCell>{deposit.method}</TableCell>
                    <TableCell>{deposit.date}</TableCell>
                    <TableCell>
                      <Badge variant={
                        deposit.status === "Pending" ? "secondary" : 
                        deposit.status === "Approved" ? "default" : "destructive"
                      }>
                        {deposit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {deposit.status === "Pending" && (
                        <Button onClick={() => approveDeposit(deposit.id)}>
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No deposits found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDeposits;
