import { isLoggedIn, logout } from "../utils/auth";

export function updateAuthUI() {
  const authSection = document.getElementById("auth-section");
  if (!authSection) return;

  if (isLoggedIn()) {
    authSection.innerHTML = `
      <button id="logout-btn" class="btn-logout">
        Logout
      </button>
    `;

    document.getElementById("logout-btn")?.addEventListener("click", logout);
  } else {
    authSection.innerHTML = `
      <a href="#/login" class="btn-login">Login</a>
      <a href="#/register" class="btn-register">Register</a>
    `;
  }
}
