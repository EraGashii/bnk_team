'use client'

import * as React from 'react'
import { Moon, Sun, Home, CreditCard, PiggyBank, BarChart4, Settings, HelpCircle, LogOut, Banknote, Send } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: CreditCard, label: 'Accounts', href: '/accounts' },
  { icon: PiggyBank, label: 'Savings', href: '/savings' },
  { icon: BarChart4, label: 'Investments', href: '/investments' },
  { icon: Banknote, label: 'Deposits', href: '/deposits' }, // Added Deposits Page
  { icon: Send, label: 'Transfers', href: '/transfers' }, // Added Transfers Page
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/help' },
]

export function NavbarComponent() {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border">
        {/* Sidebar Header */}
        <SidebarHeader className="p-4">
          <div className="flex items-center space-x-2">
            <Avatar>
            <AvatarImage src="/your-logo.png" alt="Bank Logo" />
              <AvatarFallback>BK</AvatarFallback>
            </Avatar>
            <span className="text-lg font-semibold">MyBank</span>
          </div>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <Link href={item.href} className="flex items-center space-x-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="p-4 space-y-2">
          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Logout Button */}
          <SidebarMenuButton className="w-full justify-start" asChild>
            <button>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </button>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
