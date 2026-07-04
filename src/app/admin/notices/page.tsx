import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";

export default async function NoticesPage() {
  const db = await readDb();
  const classOpts = db.classes.map((c) => ({ value: c.id, label: c.name }));
  return (
    <AdminShell title="Notices">
      <div className="grid lg:grid-cols-2 gap-8">
        <AdminForm title="Add Notice" collection="notices" fields={[
          { name: "title", label: "Title", required: true },
          { name: "content", label: "Content", type: "textarea", required: true },
          { name: "target_audience", label: "Audience", type: "select", options: [
            { value: "all", label: "Everyone" }, { value: "students", label: "Students" }, { value: "class", label: "Class" },
          ]},
          { name: "class_id", label: "Class", type: "select", options: classOpts },
        ]} extra={{ is_pinned: false, published_at: new Date().toISOString() }} />
        <AdminTable columns={[{ key: "title", label: "Title" }, { key: "target_audience", label: "Audience" }]} rows={db.notices as unknown as Record<string, unknown>[]} />
      </div>
    </AdminShell>
  );
}
