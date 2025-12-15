import { test, expect } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage";

test.describe("Registration Tests", () => {
  let homePage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page, "/");
    await homePage.visit();

    loginPage = await homePage.clickAdminLink();
  });

  test("Перевірка Field Name less than 2 letters", async ({ page }) => {
    await loginPage.typeUsername("admin");
    await loginPage.typePassword("password");
    await loginPage.clickLogin();
    await expect(page).toHaveURL(
      "https://automationintesting.online/admin/rooms"
    );
  });
});
