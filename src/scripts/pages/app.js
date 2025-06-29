import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  _activePage = null; // ⬅️ Tambahkan ini

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url] || routes["/login"];

    const protectedRoutes = ["/add-story", "/favorite"];
    const token = localStorage.getItem("token");

    if (!token && protectedRoutes.includes(url)) {
      window.location.hash = "/login";
      return;
    }

    // 🧹 Bersihkan halaman sebelumnya
    if (this._activePage && typeof this._activePage.destroy === "function") {
      await this._activePage.destroy(); // MATIKAN kamera dll di halaman sebelumnya
    }

    // Tampilkan loader
    const loader = document.createElement("div");
    loader.id = "global-loader";
    loader.innerText = "Loading...";
    document.body.appendChild(loader);

    try {
      this._activePage = page; // ⬅️ Simpan halaman aktif
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    } finally {
      loader.remove();
    }
  }
}

export default App;
