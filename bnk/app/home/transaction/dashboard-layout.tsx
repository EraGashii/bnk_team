"use client"

import type React from "react"

import { Bell, CreditCard } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <CreditCard className="h-6 w-6" />
          <span>FinanceApp</span>
        </Link>
        <div className="flex-1">
          <form className="hidden md:block">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search transactions..."
                className="w-full bg-background md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <img src="/placeholder-user.jpg" alt="Avatar" className="rounded-full" height="32" width="32" />
          <span className="sr-only">Profile</span>
        </Button>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

