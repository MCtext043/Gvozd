"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { PopupConfig } from "@/types";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "gvozd_popup_seen_v1";

export function SitePopup({ popup }: { popup: PopupConfig | null }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!popup) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === String(popup.id)) return;
    } catch {
      /* ignore */
    }

    const delay = popup.delay_ms ?? 2500;
    const timer = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timer);
  }, [popup]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    if (popup) {
      try {
        localStorage.setItem(STORAGE_KEY, String(popup.id));
      } catch {
        /* ignore */
      }
    }
  }

  if (!popup || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-popup-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-[var(--gvozd-graphite)] shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]"
          aria-label="Закрыть уведомление"
        >
          <X className="h-4 w-4" />
        </button>

        {popup.image_url ? (
          <div className="relative h-44 w-full bg-[var(--gvozd-gray-100)]">
            <Image src={popup.image_url} alt="" fill className="object-cover" sizes="512px" />
          </div>
        ) : null}

        <div className="p-6">
          <h2 id="site-popup-title" className="text-xl font-bold text-[var(--gvozd-black)]">
            {popup.title}
          </h2>
          {popup.content ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--gvozd-gray-500)]">
              {popup.content}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            {popup.button_url ? (
              <Link
                href={popup.button_url}
                onClick={close}
                className="inline-flex h-11 items-center rounded-md bg-[var(--gvozd-red)] px-5 text-sm font-semibold text-white hover:bg-[var(--gvozd-red-dark)]"
              >
                {popup.button_text || "Подробнее"}
              </Link>
            ) : null}
            <Button variant="ghost" onClick={close}>
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
