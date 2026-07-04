import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/actions/admin";
import { Users, GraduationCap, Layers, UserCheck } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const cards = [
    { label: "Students", value: stats.students, icon: Users, href: "/admin/students", color: "text-sky-600" },
    { label: "Teachers", value: stats.teachers, icon: GraduationCap, href: "/admin/teachers", color: "text-green-600" },
    { label: "Classes", value: stats.classes, icon: Layers, href: "/admin/classes", color: "text-purple-600" },
    { label: "Pending Admissions", value: stats.pendingAdmissions, icon: UserCheck, href: "/admin/admissions", color: "text-orange-600" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="border-sky-100 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </CardHeader>
              <CardContent><p className="text-3xl font-bold text-sky-900">{c.value}</p></CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card className="border-sky-100">
        <CardHeader><CardTitle>Welcome to Admin Panel</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>Manage students, teachers, admissions, fees, homework and all website content.</p>
          <p>Fee payments are recorded offline only — no online payment gateway.</p>
          <p className="text-orange-600 font-medium">Check Admissions for new inquiry forms from the website.</p>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
