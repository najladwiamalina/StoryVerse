import StoryAPI from "../../data/story-api";
import { getAccessToken } from "../../utils/auth";
import { saveStory } from "../../utils/db";

class AddStoryPresenter {
  constructor({ view }) {
    this._view = view;
    this._dicodingStoryApi = StoryAPI;
  }

  async postStory({ description, photo, lat, lon }) {
    try {
      const token = getAccessToken();
      let response;

      if (token) {
        response = await this._dicodingStoryApi.addStory({
          token,
          description,
          photo,
          lat,
          lon,
        });
      } else {
        response = await this._dicodingStoryApi.addStoryGuest({
          description,
          photo,
          lat,
          lon,
        });
      }

      // ✅ Jika response OK, simpan ke IndexedDB
      if (response && response.data && response.data.story) {
        await saveStory(response.data.story);
      }

      this._view.showSuccess();
    } catch (error) {
      this._view.showError(error);
    }
  }
}

export default AddStoryPresenter;
