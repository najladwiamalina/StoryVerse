import LoginPresenter from "./login-presenter";
import StoryAPI from "../../data/story-api";
import * as AuthUtils from "../../../scripts/utils/auth";
import { updateAuthUI } from "../../utils/auth-ui";

export default class LoginPage {
  #presenter = null;

  showLoadingOnSubmitButton() {
    const container = document.querySelector("#submit-button-container");
    if (!container) return;

    container.innerHTML = `<button class="btn" type="submit" disabled><i class="fas fa-spinner fa-spin"></i> Memuat...</button>`;
  }

  restoreSubmitButton() {
    const container = document.querySelector("#submit-button-container");
    if (!container) return;

    container.innerHTML = `<button class="btn" type="submit">Masuk</button>`;
  }

  async render() {
    document.documentElement.style.viewTransitionName = "login-page";
    return `
      <section class="login-container" style="view-transition-name: login-form;">
        <article class="login-form-container">
          <h1 class="login__title">Masuk</h1>
          <form id="login-form" class="login-form">
            <div class="form-control">
              <label for="email-input" class="login-form__email-title">Email</label>
              <input 
                id="email-input"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                aria-required="true"
              />
            </div>
            <div class="form-control">
              <label for="password-input" class="login-form__password-title">Password</label>
              <input 
                id="password-input"
                name="password"
                type="password"
                placeholder="Kata sandi Anda"
                required
                aria-required="true"
              />
            </div>
            <div class="form-buttons login-form__form-buttons">
              <div id="submit-button-container">
                <button class="btn" type="submit">Masuk</button>
              </div>
              <p class="login-form__do-not-have-account">Belum punya akun? <a href="#/register">Daftar</a></p>
            </div>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    document.documentElement.style.viewTransitionName = "";
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryAPI,
      authModel: AuthUtils,
    });

    this.#attachFormHandler();
  }

  #attachFormHandler() {
    const form = document.querySelector("#login-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = form.querySelector("#email-input")?.value?.trim();
      const password = form.querySelector("#password-input")?.value?.trim();

      if (!email || !password) {
        this.loginFailed("Email dan password harus diisi");
        return;
      }

      try {
        await this.#presenter.handleLogin({ email, password });
      } catch (err) {
        console.error("Login error:", err);
        this.loginFailed(err.message || "Terjadi kesalahan saat login.");
      }
    });
  }

  loginSuccessfully(message) {
    console.log("Berhasil login:", message);
    updateAuthUI();
    window.location.hash = "#/";
  }

  loginFailed(message) {
    const alertBox = document.createElement("div");
    alertBox.className = "error-message";
    alertBox.setAttribute("role", "alert");
    alertBox.setAttribute("aria-live", "assertive");
    alertBox.textContent = message;

    const form = document.querySelector("#login-form");
    form.prepend(alertBox);

    setTimeout(() => alertBox.focus(), 100);
  }
}
