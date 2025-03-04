'use client'

import AdminNavigationComponent from "@/components/AdminNavigationComponent"
import { StatCard } from "@/components/StatCard"
import { RecentTransactions } from "@/components/RecentTransactions"
import { Users, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation"
import {useEffect} from 'react';

export default function AdminDashboard() {
const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'Admin') {
      // Redirects to the home page (if the user is logged in)
      router.push('/home'); 
    }
    else if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role !== 'Admin') return null;

  return (
    <AdminNavigationComponent>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value="10,482" icon={<Users className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="New Users This Week" value="145" icon={<ArrowUpRight className="h-4 w-4 text-green-500" />} />
          <StatCard title="Total Deposits" value="$234,567" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="Withdrawal Rate" value="2.5%" icon={<ArrowDownRight className="h-4 w-4 text-red-500" />} />
        </div>
        <RecentTransactions />
      </div>
    </AdminNavigationComponent>
  )
}
