import { expect, test } from "@playwright/test";

test("홈 페이지가 열린다", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "Whiteboard" })).toBeVisible();
});
