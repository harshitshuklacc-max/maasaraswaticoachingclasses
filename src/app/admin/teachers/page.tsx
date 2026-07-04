import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";
import { createUser } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function addTeacher(formData: FormData) {
  "use server";
  await createUser({
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    full_name: formData.get("full_name") as string,
    role: "teacher",
  });
}

export default async function TeachersPage() {
  const db = await readDb();
  const rows = db.users.filter((u) => u.role === "teacher").map((t) => ({ id: t.id, name: t.full_name, username: t.username }));

  return (
    <AdminShell title="Teachers">
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-sky-100">
          <CardHeader><CardTitle>Add Teacher</CardTitle></CardHeader>
          <CardContent>
            <form action={addTeacher} className="space-y-3">
              <div><Label>Full Name</Label><Input name="full_name" required /></div>
              <div><Label>Username</Label><Input name="username" required /></div>
              <div><Label>Password</Label><Input name="password" type="password" required /></div>
              <Button type="submit">Create Teacher</Button>
            </form>
          </CardContent>
        </Card>
        <AdminTable columns={[{ key: "name", label: "Name" }, { key: "username", label: "Username" }]} rows={rows} />
      </div>
    </AdminShell>
  );
}
