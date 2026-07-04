import { AdminShell } from "@/components/admin/admin-shell";
import { GalleryUploadForm } from "@/components/admin/gallery-upload-form";
import { GalleryGrid } from "@/components/admin/gallery-grid";
import { readDb } from "@/lib/db";

export default async function GalleryAdminPage() {
  const db = await readDb();

  return (
    <AdminShell title="Gallery">
      <div className="space-y-8">
        <GalleryUploadForm />
        <div>
          <h2 className="text-lg font-semibold text-sky-900 mb-4">Uploaded Photos ({db.gallery.length})</h2>
          <GalleryGrid items={db.gallery} />
        </div>
      </div>
    </AdminShell>
  );
}
