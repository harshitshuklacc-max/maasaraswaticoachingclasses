import { PortalShell } from "@/components/portal/portal-shell";
import { requireTeacher } from "@/lib/portal";
import { TeacherForm } from "@/components/teacher/teacher-form";

export default async function TeacherNoticesPage() {
  const { user, db } = await requireTeacher();
  return (
    <PortalShell portal="teacher" title="Publish Notice">
      <TeacherForm title="Publish Notice" collection="notices" teacherId={user.id} classOptions={db.classes.map((c) => ({ value: c.id, label: c.name }))} />
    </PortalShell>
  );
}
