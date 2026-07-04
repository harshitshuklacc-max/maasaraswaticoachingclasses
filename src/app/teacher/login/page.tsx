import { PortalLoginForm } from "@/components/auth/portal-login-form";
import { BRAND } from "@/lib/constants";

export default function TeacherLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 p-4">
      <h1 className="text-2xl font-bold text-primary mb-1">{BRAND.name}</h1>
      <p className="text-muted-foreground mb-6">Teacher Portal</p>
      <PortalLoginForm portal="teacher" title="Teacher Login" description="Demo: teacher1 / teacher123" />
    </div>
  );
}
