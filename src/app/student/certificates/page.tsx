import { PortalShell } from "@/components/portal/portal-shell";
import { requireStudent } from "@/lib/portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function StudentCertificatesPage() {
  const { user, db } = await requireStudent();
  const certs = db.certificates.filter((c) => c.student_id === user.id);

  return (
    <PortalShell portal="student" title="Certificates">
      {certs.length === 0 ? <p className="text-muted-foreground">No certificates available.</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          {certs.map((c) => (
            <Card key={c.id} className="border-sky-100">
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
                {c.issued_date && <p className="text-xs text-muted-foreground">{formatDate(c.issued_date)}</p>}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
