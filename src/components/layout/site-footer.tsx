import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { BRAND, FOOTER } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t bg-sky-900 text-white">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-bold text-sky-300 mb-2">{BRAND.name}</h3>
          <p className="text-sm text-white/80">{BRAND.address}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sky-300 mb-2">Quick Links</h4>
          <ul className="text-sm text-white/80 space-y-1">
            <li><a href="#courses" className="hover:text-sky-300">Courses</a></li>
            <li><a href="#gallery" className="hover:text-sky-300">Gallery</a></li>
            <li><a href="#notices" className="hover:text-sky-300">Notices</a></li>
            <li><Link href="/student/login" className="hover:text-sky-300">Student Portal</Link></li>
            <li><Link href="/teacher/login" className="hover:text-sky-300">Teacher Portal</Link></li>
            <li><Link href="/admin/login" className="hover:text-sky-300">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sky-300 mb-2">Contact</h4>
          <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-sky-300">
            <Phone className="h-4 w-4" />{BRAND.phone}
          </a>
          <p className="flex items-start gap-2 text-sm text-white/80 mt-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />{BRAND.city}, {BRAND.state}
          </p>
        </div>
      </div>
      <div className="border-t border-white/20 py-4 text-center text-sm text-white/60">
        <p>Made by <a href={`tel:${FOOTER.developerPhone}`} className="text-sky-300 hover:underline">{FOOTER.developer}</a> · {FOOTER.developerPhone}</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} {BRAND.name}</p>
      </div>
    </footer>
  );
}
