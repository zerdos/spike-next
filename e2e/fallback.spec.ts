import { expect, test } from "@playwright/test";

test("chat kill switch / API failure falls back to a contact form", async ({ page }) => {
  await page.route("**/api/chat/session", (route) =>
    route.fulfill({ status: 503, json: { error: "chat_disabled", fallback: "contact_form" } }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat with Spike, our AI agent" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Message Spike" })).toHaveCount(0);
});

test("marketing page renders fully with JavaScript disabled (NFR-1.10)", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  for (const heading of [
    "What we do",
    "Proof, not decks",
    "The method: BAZDMEG",
    "How we engage",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
  await context.close();
});
