import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from "../utils/auth";
import { updateAuthUI } from "../utils/auth-ui";
import { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from "../utils/notification-helper";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  _currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.supportsViewTransitions = "startViewTransition" in document;
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupRouter();
    this.#setupPushNotification(); // Langkah tambahan

    window.addEventListener("hashchange", () => {
      this._renderPage();
      updateAuthUI();
    });

    updateAuthUI();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  _setupRouter() {
    window.addEventListener("hashchange", () => this._renderPage());
    window.addEventListener("load", () => this._renderPage());
  }

  async _renderPage() {
    try {
      if (this._currentPage && typeof this._currentPage.cleanup === "function") {
        await this._currentPage.cleanup();
      }

      const url = getActiveRoute();
      const page = routes[url] || routes["/"];

      const authenticatedPage = checkAuthenticatedRoute(page);
      const unauthenticatedPage = checkUnauthenticatedRouteOnly(page);
      const finalPage = authenticatedPage !== null ? authenticatedPage : unauthenticatedPage !== null ? unauthenticatedPage : page;

      if (!finalPage) return;

      const renderAndAttach = async () => {
        try {
          this.#content.innerHTML = await finalPage.render();
          await finalPage.afterRender();
        } catch (err) {
          console.warn("⚠️ Halaman gagal dimuat:", err);
          this.#content.innerHTML = `
        <section class="offline-fallback">
          <h2>Oops! Kamu sedang offline</h2>
          <p>Konten tidak dapat dimuat. Silakan periksa koneksi internet kamu.</p>
        </section>
      `;
        }
      };

      if (this.supportsViewTransitions) {
        const transition = document.startViewTransition(renderAndAttach);
        await transition.ready;
      } else {
        await renderAndAttach();
      }

      this._currentPage = finalPage;
    } catch (error) {
      console.error("Error during page render:", error);
      this.#content.innerHTML = `
    <section class="offline-fallback">
      <h2>Kesalahan Tidak Terduga</h2>
      <p>${error.message}</p>
    </section>
  `;
    }
  }

  async #setupPushNotification() {
    const container = document.getElementById("push-notification-tools");
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      container.innerHTML = `<button id="unsubscribe-button">Unsubscribe</button>`;
      document.getElementById("unsubscribe-button").addEventListener("click", () => {
        unsubscribe().finally(() => this.#setupPushNotification());
      });
    } else {
      container.innerHTML = `<button id="subscribe-button">Subscribe</button>`;
      document.getElementById("subscribe-button").addEventListener("click", () => {
        subscribe().finally(() => this.#setupPushNotification());
      });
    }
  }
}

export default App;
