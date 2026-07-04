import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";

export default async function FaqsPage() {
  const db = await readDb();
  return (
    <AdminShell title="FAQs">
      <div className="grid lg:grid-cols-2 gap-8">
        <AdminForm title="Add FAQ" collection="faqs" fields={[
          { name: "question", label: "Question", required: true },
          { name: "answer", label: "Answer", type: "textarea", required: true },
        ]} />
        <AdminTable columns={[{ key: "question", label: "Question" }]} rows={db.faqs as unknown as Record<string, unknown>[]} />
      </div>
    </AdminShell>
  );
}
