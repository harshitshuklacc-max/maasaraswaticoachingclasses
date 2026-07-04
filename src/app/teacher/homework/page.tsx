import { PortalShell } from "@/components/portal/portal-shell";
import { requireTeacher } from "@/lib/portal";
import { TeacherForm } from "@/components/teacher/teacher-form";

export default async function TeacherHomeworkPage() {
  const { user, db } = await requireTeacher();
  return (
    <PortalShell portal="teacher" title="Assign Homework">
      <TeacherForm title="Assign Homework" collection="homework" teacherId={user.id} classOptions={db.classes.map((c) => ({ value: c.id, label: c.name }))} />
    </PortalShell>
  );
}
