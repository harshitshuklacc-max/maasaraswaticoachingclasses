"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Bell, FileText, DollarSign,
  BarChart3, Settings, LogOut, Menu, X, Layers, Trophy, HelpCircle, ClipboardList, UserCheck, Images,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";
import { BRAND } from "@/lib/constants";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/admissions", label: "Admissions", icon: UserCheck },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/admin/classes", label: "Classes", icon: Layers },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/toppers", label: "Toppers", icon: Trophy },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/notices", label: "Notices", icon: Bell },
  { href: "/admin/homework", label: "Homework", icon: ClipboardList },
  { href: "/admin/assignments", label: "Assignments", icon: FileText },
  { href: "/admin/fees", label: "Fee Records", icon: DollarSign },
  { href: "/admin/results", label: "Results", icon: Trophy },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md border shadow" onClick={() => setOpen(!open)}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 bg-sky-900 text-white transform transition-transform lg:translate-x-0 overflow-y-auto", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-4 border-b border-white/20">
          <Link href="/admin" className="font-bold text-sky-300">{BRAND.shortName} Admin</Link>
        </div>
        <nav className="p-2 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-sm", active ? "bg-sky-500 text-white" : "hover:bg-white/10")}>
                <item.icon className="h-4 w-4 shrink-0" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/20 space-y-2">
          <Button asChild variant="ghost" size="sm" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
            <Link href="/">View Website</Link>
          </Button>
          <form action={logout.bind(null, "admin")}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" />Logout
            </Button>
          </form>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sky-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-white px-4 lg:px-8 py-4 shadow-sm">
          <h1 className="text-xl font-bold text-sky-900 pl-10 lg:pl-0">{title}</h1>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
