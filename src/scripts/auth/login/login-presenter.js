import BasePresenter from "../../utils/base-presenter";

export default class LoginPresenter extends BasePresenter {
  #view;
  #userModel;
  #authHandler;

  constructor({ view, model, authModel }) {
    super();
    this.#view = view;
    this.#userModel = model;
    this.#authHandler = authModel;
  }

  async handleLogin({ email, password }) {
    try {
      if (!email?.trim()) throw new Error("Email tidak boleh kosong");
      if (!password?.trim()) throw new Error("Password tidak boleh kosong");

      this.showSubmitLoadingButton("Sedang masuk...");

      const result = await this.#userModel.login({
        email: email.trim(),
        password: password.trim(),
      });

      if (!result.ok) {
        throw new Error(result.message || "Gagal login");
      }

      const { name, token } = result.data?.loginResult || {};
      if (!token) {
        throw new Error("Token tidak valid");
      }

      this.#authHandler.putAccessToken(token);
      localStorage.setItem("userName", name);

      this.#view.loginSuccessfully(result.message);
    } catch (err) {
      console.error("Terjadi kesalahan saat login:", err);
      this.#view.loginFailed(err.message);
    } finally {
      this.hideSubmitLoadingButton("Masuk");
    }
  }
}
