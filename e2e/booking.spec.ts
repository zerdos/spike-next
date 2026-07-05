import { expect, test } from "@playwright/test";

test("static booking links point to Cal.com from hero, nav, and footer", async ({ page }) => {
  await page.goto("/");
  const links = page.locator('a[href^="https://cal.com/"]');
  expect(await links.count()).toBeGreaterThanOrEqual(3);
});

test("in-chat book_call tool renders a booking card with the prefilled link", async ({ page }) => {
  await page.route("**/api/chat/session", (route) =>
    route.fulfill({ json: { id: "22222222-2222-2222-2222-222222222222", sig: "b".repeat(64) } }),
  );
  await page.route("**/api/chat", (route) => {
    const body = [
      "event: token\n",
      'data: {"text":"Sure, here\'s a link to book."}\n\n',
      'event: tool\ndata: {"name":"book_call","data":{"bookingUrl":"https://cal.com/spike-land/discovery?name=Test"}}\n\n',
      'event: done\ndata: {"usage":{"input":10,"output":5}}\n\n',
    ].join("");
    return route.fulfill({ status: 200, contentType: "text/event-stream", body });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Open chat with Spike, our AI agent" }).click();
  await page.getByRole("textbox", { name: "Message Spike" }).fill("Book me a call");
  await page.keyboard.press("Enter");

  const bookingLink = page.getByRole("link", { name: "Open booking page →" });
  await expect(bookingLink).toBeVisible();
  await expect(bookingLink).toHaveAttribute(
    "href",
    "https://cal.com/spike-land/discovery?name=Test",
  );
});
