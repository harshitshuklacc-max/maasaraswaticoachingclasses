"use client";

import { useState } from "react";
import Image from "next/image";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import type { LocalGallery } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Images } from "lucide-react";

function categoryLabel(value: string) {
  return GALLERY_CATEGORIES.find((c) => c.value === value)?.label || value;
}

export function GallerySection({ items }: { items: LocalGallery[] }) {
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all" ? items : items.filter((item) => item.category === active);

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <Images className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">Our Campus</span>
          </div>
          <h2 className="text-3xl font-bold text-sky-900 mb-2">Photo Gallery</h2>
          <p className="text-muted-foreground">Explore our building, classrooms, and institute facilities</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              active === "all" ? "bg-primary text-white" : "bg-sky-50 text-sky-900 hover:bg-sky-100"
            )}
          >
            All
          </button>
          {GALLERY_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setActive(c.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                active === c.value ? "bg-primary text-white" : "bg-sky-50 text-sky-900 hover:bg-sky-100"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 bg-sky-50 rounded-xl border border-sky-100">
            {items.length === 0
              ? "Gallery photos will appear here once the admin uploads them."
              : "No photos in this category yet."}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl overflow-hidden border border-sky-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] bg-sky-50">
                  <Image
                    src={item.image_url}
                    alt={item.title || categoryLabel(item.category)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                {(item.title || item.category) && (
                  <div className="p-3 bg-white">
                    {item.title && <p className="font-medium text-sm text-sky-900 truncate">{item.title}</p>}
                    <p className="text-xs text-muted-foreground">{categoryLabel(item.category)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
