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

interface Field {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export function AdminForm({ title, collection, fields, extra }: { title: string; collection: string; fields: Field[]; extra?: Record<string, unknown> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = { ...extra };
    for (const f of fields) {
      const val = form.get(f.name);
      if (val !== null && val !== "") data[f.name] = f.type === "number" ? Number(val) : val;
    }
    const result = await createRecord(collection as never, data);
    setLoading(false);
    if (result.success) { toast.success("Saved"); e.currentTarget.reset(); router.refresh(); }
    else toast.error("Failed to save");
  }

  return (
    <Card className="border-sky-100">
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1">
              <Label htmlFor={f.name}>{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea id={f.name} name={f.name} required={f.required} placeholder={f.placeholder} />
              ) : f.type === "select" ? (
                <select id={f.name} name={f.name} required={f.required} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select...</option>
                  {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <Input id={f.name} name={f.name} type={f.type || "text"} required={f.required} placeholder={f.placeholder} />
              )}
            </div>
          ))}
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function AdminTable({ columns, rows }: { columns: { key: string; label: string }[]; rows: Record<string, unknown>[] }) {
  if (!rows.length) return <p className="text-muted-foreground text-sm py-6 text-center">No records yet.</p>;
  return (
    <div className="rounded-md border bg-white overflow-x-auto border-sky-100">
      <table className="w-full text-sm">
        <thead><tr className="border-b bg-sky-50">{columns.map((c) => <th key={c.key} className="px-4 py-3 text-left font-medium text-sky-900">{c.label}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => (
          <tr key={String(row.id || i)} className="border-b hover:bg-sky-50/50">
            {columns.map((c) => <td key={c.key} className="px-4 py-3">{String(row[c.key] ?? "-")}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
