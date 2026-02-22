"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border">
        <div className="p-6 space-y-8">
          <div>
            <h1 className="text-xl font-bold text-primary">Raha Admin</h1>
            <p className="text-sm text-muted-foreground">System Administration</p>
          </div>

          <nav className="space-y-1">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="ghost" className="w-full justify-start">
                Product Reviews
              </Button>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
