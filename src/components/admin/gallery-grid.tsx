"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { deleteGalleryPhoto } from "@/actions/admin";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import type { LocalGallery } from "@/lib/db";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

function categoryLabel(value: string) {
  return GALLERY_CATEGORIES.find((c) => c.value === value)?.label || value;
}

export function GalleryGrid({ items }: { items: LocalGallery[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this photo from the gallery?")) return;
    setDeleting(id);
    const result = await deleteGalleryPhoto(id);
    setDeleting(null);
    if (result.success) {
      toast.success("Photo deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete photo");
    }
  }

  if (!items.length) {
    return (
      <p className="text-muted-foreground text-sm py-8 text-center border rounded-md bg-white border-sky-100">
        No photos yet. Upload building and institute photos above.
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border border-sky-100 bg-white overflow-hidden shadow-sm">
          <div className="relative aspect-[4/3] bg-sky-50">
            <Image
              src={item.image_url}
              alt={item.title || categoryLabel(item.category)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="p-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{item.title || "Untitled"}</p>
              <p className="text-xs text-muted-foreground">{categoryLabel(item.category)}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive"
              disabled={deleting === item.id}
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
