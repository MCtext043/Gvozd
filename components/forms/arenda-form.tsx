"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitArenda } from "@/services/api";
import { arendaSchema, validateForm } from "@/lib/validation";
import { ApiClientError } from "@/lib/api";

const initial = {
  company_name: "",
  brand: "",
  activity: "",
  area: "",
  contact_name: "",
  position: "",
  phone: "",
  phone_extra: "",
  fax: "",
  email: "",
  website: "",
  assortment: "",
  extra: "",
  website_url: "",
};

export function ArendaForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function setField(name: keyof typeof initial, value: string) {
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
    const result = validateForm(arendaSchema, values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setLoading(true);
    try {
      await submitArenda({ ...result.data, source: "arenda" });
      setSuccess(true);
      setValues(initial);
      setErrors({});
    } catch (err) {
      setServerError(
        err instanceof ApiClientError
          ? err.message
          : "Не удалось отправить заявку. Позвоните администратору центра.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6" role="status">
        <h3 className="text-lg font-semibold text-emerald-900">Заявка на аренду отправлена</h3>
        <p className="mt-2 text-sm text-emerald-800">
          Мы рассмотрим вашу заявку и свяжемся с вами для обсуждения условий.
        </p>
        <Button className="mt-4" variant="outline" onClick={() => setSuccess(false)}>
          Новая заявка
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="absolute -left-[9999px] overflow-hidden" aria-hidden>
        <input
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          value={values.website_url}
          onChange={(e) => setField("website_url", e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          name="company_name"
          label="Юридическое лицо / организация"
          required
          value={values.company_name}
          onChange={(e) => setField("company_name", e.target.value)}
          error={errors.company_name}
        />
        <Input
          name="brand"
          label="Бренд / торговое название"
          value={values.brand}
          onChange={(e) => setField("brand", e.target.value)}
          error={errors.brand}
        />
        <Input
          name="activity"
          label="Вид деятельности"
          required
          value={values.activity}
          onChange={(e) => setField("activity", e.target.value)}
          error={errors.activity}
        />
        <Input
          name="area"
          label="Желаемая площадь, м²"
          required
          value={values.area}
          onChange={(e) => setField("area", e.target.value)}
          error={errors.area}
        />
        <Input
          name="contact_name"
          label="ФИО контактного лица"
          required
          value={values.contact_name}
          onChange={(e) => setField("contact_name", e.target.value)}
          error={errors.contact_name}
        />
        <Input
          name="position"
          label="Должность"
          value={values.position}
          onChange={(e) => setField("position", e.target.value)}
          error={errors.position}
        />
        <Input
          name="phone"
          label="Телефон"
          required
          type="tel"
          value={values.phone}
          onChange={(e) => setField("phone", e.target.value)}
          error={errors.phone}
        />
        <Input
          name="phone_extra"
          label="Доп. телефон"
          type="tel"
          value={values.phone_extra}
          onChange={(e) => setField("phone_extra", e.target.value)}
          error={errors.phone_extra}
        />
        <Input
          name="fax"
          label="Факс"
          value={values.fax}
          onChange={(e) => setField("fax", e.target.value)}
          error={errors.fax}
        />
        <Input
          name="email"
          label="Email"
          required
          type="email"
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          error={errors.email}
        />
        <div className="md:col-span-2">
          <Input
            name="website"
            label="Сайт"
            value={values.website}
            onChange={(e) => setField("website", e.target.value)}
            error={errors.website}
          />
        </div>
      </div>

      <Textarea
        name="assortment"
        label="Ассортимент"
        required
        value={values.assortment}
        onChange={(e) => setField("assortment", e.target.value)}
        error={errors.assortment}
        placeholder="Какие товары или услуги планируете представить"
      />
      <Textarea
        name="extra"
        label="Дополнительная информация"
        value={values.extra}
        onChange={(e) => setField("extra", e.target.value)}
        error={errors.extra}
      />

      {serverError ? (
        <p className="text-sm text-[var(--gvozd-red)]" role="alert">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} size="lg">
        {loading ? "Отправляем…" : "Отправить заявку на аренду"}
      </Button>
    </form>
  );
}
