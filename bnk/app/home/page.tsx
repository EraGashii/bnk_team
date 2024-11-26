"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import axios from 'axios';
import {useState} from 'react';

export default function HomePage() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState("");

  const handleDeposit = async(e: React.FormEvent) => {
    e.preventDefault();

    try{
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3001/transactions/deposit",
        {amount: parseFloat(amount)},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Deposit successful, new balance: ${response.data.balance}`);  
      setBalance(response.data.balance);
      setAmount("");

    }catch (error) {
      console.error('An error occurred', error);
    }
  }


  




  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        <SidebarTrigger />

        {/* Main content */}
        <div className="flex-grow p-4">

          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Home Page</h1>
            {/* Sidebar Trigger (optional, for toggling sidebar) */}
          </header>


      <main className="w-full max-w-sm">
        <form onSubmit={handleDeposit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Deposit Amount:
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter amount"
              required
              min="0.01"
              step="0.01"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Deposit
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${balance ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </main>

        </div>
      </div>
    </SidebarProvider>
  );
}
