import { PortalLoginForm } from "@/components/auth/portal-login-form";
import { BRAND } from "@/lib/constants";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-primary">{BRAND.name}</h1>
        <p className="text-muted-foreground">Admin Panel</p>
      </div>
      <PortalLoginForm portal="admin" title="Admin Login" description="Enter your admin credentials" />
    </div>
  );
}
