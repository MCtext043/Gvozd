import { describe, expect, it } from "vitest";
import { cn, pluralRu, truncate } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toContain("px-2");
    expect(cn("px-2", false && "hidden", "text-sm")).toContain("text-sm");
  });
});

describe("truncate", () => {
  it("keeps short text", () => {
    expect(truncate("Гвоздь", 20)).toBe("Гвоздь");
  });

  it("cuts long text with ellipsis", () => {
    const result = truncate("Строительный центр Гвоздь в Ижевске на Удмуртской", 20);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(20);
  });
});

describe("pluralRu", () => {
  it("selects correct russian plural forms", () => {
    expect(pluralRu(1, "компания", "компании", "компаний")).toBe("компания");
    expect(pluralRu(2, "компания", "компании", "компаний")).toBe("компании");
    expect(pluralRu(5, "компания", "компании", "компаний")).toBe("компаний");
    expect(pluralRu(21, "компания", "компании", "компаний")).toBe("компания");
  });
});
