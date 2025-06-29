// CSS imports
import "../styles/styles.css";

import App from "./pages/app";
import PushInitiator from "./utils/push-init";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();

  PushInitiator.init();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});

const isDev = location.hostname === "localhost";
const swPath = isDev ? "/sw.bundle.js" : "/StoryVerse/sw.bundle.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(swPath)
      .then((reg) => {
        console.log("Service Worker registered ✅", reg);
      })
      .catch((err) => {
        console.error("Service Worker failed ❌", err);
      });
  });
}
