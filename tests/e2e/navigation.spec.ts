import { expect, test } from "@playwright/test";

test("mobile navigation returns keyboard focus when it closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");

  const header = page.getByRole("banner");
  const menu = header.getByRole("button", { name: /Abrir/ });
  await menu.focus();
  await page.keyboard.press("Enter");
  const projects = header.getByRole("link", { name: "Proyectos", exact: true });
  await projects.focus();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();

  await page.keyboard.press("Enter");
  await projects.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#proyectos-destacados$/);
  await expect(menu).toBeFocused();
});

test("system theme is applied before hydration and follows browser changes", async ({ baseURL, context, page }) => {
  if (!baseURL) throw new Error("A base URL is required");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await context.addCookies([{ name: "theme", value: "system", url: baseURL }]);

  await page.route("**/_next/**/*.js*", (route) => route.abort());
  await page.goto("/es");
  const root = page.locator("html");
  await expect(root).toHaveClass(/\blight\b/);
  await page.unroute("**/_next/**/*.js*");

  await page.reload();
  const theme = page.getByRole("banner").getByRole("switch");
  await expect(theme).toHaveAttribute("aria-checked", "false");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(root).toHaveClass(/\bdark\b/);
  await expect(theme).toHaveAttribute("aria-checked", "true");

  await theme.focus();
  await page.keyboard.press("Space");
  await expect(root).toHaveClass(/\blight\b/);
  await page.reload();
  await expect(theme).toHaveAttribute("aria-checked", "false");
  expect(errors).toEqual([]);
});

test("keyboard locale changes preserve the anchored section, focus, theme, and URL parameters", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/es?source=keyboard");
  const header = page.getByRole("banner");
  const theme = header.getByRole("switch");
  await theme.click();
  await expect(theme).toHaveAttribute("aria-checked", "false");
  await header.getByRole("link", { name: "Proyectos", exact: true }).click();
  await expect(page).toHaveURL(/\/es\?source=keyboard#proyectos-destacados$/);

  const projects = page.locator("#proyectos-destacados");
  await expect.poll(() => projects.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(96);
  const top = () => projects.evaluate((element) => Math.round(element.getBoundingClientRect().top));
  const previousTop = await top();
  const en = header.getByRole("button", { name: "EN", exact: true });
  const es = header.getByRole("button", { name: "ES", exact: true });

  await en.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\?source=keyboard#proyectos-destacados$/);
  await expect(en).toBeFocused();
  await expect(en).toHaveCSS("outline-style", "solid");
  await expect.poll(async () => Math.abs(await top() - previousTop)).toBeLessThanOrEqual(2);
  await expect(theme).toHaveAttribute("aria-checked", "false");

  await page.keyboard.press("Shift+Tab");
  await expect(es).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page).toHaveURL(/\/es\?source=keyboard#proyectos-destacados$/);
  await expect(es).toBeFocused();
  await expect.poll(async () => Math.abs(await top() - previousTop)).toBeLessThanOrEqual(2);
  expect(errors).toEqual([]);
});

test("mobile locale navigation works with storage blocked and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() { throw new DOMException("Storage blocked", "SecurityError"); },
    });
  });

  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/es");
  const header = page.getByRole("banner");
  const es = header.getByRole("button", { name: "ES", exact: true });
  const en = header.getByRole("button", { name: "EN", exact: true });
  await en.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en$/);
  await expect(en).toBeFocused();
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");

  const projects = page.locator("#proyectos-destacados");
  await projects.evaluate((element) => element.scrollIntoView({ behavior: "instant" }));
  const position = () => projects.evaluate((element) => Math.round(element.getBoundingClientRect().top));
  const previousTop = await position();
  await es.click();
  await expect(page).toHaveURL(/\/es$/);
  await expect(es).toHaveAttribute("aria-pressed", "true");
  await expect(es).not.toBeFocused();
  await expect.poll(async () => Math.abs(await position() - previousTop)).toBeLessThanOrEqual(2);

  await page.goBack();
  await expect(page).toHaveURL(/\/en$/);
  await expect(en).toHaveAttribute("aria-pressed", "true");
  await page.goForward();
  await expect(page).toHaveURL(/\/es$/);
  await expect(es).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});
