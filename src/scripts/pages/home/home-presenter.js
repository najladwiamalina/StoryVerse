import StoryAPI from "../../data/story-api";
import { getAccessToken } from "../../utils/auth";
import { getAllStories as getCachedStories, saveStory } from "../../utils/db";

class HomePresenter {
  constructor({ view }) {
    this._view = view;
    this._dicodingStoryApi = StoryAPI;
  }

  async showStories() {
    const token = getAccessToken();

    try {
      if (!token) throw new Error("No authentication token found");

      // Coba ambil dari API
      const response = await this._dicodingStoryApi.getAllStories(token);

      if (!response.ok) {
        throw new Error(response.message || "Failed to load stories");
      }

      const stories = response.data.stories || response.data.listStory || [];

      // Simpan ke IndexedDB satu per satu
      for (const story of stories) {
        await saveStory(story);
      }

      this._view.showStories(stories); // Tampilkan ke UI
      this._view.initializeMaps(stories); // Inisialisasi peta
    } catch (error) {
      // Jika gagal (misalnya offline), fallback ke IndexedDB
      console.error("Gagal mengambil dari API. Mengambil dari IndexedDB...", error);
      const cachedStories = await getCachedStories();

      if (cachedStories.length > 0) {
        this._view.showStories(cachedStories);
        this._view.initializeMaps(cachedStories);
      } else {
        this._view.showError(error);
      }
    }
  }
}

export default HomePresenter;
