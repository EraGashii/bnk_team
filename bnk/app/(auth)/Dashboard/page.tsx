'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-red-700 text-white w-64 p-6 ${
          isSidebarOpen ? 'block' : 'hidden'
        } md:block fixed h-full`}
      >
        <h1 className="text-3xl font-bold mb-6">MyBankkkk</h1>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard">
              <span className="block py-2 px-4 rounded-md bg-red-800 hover:bg-red-600 transition">
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/profile">
              <span className="block py-2 px-4 rounded-md hover:bg-red-600 transition">
                Profile
              </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/analytics">
              <span className="block py-2 px-4 rounded-md hover:bg-red-600 transition">
                Analytics
              </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings">
              <span className="block py-2 px-4 rounded-md hover:bg-red-600 transition">
                Settings
              </span>
            </Link>
          </li>
          <li>
            <Link href="/sign-out">
              <span className="block py-2 px-4 rounded-md hover:bg-red-600 transition">
                Sign Out
              </span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* <header className="bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        </header> */}

        <section className="flex flex-col items-center justify-center py-12 px-6 bg-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to the Dashboard
            </h3>
            <p className="text-gray-700">
              Here you can find an overview of your account, access tools, and manage your settings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-bold text-gray-900">Account Balance</h4>
              <p className="text-gray-700 mt-2">$12,345.67</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-bold text-gray-900">Recent Transactions</h4>
              <p className="text-gray-700 mt-2">5 new transactions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-bold text-gray-900">Support Tickets</h4>
              <p className="text-gray-700 mt-2">2 unresolved tickets</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
