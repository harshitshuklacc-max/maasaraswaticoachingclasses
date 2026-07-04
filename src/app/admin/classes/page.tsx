import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";

export default async function ClassesPage() {
  const db = await readDb();
  return (
    <AdminShell title="Classes">
      <div className="grid lg:grid-cols-2 gap-8">
        <AdminForm title="Add Class" collection="classes" fields={[
          { name: "name", label: "Class Name", required: true, placeholder: "Class 6" },
          { name: "sort_order", label: "Sort Order", type: "number" },
        ]} />
        <AdminTable columns={[{ key: "name", label: "Name" }, { key: "sort_order", label: "Order" }]} rows={db.classes as unknown as Record<string, unknown>[]} />
      </div>
    </AdminShell>
  );
}
