'use client'
import AdminNavigationComponent from "@/components/AdminNavigationComponent"
import React, { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Loader2 } from 'lucide-react';

interface Transaction {
  id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  senderCardId: number;
  receiverCardId: number;
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AdminNavigationComponent>
      <div className="flex flex-col flex-grow p-6"> {/* Makes content full width */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Transactions</h1>

        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-gray-700">Loading transactions...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            <p>Error: {error}</p>
            <button 
              onClick={fetchTransactions}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow w-full overflow-x-auto"> {/* Full width */}
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Card</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Card</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{transaction.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      {transaction.amount >= 0 ? (
                        <ArrowDownRight className="text-green-500 mr-2" size={16} />
                      ) : (
                        <ArrowUpRight className="text-red-500 mr-2" size={16} />
                      )}
                      <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatAmount(Math.abs(transaction.amount))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Card #{transaction.senderCardId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Card #{transaction.receiverCardId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.updatedAt)}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminNavigationComponent>
  );
}

export default TransactionsPage;
