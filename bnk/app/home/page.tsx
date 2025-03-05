"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import { CreditCardInfo } from "@/components/CreditCard";
import { SpendingInfo } from "@/components/Spending-Info";
import { SavingsInfo } from "@/components/Savings-Info";
import { TransactionHistory } from "@/components/Transaction-History";

export default function DashboardPage() {
  const { isAuthenticated, loading, user } = useAuth(); // Ensure `user` is available in useAuth
  const router = useRouter();

  const [creditCard, setCreditCard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCreditCard();
    }
  }, [isAuthenticated]);

  const fetchUserCreditCard = async () => {
    try {
      const response = await fetch("http://localhost:4000/transactions/getcc", {
        credentials: "include", // Ensures cookies are sent if using JWT stored in cookies
      });

      if (!response.ok) {
        throw new Error("Failed to fetch credit card details");
      }

      const data = await response.json();

      // Ensure the credit card belongs to the logged-in user
      if (data.userId === user?.id) {
        setCreditCard(data);
      } else {
        setError("No credit card found for this user.");
      }
    } catch (err) {
      console.error("Error fetching credit card:", err);
      setError("Error fetching credit card details.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creditCard ? (
          <CreditCardInfo
            cardType="visa"
            lastFourDigits={creditCard.cardNumber.slice(-4)}
            balance={creditCard.balance}
            availableCredit={creditCard.creditLimit - creditCard.balance}
            dueDate="15th of next month"
          />
        ) : (
          <p>{error || "No credit card found."}</p>
        )}

        <SpendingInfo />
        <SavingsInfo />
        <div className="md:col-span-2 lg:col-span-3">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}
