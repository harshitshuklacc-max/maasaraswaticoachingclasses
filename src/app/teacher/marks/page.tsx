import { PortalShell } from "@/components/portal/portal-shell";
import { requireTeacher } from "@/lib/portal";
import { TeacherForm } from "@/components/teacher/teacher-form";

export default async function TeacherMarksPage() {
  const { user, db } = await requireTeacher();
  return (
    <PortalShell portal="teacher" title="Enter Marks">
      <TeacherForm title="Enter Marks" collection="results" teacherId={user.id} classOptions={db.classes.map((c) => ({ value: c.id, label: c.name }))} />
    </PortalShell>
  );
}
