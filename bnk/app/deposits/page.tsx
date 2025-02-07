"use client";
import { useEffect, useState } from "react";

type Deposit = {
  id: number;
  date: string;
  amount: number;
  method: string;
  status: string;
};

export default function Deposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/deposits") // Call API
      .then((res) => res.json())
      .then((data) => setDeposits(data))
      .catch((err) => console.error("Error fetching deposits:", err));
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="bg-red-600 py-4 text-white text-center">
        <h1 className="text-3xl font-bold">Deposits</h1>
        <p className="text-lg">Manage your deposit transactions here.</p>
      </div>

      <div className="max-w-6xl mx-auto mt-8 p-6 bg-gray-100 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Deposit History</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-left">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {deposits.map((deposit) => (
                <tr key={deposit.id} className="border-b border-gray-300">
                  <td className="p-3">{deposit.date}</td>
                  <td className="p-3 font-semibold">${deposit.amount}</td>
                  <td className="p-3">{deposit.method}</td>
                  <td className={`p-3 font-semibold ${deposit.status === "Completed" ? "text-green-600" : deposit.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
                    {deposit.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
