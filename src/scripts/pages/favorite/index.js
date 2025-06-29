import IDB from '../../utils/idb';

const Favorite = {
  async render() {
    return `
      <section class="container">
        <h2>Story Favorit</h2>
        <div id="favorite-list" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('favorite-list');
    const stories = await IDB.getAllStories();

    if (stories.length === 0) {
      container.innerHTML = '<p>Belum ada story favorit.</p>';
      return;
    }

    container.innerHTML = stories.map((story) => `
      <div class="story-card">
        <img src="${story.photoUrl}" alt="${story.name}" />
        <h3>${story.name}</h3>
        <p><strong>Deskripsi :</strong> ${story.description}</p>
        <p><strong>Tanggal dibuat :</strong> ${story.createdAt}</p>
        <button class="delete-button" data-id="${story.id}">Hapus</button>
      </div>
    `).join('');

    container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('delete-button')) {
        const id = e.target.dataset.id;
        await IDB.deleteStory(id);
        await this.afterRender(); 
      }
    });
  },
};

export default Favorite;
