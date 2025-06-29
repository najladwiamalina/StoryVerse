import PushInitiator from "../utils/push-init";
import { updateAuthUI } from "../utils/auth-ui";

const LoginPage = {
  async render() {
    return `
      <h2 style="text-align: center;">Login</h2>
      <form id="login-form">
        <input id="email" type="email" placeholder="Email" required />
        <input id="password" type="password" placeholder="Password" required />
        <button type="submit" id="login-btn">Login</button>
        <div id="login-loader" style="display: none;">⏳ Loading...</div>
      </form>

    <p style="text-align: center; margin-top: 10px;">
      Belum punya akun?
      <a href="#/register" id="register-link">Register di sini</a>
    </p>

    `;
  },

  async afterRender() {
    document
      .querySelector("#login-btn")
      .addEventListener("click", async (e) => {
        e.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const loader = document.querySelector("#login-loader");

        loader.style.display = "block"; // tampilkan loading

        try {
          const response = await fetch(
            "https://story-api.dicoding.dev/v1/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          const result = await response.json();

          if (!response.ok) throw new Error(result.message);

          localStorage.setItem("token", result.loginResult.token);
          localStorage.setItem("name", result.loginResult.name);

          await PushInitiator.init();

          updateAuthUI();
          window.location.hash = "/";
        } catch (err) {
          alert(err.message || "Login gagal");
        } finally {
          loader.style.display = "none";
        }
      });
  },
};

export default LoginPage;
