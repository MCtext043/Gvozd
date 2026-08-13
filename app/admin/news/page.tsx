"use client";

import { AdminEntityList } from "@/components/admin/entity-list";
import { formatDate } from "@/lib/utils";

export default function AdminNewsPage() {
  return (
    <AdminEntityList
      title="Новости"
      description="Публикации событий и мастер-классов."
      endpoint="/admin/news"
      publicHref="/news"
      renderItem={(item) => (
        <div>
          <p className="font-semibold">{String(item.title ?? "")}</p>
          <p className="text-xs text-[var(--gvozd-gray-500)]">
            {formatDate(item.published_at ? String(item.published_at) : null)} · /
            {String(item.slug ?? "")}
          </p>
        </div>
      )}
    />
  );
}
