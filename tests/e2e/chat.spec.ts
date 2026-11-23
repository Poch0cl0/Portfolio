import { expect, test } from "@playwright/test";

test("JeffBot follows new messages while preserving a reader's history position", async ({ page }) => {
  let requests = 0;
  let releaseReply: (() => void) | undefined;
  await page.route("**/api/chat", async (route) => {
    const replyNumber = ++requests;
    await new Promise<void>((resolve) => { releaseReply = resolve; });
    const reply = Array.from({ length: 12 }, (_, index) => `Reply ${replyNumber}, line ${index}`).join("\n");
    await route.fulfill({ json: { ok: true, reply } });
  });

  await page.goto("/es");
  const chat = page.getByRole("region", { name: "JeffBot" });
  const log = chat.getByRole("log");
  const field = chat.getByRole("textbox");
  const status = chat.getByRole("status");
  const distanceFromEnd = () => log.evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop);

  await chat.getByRole("button", { name: /tecnolog/ }).click();
  await expect(status).toContainText("escribiendo");
  await field.fill("Segunda pregunta");
  await field.press("Enter");
  await expect.poll(() => requests).toBe(1);
  releaseReply?.();

  await expect(log.getByText("Reply 1, line 11")).toBeAttached();
  await expect(field).toHaveValue("Segunda pregunta");
  await expect.poll(distanceFromEnd).toBeLessThan(3);
  const initialPageY = await page.evaluate(() => scrollY);

  await field.press("Enter");
  await expect.poll(() => requests).toBe(2);
  await expect.poll(distanceFromEnd).toBeLessThan(3);
  await log.evaluate((element) => { element.scrollTop = 0; });
  await expect.poll(() => log.evaluate((element) => element.scrollTop)).toBeLessThan(2);
  releaseReply?.();

  await expect(log.getByText("Reply 2, line 11")).toBeAttached();
  await expect.poll(() => log.evaluate((element) => element.scrollTop)).toBeLessThan(2);
  expect(await page.evaluate(() => scrollY)).toBe(initialPageY);
  await expect(status).toContainText("Reply 2, line 11");
});

test("JeffBot preserves a failed draft and restores the conversation across locales", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/chat", (route) => route.fulfill({ json: { ok: true, reply: "First reply" } }));
  await page.goto("/es");

  const chat = page.getByRole("region", { name: "JeffBot" });
  const log = chat.getByRole("log");
  const field = chat.getByRole("textbox");
  await field.fill("Primera pregunta");
  await field.press("Enter");
  await expect(log.getByText("First reply")).toBeVisible();
  await expect(log.locator("[data-enter]").last()).toHaveCSS("animation-name", "none");

  await page.route("**/api/chat", (route) => route.abort("failed"));
  await field.fill("Reintentar consulta");
  await field.press("Enter");
  await expect(chat.getByRole("alert")).toBeVisible();
  await expect(chat.getByRole("status")).toBeEmpty();
  await expect(field).toHaveValue("Reintentar consulta");
  await expect(log.getByText("Reintentar consulta")).toHaveCount(0);

  const header = page.getByRole("banner");
  await header.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(chat.getByText("Portfolio assistant")).toBeVisible();
  await expect(field).toHaveValue("Reintentar consulta");
  await expect(log.getByText("First reply")).toBeVisible();
  await expect(log.locator("[data-enter]")).toHaveCount(0);
  await expect.poll(() => chat.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);

  const theme = header.getByRole("switch");
  const checked = await theme.getAttribute("aria-checked");
  await theme.click();
  await expect(theme).toHaveAttribute("aria-checked", checked === "true" ? "false" : "true");
  await expect(field).toHaveValue("Reintentar consulta");
});
