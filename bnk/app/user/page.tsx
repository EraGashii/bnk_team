// /app/user/page.tsx

"use client";

import UserDashboardComponent from "@/components/UserDashboardComponent"; // Import the sidebar component

export default function UserDashboardPage() {
  return (
    <UserDashboardComponent>
      <div className="min-h-screen bg-white text-gray-900">
        {/* Dashboard Header with Green Color */}
        <div className="bg-green-600 py-6 text-white text-center w-full">
          <h1 className="text-4xl font-bold">Welcome to your Dashboard</h1>
          <p className="text-xl">Manage your account and transactions here.</p>
        </div>

        {/* Main Content of the dashboard */}
        <div className="max-w-full mx-auto mt-8 p-8 bg-gray-100 shadow-lg rounded-lg">
          <h2 className="text-3xl font-semibold text-green-600 mb-4">Your Overview</h2>
          <p className="text-lg">Here you can see your recent activities, balance, and other important info.</p>
        </div>
      </div>
    </UserDashboardComponent>
  );
}

