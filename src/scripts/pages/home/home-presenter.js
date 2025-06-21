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

      // Ambil dari API
      const response = await this._dicodingStoryApi.getAllStories(token);

      if (!response.ok) {
        throw new Error(response.message || "Failed to load stories");
      }

      const stories = response.data.stories || response.data.listStory || [];

      // Simpan semua story ke IndexedDB (caching offline)
      // for (const story of stories) {
      //   await saveStory(story);
      // }

      this._view.showStories(stories);
      this._view.initializeMaps(stories);

      // ⬇️ Tambahkan listener simpan story
      this._setupLikeButtons(stories);
    } catch (error) {
      console.error("Gagal mengambil dari API. Mengambil dari IndexedDB...", error);
      const cachedStories = await getCachedStories();

      if (cachedStories.length > 0) {
        this._view.showStories(cachedStories);
        this._view.initializeMaps(cachedStories);

        // ⬇️ Setup tombol simpan juga dari cache
        this._setupLikeButtons(cachedStories);
      } else {
        this._view.showError(error);
      }
    }
  }

  _setupLikeButtons(stories) {
    stories.forEach((story) => {
      const button = document.querySelector(`[data-save-id="${story.id}"]`);
      if (button) {
        button.addEventListener("click", async () => {
          await saveStory(story);
          alert("Story disimpan ke favorit!");
        });
      }
    });
  }
}

export default HomePresenter;
