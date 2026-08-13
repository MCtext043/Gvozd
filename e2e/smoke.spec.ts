import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("главная открывается", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/Гвозд/i).first()).toBeVisible();
  });

  test("поиск доступен", async ({ page }) => {
    await page.goto("/");
    const search = page.getByRole("combobox", { name: /поиск/i }).first();
    await expect(search).toBeVisible();
    await search.fill("плитка");
    await search.press("Enter");
    await expect(page).toHaveURL(/\/search\?q=/);
  });

  test("форма заявки на главной", async ({ page }) => {
    await page.goto("/");
    const name = page.getByLabel(/^Имя/i).first();
    await name.scrollIntoViewIfNeeded();
    await name.fill("Тест");
    await page.getByLabel(/^Телефон/i).first().fill("+7 900 000-00-00");
    await page.getByRole("button", { name: /отправить заявку/i }).first().click();
    // Успех зависит от API; проверяем, что форма отреагировала (ошибка или успех)
    await expect(
      page.getByText(/заявка отправлена|не удалось отправить|отправляем/i).first(),
    ).toBeVisible({ timeout: 15000 });
  });
});
