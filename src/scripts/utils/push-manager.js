import CONFIG from "../config";

const VAPID_PUBLIC_KEY = CONFIG.WEB_PUSH_VAPID_PUBLIC_KEY; // ✅ sesuaikan dengan config.js

function urlBase64ToUint8Array(base64String) {
  if (!base64String || typeof base64String !== "string") {
    throw new Error("Invalid VAPID public key: expected non-empty string");
  }

  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

const registerPush = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

  const registration = await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) return existingSubscription;

  const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  });
};

export default registerPush;
