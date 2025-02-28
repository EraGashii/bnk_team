"use client";

import UserDashboardComponent from "@/components/UserDashboardComponent"; // Import the sidebar component
import React, { useEffect, useState } from "react";

// Interface for type checking
interface Deposit {
  id: number;
  amount: number;
  method: string;
  date: string;
}

const Deposits = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const creditCardId = 1; // For demo purposes, replace with actual credit card ID or get from auth context

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/api/deposits/creditCard/${creditCardId}`)
      .then((response) => response.json())
      .then((data) => setDeposits(data))
      .catch((error) => console.error("Error fetching deposits:", error))
      .finally(() => setLoading(false));
  }, [creditCardId]);

  const createDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDeposit = { creditCardId, amount, method, date };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/deposits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDeposit),
      });

      if (!response.ok) {
        throw new Error("Failed to create deposit");
      }

      const data = await response.json();
      setDeposits((prevDeposits) => [...prevDeposits, data]);
      setAmount("");
      setMethod("");
      setDate("");
    } catch (error) {
      console.error("Error creating deposit:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDeposit = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/deposits/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete deposit");
      }

      setDeposits(deposits.filter((deposit) => deposit.id !== id));
    } catch (error) {
      console.error("Error deleting deposit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserDashboardComponent>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-6">Your Deposits</h1>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Deposit History</h2>
          {loading ? (
            <p>Loading deposits...</p>
          ) : deposits.length > 0 ? (
            <ul className="space-y-4">
              {deposits.map((deposit) => (
                <li key={deposit.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium">{deposit.amount} USD</p>
                    <p className="text-sm text-gray-500">{deposit.method}</p>
                    <p className="text-sm text-gray-400">{deposit.date}</p>
                  </div>
                  <button
                    onClick={() => deleteDeposit(deposit.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No deposits found.</p>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800">Create a New Deposit</h2>
          <form onSubmit={createDeposit} className="space-y-4 mt-4">
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Payment Method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              required
            />
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Creating Deposit..." : "Create Deposit"}
            </button>
          </form>
        </div>
      </div>
    </UserDashboardComponent>
  );
};

export default Deposits;
