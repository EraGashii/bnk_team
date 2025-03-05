"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  History,
  Wallet,
  AlertCircle
} from "lucide-react";

export default function TaxPage() {
  const [date, setDate] = useState<Date | null>(null);
  const [taxType, setTaxType] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientCardNumber, setRecipientCardNumber] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchUserCreditCard();
    fetchTransactions();
  }, []);

  const fetchUserCreditCard = async () => {
    try {
      const response = await axios.get("http://localhost:4000/transactions/getcc", {
        withCredentials: true,
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error fetching user credit card:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/transactions/user", {
        withCredentials: true,
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleTaxPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!taxType || !amount || !date || !recipientCardNumber) {
      setMessage("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/tax",
        {
          taxName: taxType,
          amount: parseFloat(amount),
          dueDate: date.toISOString(),
          recipientCardNumber,
        },
        { withCredentials: true }
      );

      setMessage("✅ Tax payment successful!");
      setBalance(response.data.remainingBalance);
      fetchTransactions();
      
      setTaxType("");
      setAmount("");
      setDate(null);
      setRecipientCardNumber("");
    } catch (error: any) {
      console.error("Error making tax payment:", error);
      setMessage(
        error.response?.data?.error || "❌ Failed to process tax payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Tax Payment Dashboard</h1>
          <p className="text-muted-foreground">Manage and track your tax payments efficiently</p>
        </div>

        {/* Balance Card */}
        <div className="bg-primary text-primary-foreground rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm opacity-90">Available Balance</p>
              <h2 className="text-3xl font-bold">${balance?.toFixed(2) || '0.00'}</h2>
            </div>
            <Wallet className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax Payment Form */}
          <div className="bg-card text-card-foreground rounded-lg p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Make Tax Payment</h2>
              </div>
              <p className="text-muted-foreground">Fill in the details to process your tax payment</p>
            </div>
            <form className="space-y-4" onSubmit={handleTaxPayment}>
              <div className="space-y-2">
                <label htmlFor="taxType" className="block text-sm font-medium">Tax Type</label>
                <input
                  id="taxType"
                  className="w-full px-3 py-2 bg-input text-foreground rounded-md border border-border"
                  placeholder="e.g., Income Tax, Property Tax"
                  value={taxType}
                  onChange={(e) => setTaxType(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium">Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <input
                    id="amount"
                    type="number"
                    className="w-full pl-10 px-3 py-2 bg-input text-foreground rounded-md border border-border"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Payment Date</label>
                <button
                  type="button"
                  className="w-full px-3 py-2 bg-input text-foreground rounded-md border border-border flex items-center gap-2"
                  onClick={() => setDate(new Date())}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date ? format(date, "PPP") : "Select payment date"}
                </button>
              </div>

              <div className="space-y-2">
                <label htmlFor="recipientCardNumber" className="block text-sm font-medium">
                  Recipient Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <input
                    id="recipientCardNumber"
                    className="w-full pl-10 px-3 py-2 bg-input text-foreground rounded-md border border-border"
                    placeholder="Enter recipient's card number"
                    value={recipientCardNumber}
                    onChange={(e) => setRecipientCardNumber(e.target.value)}
                  />
                </div>
              </div>

              {message && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  message.includes("✅") ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                }`}>
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">{message}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit Payment"}
              </button>
            </form>
          </div>

          {/* Recent Transactions */}
          <div className="bg-card text-card-foreground rounded-lg p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
              </div>
              <p className="text-muted-foreground">Your latest tax payment history</p>
            </div>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No transactions found</p>
              ) : (
                transactions.map((transaction: any) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Payment to {transaction.receiverCardNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-destructive">-${transaction.amount}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
