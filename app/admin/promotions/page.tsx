"use client";

import { AdminEntityList } from "@/components/admin/entity-list";
import { formatDate } from "@/lib/utils";

export default function AdminPromotionsPage() {
  return (
    <AdminEntityList
      title="Акции"
      description="Акции и спецпредложения центра."
      endpoint="/admin/promotions"
      publicHref="/promotions"
      renderItem={(item) => (
        <div>
          <p className="font-semibold">{String(item.title ?? "")}</p>
          <p className="text-xs text-[var(--gvozd-gray-500)]">
            /{String(item.slug ?? "")}
            {item.ends_at ? ` · до ${formatDate(String(item.ends_at))}` : ""}
          </p>
        </div>
      )}
    />
  );
}
