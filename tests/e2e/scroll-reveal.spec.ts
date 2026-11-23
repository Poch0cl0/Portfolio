import { expect, test, type Page } from "@playwright/test";

interface OpacitySample {
  count: number;
  minimum: number;
}

type SampleWindow = Window & { revealSample?: OpacitySample };

const headingSelector = '[data-scroll-reveal="projects-heading"]';

async function trackVisibleOpacity(page: Page, selector = headingSelector) {
  await page.addInitScript((selector) => {
    const samples = { count: 0, minimum: 1 };
    (window as SampleWindow).revealSample = samples;

    function sample() {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < innerHeight) {
          const opacity = Number(getComputedStyle(element).opacity);
          samples.count++;
          samples.minimum = Math.min(samples.minimum, opacity);
        }
      }
      requestAnimationFrame(sample);
    }

    requestAnimationFrame(sample);
  }, selector);
}

async function expectStableWhenVisible(page: Page) {
  const sample = () => page.evaluate(() => (window as SampleWindow).revealSample);
  await expect.poll(async () => (await sample())?.count ?? 0).toBeGreaterThan(35);
  expect((await sample())?.minimum).toBe(1);
}

for (const width of [390, 1440]) {
  test(`projects stay opaque during direct navigation and reload at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    await trackVisibleOpacity(page);
    await page.goto("/es#proyectos-destacados");
    await expectStableWhenVisible(page);
    await page.reload();
    await expectStableWhenVisible(page);
  });
}

test("projects are revealed once before entering the viewport during ordinary scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 850 });
  await page.goto("/es");
  const heading = page.locator(headingSelector);
  await expect(page.locator("header [data-entry]")).toBeAttached();
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const normalPosition = await heading.evaluate((element) => element.getBoundingClientRect().top + scrollY);

  await page.evaluate((top) => window.scrollTo({ top: top - innerHeight - 95, behavior: "instant" }), normalPosition);
  await expect(heading).toHaveAttribute("data-scroll-reveal-active", "true");
  await page.evaluate((top) => window.scrollTo({ top: top - innerHeight / 2, behavior: "instant" }), normalPosition);
  await expect(heading).toBeInViewport();
  await expect(heading).not.toHaveAttribute("data-scroll-reveal-active", "true");

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.evaluate((top) => window.scrollTo({ top: top - innerHeight - 95, behavior: "instant" }), normalPosition);
  await expect(heading).toHaveCSS("animation-name", "none");
  await expect(heading).toHaveCSS("opacity", "1");
});

test("projects stay opaque on Navbar anchor navigation and browser history traversal", async ({ page }) => {
  await trackVisibleOpacity(page);
  await page.goto("/es");
  await page.getByRole("banner").getByRole("link", { name: "Proyectos", exact: true }).click();
  await expect(page).toHaveURL(/#proyectos-destacados$/);
  await expectStableWhenVisible(page);
  await page.goBack();
  await page.evaluate(() => {
    (window as SampleWindow).revealSample!.count = 0;
  });
  await page.goForward();
  await expect(page).toHaveURL(/#proyectos-destacados$/);
  await page.locator(headingSelector).evaluate((element) => {
    element.scrollIntoView({ block: "center", behavior: "instant" });
  });
  await expectStableWhenVisible(page);
});

test("projects render fully with reduced motion or without JavaScript", async ({ baseURL, browser, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await trackVisibleOpacity(page);
  await page.goto("/es#proyectos-destacados");
  await expectStableWhenVisible(page);
  await expect(page.locator(headingSelector)).toHaveCSS("animation-name", "none");

  const fallback = await browser.newContext({ baseURL, javaScriptEnabled: false });
  try {
    const staticPage = await fallback.newPage();
    await staticPage.goto("/es#proyectos-destacados");
    await expect(staticPage.locator(headingSelector)).toHaveCSS("opacity", "1");
    await expect(staticPage.locator(headingSelector)).toHaveCSS("animation-name", "none");
    await expect(staticPage.locator("#obstetricare")).toBeVisible();
  } finally {
    await fallback.close();
  }
});

test("projects stay opaque when reload restores a position without an anchor", async ({ page }) => {
  await trackVisibleOpacity(page);
  await page.goto("/es");
  await page.locator(headingSelector).evaluate((element) => {
    element.scrollIntoView({ block: "center", behavior: "instant" });
  });
  await expectStableWhenVisible(page);
  await page.reload();
  await expect(page).toHaveURL(/\/es$/);
  await expectStableWhenVisible(page);
});

test("technology groups stay opaque through language and theme changes", async ({ page }) => {
  await trackVisibleOpacity(page, '[data-scroll-reveal="stack-grid"]');
  await page.goto("/es#stack");
  await expectStableWhenVisible(page);

  const header = page.getByRole("banner");
  await header.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en#stack$/);
  await expect(page.locator('[data-scroll-reveal="stack-heading"]')).toHaveCSS("animation-name", "none");
  const theme = header.getByRole("switch");
  const checked = await theme.getAttribute("aria-checked");
  await theme.click();
  await expect(theme).toHaveAttribute("aria-checked", checked === "true" ? "false" : "true");

  await page.evaluate(() => { (window as SampleWindow).revealSample!.count = 0; });
  await expectStableWhenVisible(page);
});
