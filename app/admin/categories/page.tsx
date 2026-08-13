"use client";

import { AdminEntityList } from "@/components/admin/entity-list";

export default function AdminCategoriesPage() {
  return (
    <AdminEntityList
      title="Категории"
      description="Корневые и дочерние категории каталога (13 направлений)."
      endpoint="/admin/categories"
      publicHref="/catalog"
      renderItem={(item) => (
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold">{String(item.name ?? "")}</p>
          <p className="text-xs text-[var(--gvozd-gray-500)]">/{String(item.slug ?? "")}</p>
        </div>
      )}
    />
  );
}
