import { PortalShell } from "@/components/portal/portal-shell";
import { requireStudent } from "@/lib/portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function StudentHomeworkPage() {
  const { user, db } = await requireStudent();
  const homework = db.homework.filter((h) => h.class_id === user.class_id && (!h.section_id || h.section_id === user.section_id));

  return (
    <PortalShell portal="student" title="Homework">
      {homework.length === 0 ? <p className="text-muted-foreground">No homework assigned for your class.</p> : (
        <div className="space-y-4">
          {homework.map((h) => (
            <Card key={h.id} className="border-sky-100">
              <CardHeader>
                <CardTitle className="text-base">{h.title}</CardTitle>
                {h.due_date && <p className="text-xs text-muted-foreground">Due: {formatDate(h.due_date)}</p>}
              </CardHeader>
              {h.description && <CardContent className="pt-0 text-sm text-muted-foreground">{h.description}</CardContent>}
            </Card>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
