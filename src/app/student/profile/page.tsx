import { PortalShell } from "@/components/portal/portal-shell";
import { requireStudent, getClassName } from "@/lib/portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudentProfilePage() {
  const { user, db } = await requireStudent();
  return (
    <PortalShell portal="student" title="My Profile">
      <Card className="border-sky-100 max-w-lg">
        <CardHeader><CardTitle>{user.full_name}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Username:</span> {user.username}</p>
          <p><span className="text-muted-foreground">Class:</span> {getClassName(db, user.class_id)}</p>
          <p><span className="text-muted-foreground">Admission No:</span> {user.admission_number || "-"}</p>
          <p><span className="text-muted-foreground">Parent:</span> {user.parent_name || "-"}</p>
          <p><span className="text-muted-foreground">Parent Phone:</span> {user.parent_phone || "-"}</p>
        </CardContent>
      </Card>
    </PortalShell>
  );
}
