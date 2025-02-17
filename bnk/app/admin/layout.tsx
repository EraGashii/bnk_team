import type React from "react"
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardNav } from "@/components/dashboard-nav"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="flex items-center justify-between p-4 bg-white border-b">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <SidebarTrigger />
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}


