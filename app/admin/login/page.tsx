"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { adminLogin } from "@/services/api";
import { loginSchema, validateForm } from "@/lib/validation";
import { ApiClientError } from "@/lib/api";

export default function AdminLoginPage() {
  const { setToken, token, ready } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && token) router.replace("/admin");
  }, [ready, token, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const result = validateForm(loginSchema, { email, password });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setLoading(true);
    try {
      const tokens = await adminLogin(result.data.email, result.data.password);
      setToken(tokens.access_token);
      router.replace("/admin");
    } catch (err) {
      setServerError(
        err instanceof ApiClientError
          ? err.message
          : "Не удалось войти. Проверьте данные и доступность API.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gvozd-red)]">
          Гвоздь
        </p>
        <h1 className="mt-2 text-2xl font-extrabold">Вход в панель управления</h1>
        <p className="mt-2 text-sm text-[var(--gvozd-gray-500)]">
          Авторизация по JWT. Доступ только для сотрудников центра.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <Input
            name="email"
            type="email"
            label="Email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input
            name="password"
            type="password"
            label="Пароль"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          {serverError ? (
            <p className="text-sm text-[var(--gvozd-red)]" role="alert">
              {serverError}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Входим…" : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
