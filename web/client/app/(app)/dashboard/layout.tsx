'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useUserStore } from "@/stores/user-store";
import { 
  Home, MessageSquare, BookOpen, Trophy, Search, 
  User, Settings, Menu, X, Plus 
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/threads", label: "Threads", icon: MessageSquare },
  { href: "/dashboard/notebooks", label: "Notebooks", icon: BookOpen },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/search", label: "Search", icon: Search },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-purple-200">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-gradient flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl hidden sm:block gradient-text">EduEcho</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild className="bg-purple-gradient hover:opacity-90 rounded-2xl h-10 px-6 hidden sm:flex text-white">
              <Link href="/dashboard/threads/new">
                <Plus className="w-4 h-4 mr-2" />
                New Thread
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild className="rounded-2xl">
              <Link href="/dashboard/profile">
                <User className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full p-6">
            <nav className="space-y-2 flex-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "hover:bg-purple-50 text-gray-700"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium hover:bg-muted transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Floating Action Button (Mobile) */}
      <Button
        asChild
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-gradient hover:opacity-90 shadow-lg lg:hidden text-white"
      >
        <Link href="/dashboard/threads/new">
          <Plus className="w-6 h-6" />
        </Link>
      </Button>
    </div>
  );
}
