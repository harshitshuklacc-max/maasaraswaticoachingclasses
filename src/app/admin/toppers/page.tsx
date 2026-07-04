import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";

export default async function ToppersPage() {
  const db = await readDb();
  return (
    <AdminShell title="Toppers">
      <div className="grid lg:grid-cols-2 gap-8">
        <AdminForm title="Add Topper" collection="toppers" fields={[
          { name: "name", label: "Name", required: true },
          { name: "class_name", label: "Class" },
          { name: "percentage", label: "Percentage", type: "number" },
          { name: "exam_name", label: "Exam" },
        ]} />
        <AdminTable columns={[{ key: "name", label: "Name" }, { key: "class_name", label: "Class" }, { key: "percentage", label: "%" }]} rows={db.toppers as unknown as Record<string, unknown>[]} />
      </div>
    </AdminShell>
  );
}
