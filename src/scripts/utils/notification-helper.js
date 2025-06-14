import { convertBase64ToUint8Array } from "./index";
import CONFIG from "../config";
import StoryAPI from "../data/story-api";
import { getAccessToken } from "./auth";

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Browser tidak mendukung notifikasi.");
    return false;
  }

  if (Notification.permission === "granted") return true;

  const status = await Notification.requestPermission();
  if (status !== "granted") {
    alert("Izin notifikasi ditolak.");
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration?.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  const subscription = await getPushSubscription();
  return !!subscription;
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) return;

  if (await isCurrentPushSubscriptionAvailable()) {
    alert("Kamu sudah berlangganan notifikasi.");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    const pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const { endpoint, keys } = pushSubscription.toJSON();
    const token = getAccessToken();

    const result = await StoryAPI.subscribePushNotification(token, { endpoint, keys });

    if (result.error) {
      await pushSubscription.unsubscribe();
      alert("Gagal menyimpan langganan ke server.");
      return;
    }

    alert("Berhasil berlangganan notifikasi.");
  } catch (error) {
    alert("Terjadi kesalahan saat proses berlangganan.");
    console.error(error);
  }
}

export async function unsubscribe() {
  const pushSubscription = await getPushSubscription();

  if (!pushSubscription) {
    alert("Belum ada langganan yang aktif.");
    return;
  }

  try {
    const { endpoint } = pushSubscription.toJSON();
    const token = getAccessToken();

    const result = await StoryAPI.unsubscribePushNotification(token, endpoint);

    if (result.error) {
      alert("Gagal menghapus langganan dari server.");
      return;
    }

    await pushSubscription.unsubscribe();
    alert("Langganan notifikasi berhasil dihentikan.");
  } catch (error) {
    alert("Terjadi kesalahan saat unsubscribe.");
    console.error(error);
  }
}
