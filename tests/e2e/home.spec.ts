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

for (const width of [320, 768, 1440]) {
  test(`hero places the original portrait and JeffBot at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/es");

    const intro = page.locator("#sobre-mi");
    const sidebar = page.getByRole("complementary").filter({ has: page.getByRole("heading", { name: "JeffBot" }) });
    const image = sidebar.getByRole("img");
    const chat = sidebar.getByRole("region", { name: "JeffBot" });

    await expect(image).toHaveAttribute("src", /jefferson-hero\.webp/);
    await expect.poll(() => image.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const portrait = (await image.boundingBox())!;
    const text = (await intro.boundingBox())!;
    const assistant = (await chat.boundingBox())!;

    expect(Math.abs(portrait.width / portrait.height - 686 / 555)).toBeLessThan(0.02);
    expect(assistant.y).toBeGreaterThan(portrait.y + portrait.height);
    if (width >= 1024) {
      expect(portrait.x).toBeGreaterThan(text.x + text.width);
    } else {
      expect(portrait.y).toBeGreaterThan(text.y + text.height);
    }
  });
}

test("home page presents Jefferson in Spanish", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByRole("heading", { name: "Transformo ideas en software que genera impacto." })).toBeVisible();
});

test("root redirects to a locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(es|en)$/);
});

test("switching languages preserves the selected technology category and flipped cards", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/es#stack");
  const stack = page.locator("#stack");
  const backend = stack.getByRole("button", { name: /^Backend/ });
  await backend.click();

  const fastApi = stack.getByRole("button", { name: /^FastAPI:/ });
  const python = stack.getByRole("button", { name: /^Python 3\.12:/ });
  await fastApi.click();
  await python.click();

  await page.evaluate(() => { document.documentElement.dataset.localeTest = "same-document"; });

  const header = page.getByRole("banner");
  await header.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en#stack$/);
  await expect(page.locator("html")).toHaveAttribute("data-locale-test", "same-document");
  await expect(backend).toHaveAttribute("aria-pressed", "true");
  await expect(fastApi).toHaveAttribute("aria-pressed", "true");
  await expect(python).toHaveAttribute("aria-pressed", "true");
  await expect(fastApi).toHaveAccessibleName(/Back to technology/);

  await fastApi.click();
  await header.getByRole("button", { name: "ES", exact: true }).click();
  await expect(page).toHaveURL(/\/es#stack$/);
  await expect(backend).toHaveAttribute("aria-pressed", "true");
  await expect(fastApi).toHaveAttribute("aria-pressed", "false");
  await expect(python).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});
