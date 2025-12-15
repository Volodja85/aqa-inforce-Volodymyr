import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE_URL = "https://automationintesting.online";

function getToken() {
  const tokenPath = path.resolve("tests/storage/token.json");
  const { token } = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
  return token;
}

test("TC-API-004 — Delete Room via Admin API and verify it is removed from User API", async ({
  request,
}) => {
  const token = getToken();

  // 1) Create room (Admin API)
  const roomName = `DEL-${Date.now()}`;

  await request.post(`${BASE_URL}/api/room/`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    data: {
      roomName,
      type: "Single",
      accessible: true,
      image: "/images/room1.jpg",
      description: "Room for delete test",
      features: ["TV", "WiFi"],
      roomPrice: 100,
    },
  });

  // 2) Find created roomId via User API
  const roomsRes = await request.get(`${BASE_URL}/api/room/`);
  expect(roomsRes.ok()).toBeTruthy();

  const roomsJson = await roomsRes.json();
  const rooms = roomsJson.rooms ?? roomsJson;

  const createdRoom = rooms.find((r) => r.roomName === roomName);
  expect(createdRoom).toBeTruthy();

  const roomId = createdRoom.roomid;
  expect(roomId).toBeTruthy();

  // 3) Delete room (Admin API)
  const deleteRes = await request.delete(`${BASE_URL}/api/room/${roomId}`, {
    headers: { Cookie: `token=${token}` },
  });

  // sometimes 200, sometimes 202/204 — so we just check ok()
  expect(deleteRes.ok()).toBeTruthy();

  // 4) Verify via User API that room is deleted
  const roomsResAfter = await request.get(`${BASE_URL}/api/room/`);
  expect(roomsResAfter.ok()).toBeTruthy();

  const roomsJsonAfter = await roomsResAfter.json();
  const roomsAfter = roomsJsonAfter.rooms ?? roomsJsonAfter;

  const stillExists = roomsAfter.some((r) => r.roomid === roomId);
  expect(stillExists).toBe(false);
});
