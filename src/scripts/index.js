import "../styles/styles.css";
import App from "./pages/app";
import Camera from "./utils/camera";
import registerPush from "./utils/push-manager"; // ⬅️ Tambahan

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app._renderPage();

  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-link");

  skipLink.addEventListener("click", function (event) {
    event.preventDefault();
    skipLink.blur();

    mainContent.setAttribute("tabindex", "-1");
    mainContent.focus();
    mainContent.scrollIntoView();

    setTimeout(() => {
      mainContent.removeAttribute("tabindex");
    }, 1000);
  });

  window.addEventListener("hashchange", async () => {
    Camera.stopAllStreams();
    await app._renderPage();
  });

  // 🔔 Daftarkan Service Worker dan Push Notification
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("✅ Service Worker terdaftar:", registration);

      const subscription = await registerPush();
      console.log("🔔 Push Subscription:", subscription);
    } catch (error) {
      console.error("❌ Gagal mendaftar SW/Push:", error);
    }
  }
});
