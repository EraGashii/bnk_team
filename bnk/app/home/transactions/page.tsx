"use client";

import { SidebarProvider } from "@/components/ui/sidebar"; // Import SidebarProvider
import { AppSidebar } from "@/components/ui/app-sidebar"; // Import the sidebar

export default function TransactionsPage() {
    return (
        <SidebarProvider> {/* Wrap the layout with SidebarProvider */}
            <AppSidebar /> {/* Sidebar added here */}
           
        </SidebarProvider>
      );
}
 
