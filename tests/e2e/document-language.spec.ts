import { expect, test } from "@playwright/test";

const localizations = [
  { locale: "es", other: "en", heading: /^Transformo ideas/, theme: "light" },
  { locale: "en", other: "es", heading: /^I turn ideas/, theme: "dark" },
] as const;

for (const { locale, other, heading, theme } of localizations) {
  test(`/${locale} delivers its language in the HTTP response and works without JavaScript`, async ({ baseURL, browser, request }) => {
    const route = `/${locale}?source=server-language`;
    const response = await request.get(route, {
      headers: { "accept-language": other, "x-portfolio-locale": other },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toMatch(new RegExp(`<html\\b[^>]*\\blang="${locale}"`));
    expect(html.match(/<html\b/g)).toHaveLength(1);
    expect(html.match(/<body\b/g)).toHaveLength(1);

    const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
    try {
      if (!baseURL) throw new Error("A base URL is required");
      await context.addCookies([{ name: "theme", value: theme, url: baseURL }]);
      const page = await context.newPage();
      await page.goto(`${route}#sobre-mi`);
      const root = page.locator("html");
      await expect(root).toHaveAttribute("lang", locale);
      await expect(root).toHaveClass(new RegExp(`\\b${theme}\\b`));
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await page.reload();
      await expect(root).toHaveAttribute("lang", locale);
      await expect(page).toHaveURL(new RegExp(`/${locale}\\?source=server-language#sobre-mi$`));
    } finally {
      await context.close();
    }
  });
}

test("soft locale navigation updates the document language without reloading or hydration errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat|server rendered/i.test(message.text())) {
      errors.push(message.text());
    }
  });

  await page.goto("/en?source=language#stack");
  const root = page.locator("html");
  const header = page.getByRole("banner");
  await expect(root).toHaveAttribute("lang", "en");
  await page.evaluate(() => { document.documentElement.dataset.localeDocument = "original"; });

  for (const locale of ["es", "en"]) {
    const button = header.getByRole("button", { name: locale.toUpperCase(), exact: true });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/${locale}\\?source=language#stack$`));
    await expect(root).toHaveAttribute("lang", locale);
    await expect(root).toHaveAttribute("data-locale-document", "original");
    await expect(button).toBeFocused();
  }
  expect(errors).toEqual([]);
});
