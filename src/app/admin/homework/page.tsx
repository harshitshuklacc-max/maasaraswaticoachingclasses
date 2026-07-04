import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";

export default async function HomeworkPage() {
  const db = await readDb();
  const classOpts = db.classes.map((c) => ({ value: c.id, label: c.name }));
  return (
    <AdminShell title="Homework">
      <p className="text-sm text-muted-foreground mb-4">Assigned to classes and optional sections — not batches.</p>
      <div className="grid lg:grid-cols-2 gap-8">
        <AdminForm title="Add Homework" collection="homework" fields={[
          { name: "title", label: "Title", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "class_id", label: "Class", type: "select", required: true, options: classOpts },
          { name: "due_date", label: "Due Date", type: "date" },
        ]} />
        <AdminTable columns={[{ key: "title", label: "Title" }, { key: "class_id", label: "Class ID" }, { key: "due_date", label: "Due" }]} rows={db.homework as unknown as Record<string, unknown>[]} />
      </div>
    </AdminShell>
  );
}
