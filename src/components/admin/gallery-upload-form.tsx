"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadGalleryPhoto } from "@/actions/admin";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";

export function GalleryUploadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await uploadGalleryPhoto(formData);
    setLoading(false);
    if (result.success) {
      toast.success("Photo uploaded");
      e.currentTarget.reset();
      router.refresh();
    } else {
      toast.error(result.error || "Upload failed");
    }
  }

  return (
    <Card className="border-sky-100">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ImagePlus className="h-5 w-5 text-primary" />
          Upload Institute Photo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="title">Title (optional)</Label>
            <Input id="title" name="title" placeholder="e.g. Main building entrance" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="photo">Photo</Label>
            <Input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required />
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP or GIF · Max 5MB</p>
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload Photo"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
