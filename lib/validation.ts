import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя (минимум 2 символа)")
    .max(100, "Имя слишком длинное"),
  phone: z
    .string()
    .trim()
    .min(10, "Укажите телефон")
    .max(30, "Телефон слишком длинный")
    .regex(/^[\d\s+\-()]+$/, "Некорректный формат телефона"),
  email: z
    .string()
    .trim()
    .email("Некорректный email")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Сообщение слишком короткое")
    .max(2000, "Сообщение слишком длинное")
    .optional()
    .or(z.literal("")),
  source: z.string().optional(),
  company_slug: z.string().optional(),
  /** Honeypot — должно оставаться пустым */
  website_url: z.string().max(0, "Обнаружена подозрительная активность").optional().or(z.literal("")),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export const contactSchema = leadSchema.extend({
  message: z
    .string()
    .trim()
    .min(5, "Напишите сообщение")
    .max(2000, "Сообщение слишком длинное"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const arendaSchema = z.object({
  company_name: z.string().trim().min(2, "Укажите название организации"),
  brand: z.string().trim().optional().or(z.literal("")),
  activity: z.string().trim().min(2, "Укажите вид деятельности"),
  area: z.string().trim().min(1, "Укажите желаемую площадь"),
  contact_name: z.string().trim().min(2, "Укажите ФИО"),
  position: z.string().trim().optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(10, "Укажите телефон")
    .regex(/^[\d\s+\-()]+$/, "Некорректный формат телефона"),
  phone_extra: z.string().trim().optional().or(z.literal("")),
  fax: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Некорректный email"),
  website: z.string().trim().optional().or(z.literal("")),
  assortment: z.string().trim().min(5, "Опишите ассортимент"),
  extra: z.string().trim().optional().or(z.literal("")),
  website_url: z.string().max(0).optional().or(z.literal("")),
});

export type ArendaFormValues = z.infer<typeof arendaSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Введите корректный email"),
  password: z.string().min(4, "Введите пароль"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function validateForm<T>(
  schema: z.ZodType<T>,
  values: unknown,
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(values);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path.join(".") || "_form";
    if (!errors[key]) errors[key] = issue.message;
  });
  return { success: false, errors };
}
