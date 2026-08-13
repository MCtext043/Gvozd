import { describe, expect, it } from "vitest";
import { leadSchema, validateForm } from "@/lib/validation";

describe("leadSchema / validateForm", () => {
  it("accepts valid lead", () => {
    const result = validateForm(leadSchema, {
      name: "Иван",
      phone: "+7 (3412) 908-546",
      email: "ivan@example.com",
      message: "Нужна консультация по плитке",
      website_url: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short name and empty phone", () => {
    const result = validateForm(leadSchema, {
      name: "И",
      phone: "",
      website_url: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.phone).toBeTruthy();
    }
  });

  it("rejects filled honeypot", () => {
    const result = validateForm(leadSchema, {
      name: "Иван",
      phone: "+7 3412 908546",
      website_url: "http://spam.test",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.website_url).toBeTruthy();
    }
  });
});
