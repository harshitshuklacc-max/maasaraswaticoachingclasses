import { PortalShell } from "@/components/portal/portal-shell";
import { requireStudent } from "@/lib/portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function StudentFeesPage() {
  const { user, db } = await requireStudent();
  const records = db.fee_records.filter((f) => f.student_id === user.id);

  return (
    <PortalShell portal="student" title="Fee Details">
      <p className="text-sm text-muted-foreground mb-6">View only. Pay fees at the institute office — no online payment available.</p>
      {records.length === 0 ? <p className="text-muted-foreground">No fee records found.</p> : records.map((record) => {
        const remaining = record.total_fee - record.paid_amount;
        const payments = db.fee_payments.filter((p) => p.fee_record_id === record.id);
        return (
          <Card key={record.id} className="border-sky-100 mb-6">
            <CardHeader><CardTitle>Academic Year: {record.academic_year || "N/A"}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-sky-50"><p className="text-sm text-muted-foreground">Total</p><p className="text-xl font-bold">{formatCurrency(record.total_fee)}</p></div>
                <div className="p-4 rounded-lg bg-green-50"><p className="text-sm text-muted-foreground">Paid</p><p className="text-xl font-bold text-green-700">{formatCurrency(record.paid_amount)}</p></div>
                <div className="p-4 rounded-lg bg-orange-50"><p className="text-sm text-muted-foreground">Remaining</p><p className="text-xl font-bold text-orange-700">{formatCurrency(remaining)}</p></div>
              </div>
              <h3 className="font-semibold mb-2">Payment History</h3>
              {payments.length === 0 ? <p className="text-sm text-muted-foreground">No payments recorded.</p> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Receipt</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{formatDate(p.payment_date)}</TableCell>
                        <TableCell>{formatCurrency(p.amount)}</TableCell>
                        <TableCell className="capitalize">{p.payment_method}</TableCell>
                        <TableCell>{p.receipt_number || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        );
      })}
    </PortalShell>
  );
}
