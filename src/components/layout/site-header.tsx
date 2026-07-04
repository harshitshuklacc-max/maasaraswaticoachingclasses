"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { AdmissionModal } from "@/components/home/admission-modal";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#courses", label: "Courses" },
  { href: "#gallery", label: "Gallery" },
  { href: "#notices", label: "Notices" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <GraduationCap className="h-8 w-8" />
          <span className="hidden sm:inline">{BRAND.shortName}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-primary transition-colors">{l.label}</a>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <a href={`tel:${BRAND.phone}`} className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
            <Phone className="h-4 w-4" />{BRAND.phone}
          </a>
          <AdmissionModal trigger={<Button size="sm">Apply Now</Button>} />
          <Button asChild size="sm" variant="outline"><Link href="/student/login">Student</Link></Button>
          <Button asChild size="sm" variant="outline"><Link href="/teacher/login">Teacher</Link></Button>
          <Button asChild size="sm"><Link href="/admin/login">Admin</Link></Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="block py-2" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <AdmissionModal trigger={<Button className="w-full">Apply for Admission</Button>} />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1"><Link href="/student/login">Student</Link></Button>
              <Button asChild variant="outline" className="flex-1"><Link href="/teacher/login">Teacher</Link></Button>
            </div>
            <Button asChild className="w-full"><Link href="/admin/login">Admin Login</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
}
