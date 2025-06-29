import IDB from '../utils/idb';

const FavoritePresenter = {
  async render(container) {
    const stories = await IDB.getAllStories();

    if (!stories.length) {
      container.innerHTML = '<p>Tidak ada story favorit.</p>';
      return;
    }

    container.innerHTML = stories.map(story => `
      <div class="story-item">
        <img src="${story.photoUrl}" alt="${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <button data-id="${story.id}">Hapus</button>
      </div>
    `).join('');

    // Tombol hapus
    container.querySelectorAll('button[data-id]').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        await IDB.deleteStory(id);
        this.render(container); // re-render
      });
    });
  }
};

export default FavoritePresenter;
