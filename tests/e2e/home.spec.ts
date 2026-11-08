import { test, expect } from "@playwright/test";

test("technology cards filter and flip with keyboard", async ({ page }) => {
  await page.goto("/es");
  const stack = page.locator("#stack");
  await expect(stack.getByRole("button", { name: /^Todos/ })).toHaveCount(0);
  const card = stack.getByRole("button", { name: /^React 19:/ });
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect(card.locator(".technology-card-inner")).toHaveAttribute("data-flipped", "true");
  await expect(card.locator(".technology-card-back")).toContainText("calendario emocional");
  await expect(card.locator(".technology-card-back")).toContainText("gestión de pacientes");
  await page.keyboard.press("Space");
  await expect(card).toHaveAttribute("aria-pressed", "false");
  await stack.getByRole("button", { name: /^Backend/ }).click();
  await expect(stack.getByRole("button", { name: /^FastAPI:/ })).toBeVisible();
  await expect(stack.getByRole("button", { name: /^React 19:/ })).toHaveCount(0);
});

test("technology brand logos load locally", async ({ page }) => {
  await page.goto("/es");
  const stack = page.locator("#stack");
  for (const [tab, name, slug] of [
    ["Frontend", "TypeScript", "typescript"],
    ["Frontend", "Tailwind CSS", "tailwindcss"],
    ["Frontend", "Tailwind CSS 4", "tailwindcss"],
    ["Bases de datos", "PostgreSQL", "postgresql"],
    ["Bases de datos", "PostgreSQL 16", "postgresql"],
    ["Infra/DevOps", "YouTube API", "youtube"],
  ]) {
    await stack.getByRole("button", { name: new RegExp(`^${tab}`) }).click();
    const card = stack.getByRole("button", { name: new RegExp(`^${name}:`) });
    await card.scrollIntoViewIfNeeded();
    const logo = card.locator(`img[src$="/icons/technologies/${slug}.svg"]`);
    await expect(logo).toBeVisible();
    await expect.poll(() => logo.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
});

test("failed technology logos keep a styled fallback", async ({ page }) => {
  await page.route("**/icons/technologies/*.svg", (route) => route.abort());
  await page.goto("/es");
  const stack = page.locator("#stack");
  for (const [tab, name, icon] of [
    ["Frontend", "Tailwind CSS", "palette"],
    ["Bases de datos", "PostgreSQL", "database"],
  ]) {
    await stack.getByRole("button", { name: new RegExp(`^${tab}`) }).click();
    const card = stack.getByRole("button", { name: new RegExp(`^${name}:`) });
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator(`.technology-card-face svg.lucide-${icon}`)).toBeVisible();
    await expect(card.locator("img")).toHaveCount(0);
    await card.click();
    await expect(card).toHaveAttribute("aria-pressed", "true");
  }
});

for (const width of [375, 768, 1440]) {
  test(`profile image and description share width at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/es");
    const hero = page.locator("#sobre-mi");
    const image = await hero.getByRole("img").first().boundingBox();
    const description = await hero.getByText("Estudiante de Ingeniería de Sistemas", { exact: false }).boundingBox();
    expect(image).not.toBeNull();
    expect(description).not.toBeNull();
    expect(Math.abs(image!.width - description!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(image!.x - description!.x)).toBeLessThanOrEqual(1);
  });
}

test("home page presents Jefferson in Spanish", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByRole("heading", { name: "Jefferson Peña" })).toBeVisible();
});

test("root redirects to a locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(es|en)$/);
});
