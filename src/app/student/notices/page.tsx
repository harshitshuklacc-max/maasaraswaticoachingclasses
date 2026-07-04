import { PortalShell } from "@/components/portal/portal-shell";
import { requireStudent } from "@/lib/portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function StudentNoticesPage() {
  const { user, db } = await requireStudent();
  const notices = db.notices.filter((n) =>
    n.target_audience === "all" || n.target_audience === "students" ||
    (n.target_audience === "class" && n.class_id === user.class_id)
  );

  return (
    <PortalShell portal="student" title="Notices">
      {notices.length === 0 ? <p className="text-muted-foreground">No notices at the moment.</p> : (
        <div className="space-y-4 max-w-2xl">
          {notices.map((n) => (
            <Card key={n.id} className="border-sky-100">
              <CardHeader>
                <CardTitle className="text-base">{n.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{formatDate(n.published_at)}</p>
              </CardHeader>
              <CardContent><p className="text-sm whitespace-pre-wrap">{n.content}</p></CardContent>
            </Card>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
