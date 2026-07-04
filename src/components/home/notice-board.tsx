import { Card, CardContent } from "@/components/ui/card";
import type { LocalNotice } from "@/lib/db";
import { Bell, Pin } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NoticeBoard({ notices }: { notices: LocalNotice[] }) {
  const publicNotices = notices
    .filter((n) => n.target_audience === "all")
    .sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

  return (
    <section id="notices" className="py-16 bg-sky-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <Bell className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">Updates</span>
          </div>
          <h2 className="text-3xl font-bold text-sky-900 mb-2">Notice Board</h2>
          <p className="text-muted-foreground">Latest announcements from the institute</p>
        </div>

        {publicNotices.length === 0 ? (
          <p className="text-center text-muted-foreground py-10 bg-white rounded-xl border border-sky-100">
            No notices at the moment. Check back soon.
          </p>
        ) : (
          <div className="space-y-4">
            {publicNotices.map((notice) => (
              <Card key={notice.id} className="border-sky-100">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-sky-900 flex items-center gap-2">
                      {notice.is_pinned && <Pin className="h-4 w-4 text-primary shrink-0" />}
                      {notice.title}
                    </h3>
                    <span className="text-xs text-muted-foreground shrink-0">{formatDate(notice.published_at)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{notice.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
