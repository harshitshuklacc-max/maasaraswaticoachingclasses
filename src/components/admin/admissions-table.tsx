"use client";

import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateAdmissionStatus } from "@/actions/admin";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { LocalAdmission } from "@/lib/db";

export function AdmissionsTable({ admissions }: { admissions: LocalAdmission[] }) {
  const router = useRouter();

  async function setStatus(id: string, status: string) {
    await updateAdmissionStatus(id, status);
    toast.success(`Marked as ${status}`);
    router.refresh();
  }

  return (
    <AdminShell title="Admission Inquiries">
      <p className="text-sm text-muted-foreground mb-4">Inquiries submitted from the website admission form appear here.</p>
      {admissions.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">No inquiries yet. They will appear when someone submits the admission form.</p>
      ) : (
        <div className="space-y-4">
          {admissions.map((a) => (
            <div key={a.id} className="bg-white rounded-lg border border-sky-100 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-sky-900">{a.student_name}</h3>
                  <p className="text-sm text-muted-foreground">{a.desired_class} · {a.phone}</p>
                  {a.email && <p className="text-sm text-muted-foreground">{a.email}</p>}
                  {a.parent_name && <p className="text-sm">Parent: {a.parent_name}</p>}
                  {a.message && <p className="text-sm mt-2 bg-sky-50 p-2 rounded">{a.message}</p>}
                </div>
                <Badge variant={a.status === "pending" ? "default" : "outline"}>{a.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{formatDate(a.created_at)}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "contacted")}>Contacted</Button>
                <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "enrolled")}>Enrolled</Button>
                <Button size="sm" variant="ghost" onClick={() => setStatus(a.id, "rejected")}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
