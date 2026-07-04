import { readDb } from "@/lib/db";
import { AdmissionsTable } from "@/components/admin/admissions-table";

export default async function AdmissionsPage() {
  const db = await readDb();
  return <AdmissionsTable admissions={db.admissions} />;
}
