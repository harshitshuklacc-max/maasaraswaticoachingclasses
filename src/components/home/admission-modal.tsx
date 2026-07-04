"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitAdmission } from "@/actions/admin";
import { toast } from "sonner";

const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

export function AdmissionModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await submitAdmission({
      student_name: form.get("student_name") as string,
      parent_name: (form.get("parent_name") as string) || undefined,
      phone: form.get("phone") as string,
      email: (form.get("email") as string) || undefined,
      desired_class: (form.get("desired_class") as string) || undefined,
      message: (form.get("message") as string) || undefined,
    });
    setLoading(false);
    if (result.success) {
      toast.success("Application submitted! We will contact you soon.");
      setOpen(false);
      e.currentTarget.reset();
    } else {
      toast.error(result.error || "Submission failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button size="lg">Apply for Admission</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admission Application Form</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="student_name">Student Name *</Label>
            <Input id="student_name" name="student_name" required placeholder="Full name of student" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent_name">Parent / Guardian Name</Label>
            <Input id="parent_name" name="parent_name" placeholder="Parent full name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="10-digit mobile" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="email@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="desired_class">Desired Class *</Label>
            <select id="desired_class" name="desired_class" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select class</option>
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message / Query</Label>
            <Textarea id="message" name="message" rows={3} placeholder="Any specific questions or requirements..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
