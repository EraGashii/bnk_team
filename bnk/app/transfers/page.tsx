"use client";
import { useEffect, useState } from "react";

type Transfer = {
  id: number;
  date: string;
  amount: number;
  fromAccount: string;
  toAccount: string;
  status: string;
};

export default function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/transfers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Transfers:", data); // ✅ Debugging
        setTransfers(data);
      })
      .catch((err) => console.error("Error fetching transfers:", err));
  }, []);
  
  
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="bg-red-600 py-4 text-white text-center">
        <h1 className="text-3xl font-bold">Transfers</h1>
        <p className="text-lg">Manage your money transfers here.</p>
      </div>

      <div className="max-w-6xl mx-auto mt-8 p-6 bg-gray-100 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Transfer History</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-left">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">From Account</th>
                <th className="p-3">To Account</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
    
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="border-b border-gray-300">
                  <td className="p-3">{transfer.date}</td>
                  <td className="p-3 font-semibold">${transfer.amount}</td>
                  <td className="p-3">{transfer.fromAccount}</td>
                  <td className="p-3">{transfer.toAccount}</td>
                  <td className={`p-3 font-semibold ${transfer.status === "Completed" ? "text-green-600" : transfer.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
                    {transfer.status}
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
