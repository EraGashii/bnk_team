"use client";

import AdminNavigationComponent from "@/components/AdminNavigationComponent";
import { StatCard } from "@/components/StatCard";
import { RecentTransactions } from "@/components/RecentTransactions";
import { Users, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "Admin")) {
      router.push("/home");
    }
  }, [isAuthenticated, user, loading, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "Admin") {
      fetchAdminStats();
    }
  }, [isAuthenticated, user]);

  const fetchAdminStats = async () => {
    try {
      const usersResponse = await fetch("http://localhost:4000/admin/total-users", {
        credentials: "include",
      });
      const newUsersResponse = await fetch("http://localhost:4000/admin/new-users", {
        credentials: "include",
      });
      const depositsResponse = await fetch("http://localhost:4000/admin/total-deposits", {
        credentials: "include",
      });
      const transactionsResponse = await fetch("http://localhost:4000/admin/recent-transactions", {
        credentials: "include",
      });

      const usersData = await usersResponse.json();
      const newUsersData = await newUsersResponse.json();
      const depositsData = await depositsResponse.json();
      const transactionsData = await transactionsResponse.json();

      setTotalUsers(usersData.totalUsers || 0);
      setNewUsers(newUsersData.newUsers || 0);
      setTotalDeposits(depositsData.totalDeposits || 0);
      setRecentTransactions(transactionsData || []);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role !== "Admin") return null;

  return (
    <AdminNavigationComponent>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={totalUsers.toLocaleString()}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="New Users This Week"
            value={newUsers.toLocaleString()}
            icon={<ArrowUpRight className="h-4 w-4 text-green-500" />}
          />
          <StatCard
            title="Total Transactions (Past Week)"
            value={`$${totalDeposits.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Withdrawal Rate"
            value="2.5%"
            icon={<ArrowDownRight className="h-4 w-4 text-red-500" />}
          />
        </div>
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </AdminNavigationComponent>
  );
}
