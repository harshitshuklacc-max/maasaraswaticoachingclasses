import { PortalShell } from "@/components/portal/portal-shell";
import { requireTeacher } from "@/lib/portal";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ClipboardList, FileText, Award, Bell } from "lucide-react";

export default async function TeacherDashboard() {
  const { user } = await requireTeacher();
  const links = [
    { href: "/teacher/notes", label: "Upload Notes", icon: BookOpen },
    { href: "/teacher/homework", label: "Homework", icon: ClipboardList },
    { href: "/teacher/assignments", label: "Assignments", icon: FileText },
    { href: "/teacher/marks", label: "Enter Marks", icon: Award },
    { href: "/teacher/notices", label: "Notices", icon: Bell },
  ];

  return (
    <PortalShell portal="teacher" title="Dashboard">
      <p className="text-muted-foreground mb-4">Welcome, {user.full_name}! Assign work to specific classes.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            <Card className="border-sky-100 hover:shadow-md cursor-pointer h-full">
              <CardContent className="pt-6 flex flex-col items-center gap-2">
                <l.icon className="h-8 w-8 text-primary" /><span className="font-medium">{l.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
