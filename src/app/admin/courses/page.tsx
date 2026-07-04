import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";

export default async function CoursesPage() {
  const db = await readDb();
  return (
    <AdminShell title="Courses">
      <div className="grid lg:grid-cols-2 gap-8">
        <AdminForm title="Add Course" collection="courses" fields={[
          { name: "title", label: "Title", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "duration", label: "Duration", placeholder: "1 Year" },
          { name: "faculty", label: "Faculty" },
        ]} />
        <AdminTable columns={[{ key: "title", label: "Title" }, { key: "duration", label: "Duration" }]} rows={db.courses as unknown as Record<string, unknown>[]} />
      </div>
    </AdminShell>
  );
}
