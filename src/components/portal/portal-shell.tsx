"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, User, BookOpen, FileText, Award, Bell, DollarSign, LogOut, Menu, X, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";
import { BRAND } from "@/lib/constants";

const STUDENT_NAV = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/profile", label: "Profile", icon: User },
  { href: "/student/homework", label: "Homework", icon: ClipboardList },
  { href: "/student/study-material", label: "Study Material", icon: BookOpen },
  { href: "/student/results", label: "Results", icon: Award },
  { href: "/student/notices", label: "Notices", icon: Bell },
  { href: "/student/certificates", label: "Certificates", icon: FileText },
  { href: "/student/fees", label: "Fees (View Only)", icon: DollarSign },
];

const TEACHER_NAV = [
  { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/notes", label: "Upload Notes", icon: BookOpen },
  { href: "/teacher/homework", label: "Homework", icon: ClipboardList },
  { href: "/teacher/assignments", label: "Assignments", icon: FileText },
  { href: "/teacher/marks", label: "Enter Marks", icon: Award },
  { href: "/teacher/notices", label: "Notices", icon: Bell },
];

export function PortalShell({ portal, title, children }: { portal: "student" | "teacher"; title: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = portal === "student" ? STUDENT_NAV : TEACHER_NAV;

  return (
    <div className="min-h-screen bg-sky-50">
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md border shadow" onClick={() => setOpen(!open)}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform lg:translate-x-0 overflow-y-auto", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-4 border-b bg-sky-500 text-white">
          <Link href="/" className="font-bold text-sm">{BRAND.shortName}</Link>
          <p className="text-xs text-sky-100 capitalize">{portal} Portal</p>
        </div>
        <nav className="p-2 space-y-0.5">
          {links.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-sm", pathname === item.href ? "bg-sky-100 text-sky-800 font-medium" : "hover:bg-sky-50")}>
              <item.icon className="h-4 w-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <form action={logout.bind(null, portal)}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />Logout
            </Button>
          </form>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-white px-4 lg:px-8 py-4">
          <h1 className="text-xl font-bold text-sky-900 pl-10 lg:pl-0">{title}</h1>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
