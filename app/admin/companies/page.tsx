"use client";

import { AdminEntityList } from "@/components/admin/entity-list";

export default function AdminCompaniesPage() {
  return (
    <AdminEntityList
      title="Компании"
      description="Арендаторы и отделы строительного центра."
      endpoint="/admin/companies"
      publicHref="/companies"
      renderItem={(item) => (
        <div>
          <p className="font-semibold">{String(item.name ?? "")}</p>
          <p className="text-xs text-[var(--gvozd-gray-500)]">
            {item.office_number ? `Офис ${String(item.office_number)} · ` : ""}/
            {String(item.slug ?? "")}
          </p>
        </div>
      )}
    />
  );
}
