import { test, expect } from "@playwright/test";

test("home page loads in Spanish", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByText("Stack & Frameworks en Producción")).toBeVisible();
});

test("root redirects to a locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(es|en)$/);
});
