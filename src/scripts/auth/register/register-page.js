import RegisterPresenter from "./register-presenter";
import StoryApi from "../../data/story-api";
import { updateAuthUI } from "../../utils/auth-ui";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="register-container" aria-labelledby="register-title">
        <div class="register-form-container">
          <h1 id="register-title" class="register__title">Register</h1>

          <form id="register-form" class="register-form">
            <div class="form-control">
              <label for="name-input" id="name-label">Full Name</label>
              <input 
                id="name-input" 
                type="text" 
                name="name" 
                aria-labelledby="name-label"
                placeholder="Full name"
                aria-required="true"
                required
              />
            </div>
            
            <div class="form-control">
              <label for="email-input" id="email-label" class="register-form__email-title">Email</label>
              <div class="register-form__title-container">
                <input 
                  id="email-input" 
                  type="email" 
                  name="email" 
                  placeholder="yourname@gmail.com"
                  aria-labelledby="email-label"
                  required
                />
              </div>
            </div>

            <div class="form-control">
              <label for="password-input" class="register-form__password-title">Password</label>
              <div class="register-form__title-container">
                <input 
                  id="password-input" 
                  type="password" 
                  name="password" 
                  placeholder="Create your password"
                  required
                />
              </div>
            </div>

            <div class="form-buttons register-form__form-buttons">
              <div id="submit-button-container">
                <button class="btn" type="submit">Register</button>
              </div>
              <p class="register-form__already-have-account">
                Already have an account? <a href="#/login">Login</a>
              </p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryApi,
    });

    this.#setupForm();
  }

  #setupForm() {
    const form = document.getElementById("register-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById("name-input")?.value,
        email: document.getElementById("email-input")?.value,
        password: document.getElementById("password-input")?.value,
      };

      await this.#presenter.getRegistered(data);
    });
  }

  registeredSuccessfully(message) {
    console.log(message);
    updateAuthUI();
    window.location.hash = "#/login";
  }

  registeredFailed(message) {
    const form = document.getElementById("register-form");
    if (!form) return;

    form.querySelector(".error-message")?.remove();

    const errorElement = document.createElement("div");
    errorElement.className = "error-message fade-slide-down";
    errorElement.setAttribute("role", "alert");
    errorElement.textContent = message;

    form.prepend(errorElement);

    errorElement.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      errorElement.focus();
    }, 100);
  }
}
