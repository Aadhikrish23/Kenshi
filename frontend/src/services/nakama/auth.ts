import { client } from "./client";
import type { Session } from "@heroiclabs/nakama-js";

const SESSION_KEY = "nakama_session";

/**
 * Persist device ID
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
 * LOGIN (manual trigger)
 */
export async function login() {
  console.log("🟡 Login started");

  const deviceId = getDeviceId();
  console.log("🔑 Device ID:", deviceId);

  const session = await client.authenticateDevice(deviceId, true);

  console.log("✅ Logged in:", session);

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session;
}

/**
 * Get stored session
 */
export function getSession(): Session | null {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;

  return JSON.parse(data);
}

/**
 * Logout
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}