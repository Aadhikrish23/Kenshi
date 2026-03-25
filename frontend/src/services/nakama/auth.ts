import { client } from "./client";
import { Session } from "@heroiclabs/nakama-js";

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

  try {
    const parsed = JSON.parse(data);

    if (!parsed.token || !parsed.refresh_token) {
      throw new Error("Invalid session data");
    }

    return Session.restore(parsed.token, parsed.refresh_token);
  } catch (err) {
    console.log("⚠️ Failed to restore session, clearing...");
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

/**
 * Logout
 */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}
