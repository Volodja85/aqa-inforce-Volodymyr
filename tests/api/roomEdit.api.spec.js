import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE_URL = "https://automationintesting.online";

function getToken() {
  const tokenPath = path.resolve("tests/storage/token.json");
  const { token } = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
  return token;
}

test("TC-API-003 — Edit Room via Admin API and verify changes via User API", async ({
  request,
}) => {
  const token = getToken();

  // 1) Create a room (Admin API)
  const roomName = `EDIT-${Date.now()}`;

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
      description: "Room before edit",
      features: ["TV", "WiFi"],
      roomPrice: 100,
    },
  });

  // 2) Get roomId via User API
  const roomsRes = await request.get(`${BASE_URL}/api/room/`);
  expect(roomsRes.ok()).toBeTruthy();

  const roomsJson = await roomsRes.json();
  const rooms = roomsJson.rooms ?? roomsJson;

  const createdRoom = rooms.find((r) => r.roomName === roomName);
  expect(createdRoom).toBeTruthy();

  const roomId = createdRoom.roomid;
  expect(roomId).toBeTruthy();

  // 3) Edit the room (Admin API) - PUT /api/room/:id {index=1}
  const updatedRoomPayload = {
    roomName,
    type: "Suite",
    accessible: false,
    image: "/images/room2.jpg",
    description: "Room AFTER edit",
    features: ["TV", "WiFi", "Safe"],
    roomPrice: 450,
  };

  const updateRes = await request.put(`${BASE_URL}/api/room/${roomId}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    data: updatedRoomPayload,
  });

  expect(updateRes.ok()).toBeTruthy();

  // 4) Check changes on the user page (User API)
  const roomsResAfter = await request.get(`${BASE_URL}/api/room/`);
  expect(roomsResAfter.ok()).toBeTruthy();

  const roomsJsonAfter = await roomsResAfter.json();
  const roomsAfter = roomsJsonAfter.rooms ?? roomsJsonAfter;

  const updatedRoom = roomsAfter.find((r) => r.roomid === roomId);

  expect(updatedRoom.type).toBe("Suite");
  expect(updatedRoom.accessible).toBe(false);
  expect(updatedRoom.description).toBe("Room AFTER edit");
  expect(updatedRoom.roomPrice).toBe(450);
});
