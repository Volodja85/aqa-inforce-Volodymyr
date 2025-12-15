import { test, expect } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage";
import fs from "fs";
import path from "path";

test.describe("Registration Tests", () => {
  let homePage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page, "/");
    await homePage.visit();
    loginPage = await homePage.clickAdminLink();
  });

  test("Login and save token", async ({ page, context }) => {
    test.setTimeout(10000);

    await loginPage.typeUsername("admin");
    await loginPage.typePassword("password");

    await Promise.all([
      page.waitForURL("**/admin**", { timeout: 30000 }),
      loginPage.clickLogin(),
    ]);

    await expect(page).toHaveURL(/\/admin/);

    // We wait for the page to "have time" to write storage after the redirect
    await page.waitForLoadState("networkidle");

    // 1) localStorage / sessionStorage: look for any field similar to token
    const storageDump = await page.evaluate(() => {
      const local = {};
      const session = {};

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        local[k] = localStorage.getItem(k);
      }
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        session[k] = sessionStorage.getItem(k);
      }

      const findToken = (obj) => {
        const tokenKey = Object.keys(obj).find((k) =>
          /token|access|auth|jwt/i.test(k)
        );
        return tokenKey ? obj[tokenKey] : null;
      };

      return {
        url: location.href,
        localKeys: Object.keys(local),
        sessionKeys: Object.keys(session),
        localTokenGuess: findToken(local),
        sessionTokenGuess: findToken(session),
        local,
        session,
      };
    });

    // 2) cookies: looking for a cookie similar to token/auth
    const cookies = await context.cookies();
    const cookieGuess = cookies.find((c) =>
      /token|access|auth|jwt/i.test(c.name)
    );

    const token =
      storageDump.localTokenGuess ||
      storageDump.sessionTokenGuess ||
      (cookieGuess ? cookieGuess.value : null);

    if (!token) {
      // Let's give the most useful debug
      console.log("=== STORAGE DUMP ===");
      console.log(JSON.stringify(storageDump, null, 2));
      console.log("=== COOKIES ===");
      console.log(
        JSON.stringify(
          cookies.map((c) => ({
            name: c.name,
            domain: c.domain,
            path: c.path,
          })),
          null,
          2
        )
      );

      throw new Error(
        "Token not found in localStorage, sessionStorage, or cookies. " +
          "See STORAGE DUMP / COOKIES logs."
      );
    }

    // Store the token
    const filePath = path.resolve(__dirname, "../storage/token.json");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({ token }, null, 2), "utf-8");

    console.log(`Token saved to ${filePath}`);
  });
});

test("Create room via API using existing token", async ({ request }) => {
  //1. Read token from file
  const tokenPath = path.resolve("tests/storage/token.json");
  const { token } = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));

  // 2. Room data
  const roomPayload = {
    roomName: "105",
    type: "Single",
    accessible: true,
    description: "Aenean porttitor mauris   fames ac ante.",
    features: ["TV", "WiFi", "Safe"],
    roomPrice: 300,
  };

  // 3. API request to create a room
  const response = await request.post(
    "https://automationintesting.online/api/room/",
    {
      headers: {
        "Content-Type": "application/json",
        // ⚠️ important — the token is transmitted as a COOKIE
        Cookie: `token=${token}`,
      },
      data: roomPayload,
    }
  );

  // 4. Checks
  expect([200, 201]).toContain(response.status());

  const responseBody = await response.json();
  console.log(responseBody);
});
