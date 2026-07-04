"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createRecord } from "@/actions/admin";
import { toast } from "sonner";

interface Props {
  title: string;
  collection: "study_materials" | "homework" | "assignments" | "notices" | "results";
  teacherId: string;
  classOptions: { value: string; label: string }[];
  fields?: ("max_marks" | "subject" | "exam")[];
}

export function TeacherForm({ title, collection, teacherId, classOptions, fields = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = { teacher_id: teacherId };

    if (collection === "results") {
      data.student_id = form.get("student_id");
      data.exam_name = form.get("exam_name");
      data.subject = form.get("subject");
      data.marks_obtained = Number(form.get("marks_obtained")) || null;
      data.max_marks = Number(form.get("max_marks")) || null;
      data.grade = form.get("grade");
    } else if (collection === "notices") {
      data.title = form.get("title");
      data.content = form.get("content");
      data.target_audience = form.get("target_audience") || "students";
      data.published_at = new Date().toISOString();
      data.is_pinned = false;
    } else {
      data.title = form.get("title");
      data.description = form.get("description") || null;
      data.class_id = form.get("class_id");
      if (collection === "homework" || collection === "assignments") {
        data.due_date = form.get("due_date") || null;
      }
      if (fields.includes("max_marks")) data.max_marks = Number(form.get("max_marks")) || null;
    }

    const result = await createRecord(collection, data);
    setLoading(false);
    if (result.success) { toast.success("Saved"); e.currentTarget.reset(); router.refresh(); }
    else toast.error("Failed");
  }

  return (
    <Card className="border-sky-100">
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          {collection !== "results" && (
            <div><Label>Title</Label><Input name="title" required /></div>
          )}
          {collection === "notices" ? (
            <div><Label>Content</Label><Textarea name="content" required rows={4} /></div>
          ) : collection === "results" ? (
            <>
              <div><Label>Student ID</Label><Input name="student_id" required placeholder="student1" /></div>
              <div><Label>Exam Name</Label><Input name="exam_name" required /></div>
              <div><Label>Subject</Label><Input name="subject" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Marks</Label><Input name="marks_obtained" type="number" /></div>
                <div><Label>Max Marks</Label><Input name="max_marks" type="number" /></div>
              </div>
              <div><Label>Grade</Label><Input name="grade" /></div>
            </>
          ) : (
            <>
              <div><Label>Description</Label><Textarea name="description" rows={3} /></div>
              <div><Label>Class</Label>
                <select name="class_id" required className="flex h-10 w-full rounded-md border px-3 text-sm">
                  <option value="">Select class</option>
                  {classOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {(collection === "homework" || collection === "assignments") && (
                <div><Label>Due Date</Label><Input name="due_date" type="date" /></div>
              )}
              {fields.includes("max_marks") && <div><Label>Max Marks</Label><Input name="max_marks" type="number" /></div>}
            </>
          )}
          {collection === "notices" && (
            <div><Label>Audience</Label>
              <select name="target_audience" className="flex h-10 w-full rounded-md border px-3 text-sm">
                <option value="students">Students</option><option value="all">Everyone</option>
              </select>
            </div>
          )}
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Submit"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
