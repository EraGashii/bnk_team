"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  ArrowLeftRight,
  Settings,
  HelpCircle,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/home",
    color: "text-sky-500",
    showInMobile: true,
  },
  {
    label: "Accounts",
    icon: CreditCard,
    href: "/accounts",
    color: "text-violet-500",
    showInMobile: true,
  },
  {
    label: "Savings",
    icon: PiggyBank,
    href: "/home/savings",
    color: "text-pink-500",
    showInMobile: true,
  },
  {
    label: "Transfers",
    icon: ArrowLeftRight,
    href: "/home/transaction",
    color: "text-orange-500",
    showInMobile: true,
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "text-emerald-500",
    showInMobile: true,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    showInMobile: false,
  },
  {
    label: "Help & Support",
    icon: HelpCircle,
    href: "/support",
    showInMobile: false,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = (
    <ScrollArea className="h-full py-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex h-[60px] items-center justify-center border-b px-6">
          <span className="font-semibold text-lg">Banking App</span>
        </div>
        <div className="flex-1 px-3">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary transition-all",
                  pathname === route.href
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground"
                )}
              >
                <route.icon className={cn("h-5 w-5", route.color)} />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-auto px-3">
          <Button variant="ghost" className="w-full justify-start gap-x-2">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className={cn(
          "hidden md:flex w-72 flex-col border-r bg-background",
          className
        )}
      >
        {SidebarContent}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
        <div className="flex items-center justify-around h-16">
          {routes
            .filter((route) => route.showInMobile)
            .map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs font-medium transition-colors",
                  pathname === route.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <route.icon
                  className={cn("h-5 w-5", 
                    pathname === route.href ? route.color : ""
                  )}
                />
                <span>{route.label}</span>
              </Link>
            ))}
        </div>
      </nav>
    </>
  );
}
