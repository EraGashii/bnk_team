"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth"; // Import your authentication hook
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionsPage() {
  const { isAuthenticated, user, loading } = useAuth(); // ✅ Get user from useAuth hook
  const [userCard, setUserCard] = useState<{ id: number; cardNumber: string } | null>(null);
  const [receiverCardNumber, setReceiverCardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch the user's credit card after authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserCreditCard();
    }
  }, [isAuthenticated, user]);

const fetchUserCreditCard = async () => {
  try {
    setTransactionLoading(true);
    console.log("Fetching user credit card...");

    const response = await axios.get("http://localhost:4000/transactions/getcc", {
      withCredentials: true, // ✅ Ensure cookies are sent
    });

    console.log("API Response:", response.data);
    setUserCard(response.data);
  } catch (error) {
    console.error("Error fetching credit card:", error);

    if (error.response) {
      console.error("Server Response:", error.response.data);
    }

    setMessage("Failed to fetch your credit card details.");
  } finally {
    setTransactionLoading(false);
  }
};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!userCard) {
      setMessage("Your credit card is not found.");
      return;
    }

    try {
      setTransactionLoading(true);
      const transactionData = {
        receiverCardNumber,
        amount: parseFloat(amount),
        reason,
      };

      await axios.post("http://localhost:4000/transactions", transactionData, {
        withCredentials: true, // ✅ Ensure cookies are sent
      });

      setMessage("Transaction successfully sent!");
      setReceiverCardNumber("");
      setAmount("");
      setReason("");
    } catch (error) {
      console.error("Transaction error:", error);
      setMessage("Failed to send transaction. Please try again.");
    } finally {
      setTransactionLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Make a Transaction</h1>

      {/* Show loading state if user is still being verified */}
      {loading ? (
        <p className="text-gray-600">Checking authentication...</p>
      ) : !isAuthenticated ? (
        <p className="text-red-500">You must be logged in to make a transaction.</p>
      ) : (
        <>
          {/* Display User's Credit Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Credit Card</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionLoading ? (
                <p>Loading...</p>
              ) : userCard ? (
                <p className="text-lg font-semibold">**** {userCard.cardNumber.slice(-4)}</p>
              ) : (
                <p className="text-red-500">No credit card found.</p>
              )}
            </CardContent>
          </Card>

          {/* Transaction Form */}
          <form onSubmit={handleSubmit}>
            {/* To Card */}
            <div className="mb-4">
              <Label htmlFor="receiverCardNumber">Recipient's Card Number</Label>
              <Input
                id="receiverCardNumber"
                type="text"
                placeholder="Enter recipient's card number"
                value={receiverCardNumber}
                onChange={(e) => setReceiverCardNumber(e.target.value)}
                required
              />
            </div>

            {/* Reason */}
            <div className="mb-4">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                type="text"
                placeholder="Payment description"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {/* Amount */}
            <div className="mb-4">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                step="0.01"
                min="5.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Success/Error Message */}
            {message && (
              <p className={`text-center text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                {message}
              </p>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={transactionLoading} className="w-full">
              {transactionLoading ? "Processing..." : "Send Payment"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
