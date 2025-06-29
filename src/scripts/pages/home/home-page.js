// src/scripts/pages/home/HomePage.js
import HomePresenter from '../../presenters/HomePresenter';
import MapHandler from '../../utils/MapHandler';

const HomePage = {
  async render() {
    return `
      <h2>Daftar Story</h2>
      <div id="story-list"></div>
      <div id="map" style="height: 400px;"></div> 
    `;
  },

  async afterRender() {
    const storyContainer = document.getElementById('story-list');
    const mapHandler = new MapHandler('map');
    mapHandler.initMap();

    const homePresenter = new HomePresenter({
      displayStories: (stories) => {
        storyContainer.innerHTML = ''; 
        stories.forEach((story) => {
          storyContainer.innerHTML += `
            <div class="story-card">
              <img src="${story.photoUrl}" alt="${story.name}">
              <h3>${story.name}</h3>
              <p><strong>Deskripsi :</strong>${story.description}</p>
              <p><strong>Tanggal dibuat :</strong> ${new Date(story.createdAt).toLocaleDateString('id-ID', { // saya tambahin ini min kurang 1 data aja kan
                year: 'numeric', month: 'long', day: 'numeric'
              })}</p>

            </div>
          `;
        });
      },
      showError: (error) => {
        storyContainer.innerHTML = `<p>Gagal memuat story.</p>`;
        console.error(error);
      },
    }, mapHandler);

    homePresenter.loadStories();
  },
};

export default HomePage;
