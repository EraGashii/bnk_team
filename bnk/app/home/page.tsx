"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import { CreditCardInfo } from "@/components/CreditCard";
import { SpendingInfo } from "@/components/Spending-Info";
import { SavingsInfo } from "@/components/Savings-Info";
import { TransactionHistory } from "@/components/Transaction-History";

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreditCardInfo
          cardType="visa"
          lastFourDigits="1234"
          balance={1234.56}
          availableCredit={5000.0}
          dueDate="15th of next month"
        />
        <CreditCardInfo
          cardType="mastercard"
          lastFourDigits="5678"
          balance={2345.67}
          availableCredit={7500.0}
          dueDate="20th of next month"
        />
        <SpendingInfo />
        <SavingsInfo />
        <div className="md:col-span-2 lg:col-span-3">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}

