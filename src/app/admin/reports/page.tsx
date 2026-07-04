import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/actions/admin";
import { readDb } from "@/lib/db";

export default async function ReportsPage() {
  const stats = await getDashboardStats();
  const db = await readDb();
  return (
    <AdminShell title="Reports">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Students", value: stats.students },
          { label: "Teachers", value: stats.teachers },
          { label: "Classes", value: stats.classes },
          { label: "Pending Admissions", value: stats.pendingAdmissions },
          { label: "Total Inquiries", value: db.admissions.length },
          { label: "Fee Records", value: db.fee_records.length },
        ].map((c) => (
          <Card key={c.label} className="border-sky-100">
            <CardHeader><CardTitle className="text-sm text-muted-foreground">{c.label}</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-sky-900">{c.value}</p></CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
