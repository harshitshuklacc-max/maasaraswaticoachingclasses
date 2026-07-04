import { PortalShell } from "@/components/portal/portal-shell";
import { requireStudent, getClassName } from "@/lib/portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Award, Bell, DollarSign, ClipboardList } from "lucide-react";

export default async function StudentDashboard() {
  const { user, db } = await requireStudent();
  const links = [
    { href: "/student/homework", label: "Homework", icon: ClipboardList },
    { href: "/student/study-material", label: "Study Material", icon: BookOpen },
    { href: "/student/results", label: "Results", icon: Award },
    { href: "/student/notices", label: "Notices", icon: Bell },
    { href: "/student/fees", label: "View Fees", icon: DollarSign },
  ];

  return (
    <PortalShell portal="student" title="Dashboard">
      <Card className="border-sky-100 mb-6">
        <CardHeader><CardTitle>Welcome, {user.full_name}!</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Class: {getClassName(db, user.class_id)} · Admission: {user.admission_number || "N/A"}
        </CardContent>
      </Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            <Card className="border-sky-100 hover:shadow-md cursor-pointer h-full">
              <CardContent className="pt-6 flex flex-col items-center gap-2">
                <l.icon className="h-8 w-8 text-primary" />
                <span className="font-medium">{l.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
