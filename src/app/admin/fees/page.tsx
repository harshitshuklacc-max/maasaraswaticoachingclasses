import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm, AdminTable } from "@/components/admin/admin-form";
import { readDb } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recordFeePayment } from "@/actions/admin";

async function addFee(formData: FormData) {
  "use server";
  const { createRecord } = await import("@/actions/admin");
  await createRecord("fee_records", {
    student_id: formData.get("student_id"),
    total_fee: Number(formData.get("total_fee")),
    paid_amount: Number(formData.get("paid_amount") || 0),
    academic_year: formData.get("academic_year"),
  });
}

async function addPayment(formData: FormData) {
  "use server";
  await recordFeePayment({
    fee_record_id: formData.get("fee_record_id") as string,
    amount: Number(formData.get("amount")),
    payment_date: formData.get("payment_date") as string,
    payment_method: formData.get("payment_method") as string,
    receipt_number: (formData.get("receipt_number") as string) || undefined,
  });
}

export default async function FeesPage() {
  const db = await readDb();
  const students = db.users.filter((u) => u.role === "student");
  const rows = db.fee_records.map((f) => {
    const s = students.find((u) => u.id === f.student_id);
    return {
      id: f.id,
      student: s?.full_name || "-",
      total: formatCurrency(f.total_fee),
      paid: formatCurrency(f.paid_amount),
      remaining: formatCurrency(f.total_fee - f.paid_amount),
      year: f.academic_year || "-",
    };
  });

  return (
    <AdminShell title="Fee Records">
      <p className="text-sm text-muted-foreground mb-4">Offline fee payments only. No online payment gateway.</p>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-sky-100">
          <CardHeader><CardTitle className="text-base">Create Fee Record</CardTitle></CardHeader>
          <CardContent>
            <form action={addFee} className="space-y-3">
              <div><Label>Student</Label>
                <select name="student_id" required className="flex h-10 w-full rounded-md border px-3 text-sm">
                  {students.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                </select>
              </div>
              <div><Label>Total Fee</Label><Input name="total_fee" type="number" required /></div>
              <div><Label>Initial Paid</Label><Input name="paid_amount" type="number" defaultValue="0" /></div>
              <div><Label>Academic Year</Label><Input name="academic_year" placeholder="2025-26" /></div>
              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="border-sky-100 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Record Offline Payment</CardTitle></CardHeader>
          <CardContent>
            <form action={addPayment} className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Label>Fee Record</Label>
                <select name="fee_record_id" required className="flex h-10 w-full rounded-md border px-3 text-sm">
                  {db.fee_records.map((f) => {
                    const s = students.find((u) => u.id === f.student_id);
                    return <option key={f.id} value={f.id}>{s?.full_name} — Remaining: {formatCurrency(f.total_fee - f.paid_amount)}</option>;
                  })}
                </select>
              </div>
              <div><Label>Amount</Label><Input name="amount" type="number" required /></div>
              <div><Label>Date</Label><Input name="payment_date" type="date" required /></div>
              <div><Label>Method</Label>
                <select name="payment_method" className="flex h-10 w-full rounded-md border px-3 text-sm">
                  <option value="cash">Cash</option><option value="cheque">Cheque</option><option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div><Label>Receipt No</Label><Input name="receipt_number" /></div>
              <Button type="submit" className="sm:col-span-2">Record Payment</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <AdminTable columns={[{ key: "student", label: "Student" }, { key: "total", label: "Total" }, { key: "paid", label: "Paid" }, { key: "remaining", label: "Remaining" }]} rows={rows} />
    </AdminShell>
  );
}
