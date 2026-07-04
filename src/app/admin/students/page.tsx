import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";
import { createUser } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function addStudent(formData: FormData) {
  "use server";
  await createUser({
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    full_name: formData.get("full_name") as string,
    role: "student",
    class_id: (formData.get("class_id") as string) || undefined,
    admission_number: (formData.get("admission_number") as string) || undefined,
    parent_name: (formData.get("parent_name") as string) || undefined,
    parent_phone: (formData.get("parent_phone") as string) || undefined,
  });
}

export default async function StudentsPage() {
  const db = await readDb();
  const students = db.users.filter((u) => u.role === "student");
  const rows = students.map((s) => ({
    id: s.id,
    name: s.full_name,
    username: s.username,
    class: db.classes.find((c) => c.id === s.class_id)?.name || "-",
    admission: s.admission_number || "-",
  }));

  return (
    <AdminShell title="Students">
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-sky-100">
          <CardHeader><CardTitle>Add Student</CardTitle></CardHeader>
          <CardContent>
            <form action={addStudent} className="space-y-3">
              <div><Label>Full Name</Label><Input name="full_name" required /></div>
              <div><Label>Username</Label><Input name="username" required /></div>
              <div><Label>Password</Label><Input name="password" type="password" required /></div>
              <div><Label>Admission No</Label><Input name="admission_number" /></div>
              <div><Label>Class</Label>
                <select name="class_id" className="flex h-10 w-full rounded-md border px-3 text-sm">
                  <option value="">Select</option>
                  {db.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><Label>Parent Name</Label><Input name="parent_name" /></div>
              <div><Label>Parent Phone</Label><Input name="parent_phone" /></div>
              <Button type="submit">Create Student</Button>
            </form>
          </CardContent>
        </Card>
        <AdminTable columns={[{ key: "name", label: "Name" }, { key: "username", label: "Username" }, { key: "class", label: "Class" }]} rows={rows} />
      </div>
    </AdminShell>
  );
}
