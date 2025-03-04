"use client";

import { useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([
    { id: 1, amount: 500, recipient: "John Doe", method: "Bank Transfer", date: "03/02/2025", status: "Completed" },
    { id: 2, amount: 250, recipient: "Jane Smith", method: "Credit Card", date: "02/28/2025", status: "Pending" },
  ]);

  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [method, setMethod] = useState("");
  const [date, setDate] = useState("");

  const handleCreateTransaction = () => {
    if (!amount || !recipient || !method || !date) return;

    const newTransaction = {
      id: transactions.length + 1,
      amount,
      recipient,
      method,
      date,
      status: "Pending",
    };

    setTransactions([...transactions, newTransaction]);
    setAmount("");
    setRecipient("");
    setMethod("");
    setDate("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700">Your Transactions</h2>
      <p className="text-gray-600">Transaction History</p>

      {/* Transactions History */}
      {transactions.length === 0 ? (
        <p className="text-gray-500 mt-4">No transactions found.</p>
      ) : (
        <table className="w-full mt-4 border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Recipient</th>
              <th className="p-2 border">Payment Method</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border text-center">
                <td className="p-2 border">${txn.amount}</td>
                <td className="p-2 border">{txn.recipient}</td>
                <td className="p-2 border">{txn.method}</td>
                <td className="p-2 border">{txn.date}</td>
                <td className={`p-2 border ${txn.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>
                  {txn.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create New Transaction */}
      <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold">Create a New Transaction</h3>
        <input
          type="number"
          className="w-full p-2 border mt-2"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border mt-2"
          placeholder="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border mt-2"
          placeholder="Payment Method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border mt-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="w-full bg-green-600 text-white p-2 mt-4 rounded"
          onClick={handleCreateTransaction}
        >
          Create Transaction
        </button>
      </div>
    </div>
  );
}
