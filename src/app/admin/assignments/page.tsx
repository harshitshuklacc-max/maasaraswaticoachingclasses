import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";

export default async function AssignmentsPage() {
  const db = await readDb();
  const classOpts = db.classes.map((c) => ({ value: c.id, label: c.name }));
  return (
    <AdminShell title="Assignments">
      <div className="grid lg:grid-cols-2 gap-8">
        <AdminForm title="Add Assignment" collection="assignments" fields={[
          { name: "title", label: "Title", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "class_id", label: "Class", type: "select", required: true, options: classOpts },
          { name: "max_marks", label: "Max Marks", type: "number" },
          { name: "due_date", label: "Due Date", type: "date" },
        ]} />
        <AdminTable columns={[{ key: "title", label: "Title" }, { key: "max_marks", label: "Marks" }]} rows={db.assignments as unknown as Record<string, unknown>[]} />
      </div>
    </AdminShell>
  );
}
