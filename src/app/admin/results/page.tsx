import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";

export default async function ResultsPage() {
  const db = await readDb();
  const studentOpts = db.users.filter((u) => u.role === "student").map((s) => ({ value: s.id, label: s.full_name }));
  const rows = db.results.map((r) => ({
    ...r,
    student: db.users.find((u) => u.id === r.student_id)?.full_name || "-",
  }));
  return (
    <AdminShell title="Results">
      <div className="grid lg:grid-cols-2 gap-8">
        <AdminForm title="Add Result" collection="results" fields={[
          { name: "student_id", label: "Student", type: "select", required: true, options: studentOpts },
          { name: "exam_name", label: "Exam", required: true },
          { name: "subject", label: "Subject" },
          { name: "marks_obtained", label: "Marks", type: "number" },
          { name: "max_marks", label: "Max Marks", type: "number" },
          { name: "grade", label: "Grade" },
        ]} />
        <AdminTable columns={[{ key: "student", label: "Student" }, { key: "exam_name", label: "Exam" }, { key: "marks_obtained", label: "Marks" }]} rows={rows as unknown as Record<string, unknown>[]} />
      </div>
    </AdminShell>
  );
}
