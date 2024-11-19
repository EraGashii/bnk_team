// components/SidebarLayout.tsx
"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { ReactNode } from "react";

interface SidebarLayoutProps {
  children: ReactNode;
  showSidebar: boolean;
}

export default function SidebarLayout({ children, showSidebar }: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex">
        {showSidebar && <AppSidebar />}
        <main className={`flex-1 ${showSidebar ? 'p-4' : ''}`}>
          {showSidebar && <SidebarTrigger />}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
