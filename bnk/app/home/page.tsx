"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default function HomePage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        <SidebarTrigger />

        {/* Main content */}
        <div className="flex-grow p-4">

          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Home Page</h1>
            {/* Sidebar Trigger (optional, for toggling sidebar) */}
          </header>

          <main>
            <div>Test</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
