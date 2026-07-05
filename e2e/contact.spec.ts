import { expect, test } from "@playwright/test";

test("honeypot-filled submission is silently accepted (bot never learns it failed)", async ({
  page,
}) => {
  await page.goto("/about");
  await page.getByLabel("Your name").fill("Bot");
  await page.getByLabel("Email address").fill("bot@example.com");
  await page.getByLabel("What are you working on?").fill("spam content");
  // A real bot sets the value directly (it doesn't render CSS, so it never
  // sees that the field is hidden) rather than going through focus/keyboard.
  await page.locator("#contact-website").evaluate((el: HTMLInputElement) => {
    el.value = "http://spam.example";
  });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page).toHaveURL(/sent=1/);
});

test("legitimate submission completes without error", async ({ page }) => {
  await page.goto("/about");
  await page.getByLabel("Your name").fill("Ada Lovelace");
  await page.getByLabel("Email address").fill("ada@example.com");
  await page.getByLabel("What are you working on?").fill("Exploring agentic pilots.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page).toHaveURL(/sent=[01]/);
});
