import { PortalShell } from "@/components/portal/portal-shell";
import { requireStudent } from "@/lib/portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudentStudyMaterialPage() {
  const { user, db } = await requireStudent();
  const materials = db.study_materials.filter((m) => m.class_id === user.class_id);

  return (
    <PortalShell portal="student" title="Study Material">
      {materials.length === 0 ? <p className="text-muted-foreground">No study material available yet.</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          {materials.map((m) => (
            <Card key={m.id} className="border-sky-100">
              <CardHeader><CardTitle className="text-base">{m.title}</CardTitle></CardHeader>
              {m.description && <CardContent className="pt-0 text-sm text-muted-foreground">{m.description}</CardContent>}
            </Card>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
