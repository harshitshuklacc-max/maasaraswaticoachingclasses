import { PortalShell } from "@/components/portal/portal-shell";
import { requireTeacher } from "@/lib/portal";
import { TeacherForm } from "@/components/teacher/teacher-form";

export default async function TeacherNotesPage() {
  const { user, db } = await requireTeacher();
  return (
    <PortalShell portal="teacher" title="Upload Notes">
      <TeacherForm title="Upload Study Material" collection="study_materials" teacherId={user.id} classOptions={db.classes.map((c) => ({ value: c.id, label: c.name }))} />
    </PortalShell>
  );
}
