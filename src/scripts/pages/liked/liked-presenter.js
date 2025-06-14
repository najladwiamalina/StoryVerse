import { getAllStories, deleteStory } from "../../utils/db";

const LikedPresenter = {
  async init({ storyListContainer }) {
    const stories = await getAllStories();

    if (!stories.length) {
      storyListContainer.innerHTML = "<p>Tidak ada story favorit.</p>";
      return;
    }

    storyListContainer.innerHTML = stories
      .map(
        (story) => `
      <article>
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <button data-id="${story.id}">Hapus</button>
      </article>
    `
      )
      .join("");

    storyListContainer.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await deleteStory(btn.dataset.id);
        this.init({ storyListContainer }); // refresh list
      });
    });
  },
};

export default LikedPresenter;
