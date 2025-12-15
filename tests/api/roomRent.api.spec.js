import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE_URL = "https://automationintesting.online";

function getToken() {
  const tokenPath = path.resolve("tests/storage/token.json");
  const { token } = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
  return token;
}

test("TC-API-002 — Book the room via User API and verify booking on Admin API", async ({
  request,
}) => {
  const token = getToken();

  const bookingPayload = {
    roomid: 2, //  existing roomid
    firstname: "vol",
    lastname: "zem",
    depositpaid: false,
    bookingdates: {
      checkin: "2025-12-18",
      checkout: "2025-12-24",
    },
  };

  const response = await request.post(`${BASE_URL}/api/booking/`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    data: bookingPayload,
  });

  // verification
  expect(response.ok()).toBeTruthy();

  const responseBody = await response.json();
  console.log(responseBody);

  expect(responseBody.bookingid).toBeTruthy();
  expect(responseBody.roomid).toBe(2);
  expect(responseBody.firstname).toBe("vol");
  expect(responseBody.lastname).toBe("zem");
});
