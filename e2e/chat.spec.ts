import { expect, type Page, test } from "@playwright/test";

async function mockChatEndpoints(page: Page, extraSseEvents = "") {
  await page.route("**/api/chat/session", (route) =>
    route.fulfill({ json: { id: "11111111-1111-1111-1111-111111111111", sig: "a".repeat(64) } }),
  );
  await page.route("**/api/chat", (route) => {
    const body = [
      'event: token\ndata: {"text":"Thanks for reaching out — "}\n\n',
      'event: token\ndata: {"text":"here is how we can help."}\n\n',
      extraSseEvents,
      'event: done\ndata: {"usage":{"input":42,"output":18}}\n\n',
    ].join("");
    return route.fulfill({ status: 200, contentType: "text/event-stream", body });
  });
}

test("hero CTA opens the chat panel and streams a mocked reply", async ({ page }) => {
  await mockChatEndpoints(page);
  await page.goto("/");
  await page.getByRole("link", { name: "Talk to our agent" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("textbox", { name: "Message Spike" }).fill("What do you offer?");
  await page.keyboard.press("Enter");

  await expect(page.getByRole("log")).toContainText("Thanks for reaching out");
});

test("floating launcher opens the chat panel from any page", async ({ page }) => {
  await mockChatEndpoints(page);
  await page.goto("/method");
  await page.getByRole("button", { name: "Open chat with Spike, our AI agent" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Hi, I'm Spike")).toBeVisible();
});

test("Escape closes the panel", async ({ page }) => {
  await mockChatEndpoints(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat with Spike, our AI agent" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("chat is a full-screen sheet on mobile viewports", async ({ page }) => {
  await mockChatEndpoints(page);
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat with Spike, our AI agent" }).click();
  const box = await page.getByRole("dialog").boundingBox();
  expect(box?.width).toBe(375);
  expect(box?.height).toBe(700);
});

test("lead capture tool event renders a confirmation card", async ({ page }) => {
  await mockChatEndpoints(
    page,
    'event: tool\ndata: {"name":"capture_lead","data":{"leadCaptured":true}}\n\n',
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat with Spike, our AI agent" }).click();
  await page.getByRole("textbox", { name: "Message Spike" }).fill("Yes, please save my details.");
  await page.keyboard.press("Enter");
  await expect(page.getByText("Details saved — Zoltan will follow up by email.")).toBeVisible();
});

test("human escape hatch (email link) is always visible in the chat header (FR-1.7)", async ({
  page,
}) => {
  await mockChatEndpoints(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat with Spike, our AI agent" }).click();
  await expect(page.getByRole("link", { name: "Email instead" })).toBeVisible();
});
