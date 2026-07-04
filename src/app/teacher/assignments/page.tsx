import { PortalShell } from "@/components/portal/portal-shell";
import { requireTeacher } from "@/lib/portal";
import { TeacherForm } from "@/components/teacher/teacher-form";

export default async function TeacherAssignmentsPage() {
  const { user, db } = await requireTeacher();
  return (
    <PortalShell portal="teacher" title="Assign Assignment">
      <TeacherForm title="Assign Assignment" collection="assignments" teacherId={user.id} classOptions={db.classes.map((c) => ({ value: c.id, label: c.name }))} fields={["max_marks"]} />
    </PortalShell>
  );
}
