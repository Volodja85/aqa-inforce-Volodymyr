import { test, expect } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage";

test.describe("Room booking UI", () => {
  let homePage;
  let regPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page, "/");
    await homePage.visit();
  });

  test("TC-001: Room can be booked with valid data", async ({ page }) => {
    regPage = await homePage.clickBookNowButton();
    await regPage.ClickUseCalendar(18, 21);
    await regPage.ClickUseReserver();
    await regPage.typeUserFirstname("Vol");
    await regPage.typeUserLastname("Zem");
    await regPage.typeUserEmail("Vol.Zem@example.com");
    await regPage.typeUserPhone("+1234567890");
    await regPage.ClickUseReserveNow();

    await expect(
      page.getByRole("heading", { name: "Booking Confirmed" })
    ).toBeVisible();
    await expect(page.getByText("2025-12-18 - 2025-12-22")).toBeVisible();
  });

  test("TC-002: The room cannot be booked if one field is filled in", async ({
    page,
  }) => {
    regPage = await homePage.clickBookNowButton();
    await regPage.ClickUseCalendar(23, 27);
    await regPage.ClickUseReserver();
    await regPage.typeUserFirstname("Vol");
    await regPage.typeUserLastname("");
    await regPage.typeUserEmail("");
    await regPage.typeUserPhone("");
    await regPage.ClickUseReserveNow();
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();

    await expect(alert.locator("li")).toHaveCount(5);
  });

  test("TC-003: The room cannot be booked if two fields are filled in", async ({
    page,
  }) => {
    regPage = await homePage.clickBookNowButton();
    await regPage.ClickUseCalendar(23, 27);
    await regPage.ClickUseReserver();
    await regPage.typeUserFirstname("Vol");
    await regPage.typeUserLastname("Zem");
    await regPage.typeUserEmail("");
    await regPage.typeUserPhone("");
    await regPage.ClickUseReserveNow();
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();

    await expect(alert.locator("li")).toHaveCount(3);
  });
  test("TC-004: The room cannot be booked if three fields are filled in", async ({
    page,
  }) => {
    regPage = await homePage.clickBookNowButton();
    await regPage.ClickUseCalendar(23, 27);
    await regPage.ClickUseReserver();
    await regPage.typeUserFirstname("Vol");
    await regPage.typeUserLastname("Zem");
    await regPage.typeUserEmail("vol.zem@gmail.com");
    await regPage.typeUserPhone("");
    await regPage.ClickUseReserveNow();
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();

    await expect(alert.locator("li")).toHaveCount(2);
  });

  test("TC-005: The room cannot be booked if the phone number is entered incorrectly", async ({
    page,
  }) => {
    regPage = await homePage.clickBookNowButton();
    await regPage.ClickUseCalendar(23, 27);
    await regPage.ClickUseReserver();
    await regPage.typeUserFirstname("Vol");
    await regPage.typeUserLastname("Zem");
    await regPage.typeUserEmail("vol.zem@gmail.com");
    await regPage.typeUserPhone("+12345");
    await regPage.ClickUseReserveNow();

    await expect(
      page.getByRole("alert").getByText("size must be between 11 and 21")
    ).toBeVisible();
  });
});
