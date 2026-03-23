import { client } from "./client";

/**
 * Persist device ID across refresh
 */
function getDeviceId(): string {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}

/**
 * Authenticate user
 */
export async function authenticate() {
  const deviceId = getDeviceId();

  const session = await client.authenticateDevice(deviceId, true);

  return { session, userId: session.user_id };
}