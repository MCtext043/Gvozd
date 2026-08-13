"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "@/services/api";
import { contactSchema, leadSchema, validateForm } from "@/lib/validation";
import { ApiClientError } from "@/lib/api";

type Mode = "lead" | "contact";

export function LeadForm({
  mode = "lead",
  source = "website",
  companySlug,
  title = "Оставить заявку",
  submitLabel = "Отправить",
}: {
  mode?: Mode;
  source?: string;
  companySlug?: string;
  title?: string;
  submitLabel?: string;
}) {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    website_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function setField(name: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[name];
      return next;
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    setSuccess(false);

    const schema = mode === "contact" ? contactSchema : leadSchema;
    const result = validateForm(schema, {
      ...values,
      source,
      company_slug: companySlug,
    });

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);
    try {
      await submitLead({
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email || undefined,
        message: result.data.message || undefined,
        source: result.data.source ?? source,
        company_slug: companySlug,
        website_url: values.website_url,
      });
      setSuccess(true);
      setValues({ name: "", phone: "", email: "", message: "", website_url: "" });
      setErrors({});
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Не удалось отправить заявку. Попробуйте позже или позвоните нам.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"
        role="status"
        aria-live="polite"
      >
        <h3 className="text-lg font-semibold text-emerald-900">Заявка отправлена</h3>
        <p className="mt-2 text-sm text-emerald-800">
          Спасибо! Мы свяжемся с вами в ближайшее время.
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setSuccess(false)}
        >
          Отправить ещё
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {title ? (
        <h3 className="text-lg font-semibold text-[var(--gvozd-black)]">{title}</h3>
      ) : null}

      {/* Honeypot */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website_url">Сайт</label>
        <input
          id="website_url"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          value={values.website_url}
          onChange={(e) => setField("website_url", e.target.value)}
        />
      </div>

      <Input
        name="name"
        label="Имя"
        required
        autoComplete="name"
        value={values.name}
        onChange={(e) => setField("name", e.target.value)}
        error={errors.name}
        placeholder="Как к вам обращаться"
      />
      <Input
        name="phone"
        label="Телефон"
        required
        type="tel"
        autoComplete="tel"
        value={values.phone}
        onChange={(e) => setField("phone", e.target.value)}
        error={errors.phone}
        placeholder="+7 (___) ___-__-__"
      />
      <Input
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(e) => setField("email", e.target.value)}
        error={errors.email}
        placeholder="email@example.com"
      />
      <Textarea
        name="message"
        label={mode === "contact" ? "Сообщение" : "Комментарий"}
        required={mode === "contact"}
        value={values.message}
        onChange={(e) => setField("message", e.target.value)}
        error={errors.message}
        placeholder="Чем мы можем помочь?"
      />

      {serverError ? (
        <p className="text-sm text-[var(--gvozd-red)]" role="alert">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Отправляем…" : submitLabel}
      </Button>
    </form>
  );
}
