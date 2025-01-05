'use client'

import * as React from 'react'
import { Moon, Sun, Home, CreditCard, PiggyBank, BarChart4, Settings, HelpCircle, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'

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
  { icon: Home, label: 'Dashboard', href: '#' },
  { icon: CreditCard, label: 'Accounts', href: '#' },
  { icon: PiggyBank, label: 'Savings', href: '#' },
  { icon: BarChart4, label: 'Investments', href: '#' },
  { icon: Settings, label: 'Settings', href: '#' },
  { icon: HelpCircle, label: 'Help & Support', href: '#' },
]

export function NavbarComponent() {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border">
        <SidebarHeader className="p-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Bank Logo" />
              <AvatarFallback>BK</AvatarFallback>
            </Avatar>
            <span className="text-lg font-semibold">MyBank</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <a href={item.href} className="flex items-center space-x-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 space-y-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
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
