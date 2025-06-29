// File: src/scripts/pages/register-page.js

const RegisterPage = {
  async render() {
    return `
        <h2>Register</h2>
        <form id="register-form">
          <label for="name">Name</label><br />
          <input type="text" id="name" name="name" required /><br />
  
          <label for="email">Email</label><br />
          <input type="email" id="email" name="email" required /><br />
  
          <label for="password">Password</label><br />
          <input type="password" id="password" name="password" required minlength="8" /><br />
  
          <button type="submit">Register</button>
        <div id="login-loader" style="display: none;">⏳ Loading...</div>
        </form>
      `;
  },

  async afterRender() {
    const form = document.querySelector("#register-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      try {
        const response = await fetch(
          "https://story-api.dicoding.dev/v1/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
          }
        );

        const result = await response.json();

        if (result.error) {
          alert(`❌ Register gagal: ${result.message}`);
        } else {
          alert("✅ Berhasil daftar! Silakan login.");
          window.location.hash = "/login";
        }
      } catch (err) {
        alert("❌ Gagal terhubung ke server");
        console.error(err);
      }
    });
  },
};

export default RegisterPage;
