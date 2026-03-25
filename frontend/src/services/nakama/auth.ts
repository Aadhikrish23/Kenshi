import { client } from "./client";
import type { Session } from "@heroiclabs/nakama-js";

const SESSION_KEY = "nakama_session";

/**
 * Persist device ID
 */
function getDeviceId(): string {
  let deviceId = sessionStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    sessionStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}

/**
 * LOGIN (manual trigger)
 */
export async function login() {
  console.log("🟡 Login started");

  const deviceId = getDeviceId();
  console.log("🔑 Device ID:", deviceId);

  const session = await client.authenticateDevice(deviceId, true);

  console.log("✅ Logged in:", session);

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session;
}

/**
 * Get stored session
 */
export function getSession(): Session | null {
  const data = sessionStorage.getItem(SESSION_KEY);
  if (!data) return null;

  return JSON.parse(data);
}

/**
 * Logout
 */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}
