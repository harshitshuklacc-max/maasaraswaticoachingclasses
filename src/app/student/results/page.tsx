import { PortalShell } from "@/components/portal/portal-shell";
import { requireStudent } from "@/lib/portal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default async function StudentResultsPage() {
  const { user, db } = await requireStudent();
  const results = db.results.filter((r) => r.student_id === user.id);

  return (
    <PortalShell portal="student" title="Results">
      {results.length === 0 ? <p className="text-muted-foreground">No results published yet.</p> : (
        <div className="rounded-md border bg-white border-sky-100 overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Exam</TableHead><TableHead>Subject</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.exam_name}</TableCell>
                  <TableCell>{r.subject || "-"}</TableCell>
                  <TableCell>{r.marks_obtained != null ? `${r.marks_obtained}/${r.max_marks}` : "-"}</TableCell>
                  <TableCell>{r.grade || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PortalShell>
  );
}
