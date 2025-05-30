import BasePresenter from "../../utils/base-presenter";

export default class RegisterPresenter extends BasePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    super();
    this.#view = view;
    this.#model = model;
  }

  async getRegistered({ name, email, password }) {
    try {
      if (!name?.trim()) throw new Error("Masukkan nama Anda");
      if (!email?.trim()) throw new Error("Masukkan alamat email Anda");
      if (!password?.trim()) throw new Error("Masukkan kata sandi Anda");
      if (password.length < 6) throw new Error("Kata sandi harus terdiri dari 6 karakter atau lebih");

      this.showSubmitLoadingButton("Memuat...");

      const response = await this.#model.register({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      if (!response.ok) {
        throw new Error(response.message || "Pendaftaran gagal. Silakan coba lagi.");
      }

      this.#view.registeredSuccessfully(response.message);
    } catch (error) {
      this.#view.registeredFailed(error.message);
    } finally {
      this.hideSubmitLoadingButton("Daftar");
    }
  }
}
