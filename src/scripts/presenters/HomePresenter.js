import { getAllStories } from '../data/api';
import IDB from '../utils/idb'; 

class HomePresenter {
  constructor(view, mapHandler) {
    this.view = view;
    this.mapHandler = mapHandler;
  }

  async loadStories() {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLVVNZjhVVUt3NV93emEzQ0IiLCJpYXQiOjE3NDMyOTA0Njd9.Okv89WPkax6hyS2T85EGC8YvO-i4gUttANsSJ128kRw';

      const response = await getAllStories(token);
      const stories = response.listStory;

      // Simpan ke IndexedDB
      stories.forEach((story) => IDB.putStory(story));

      // Tampilkan dari API
      this.view.displayStories(stories);
      this.mapHandler.addMarkers(stories);
    } catch (error) {
      console.warn('Gagal ambil API, coba tampilkan dari IndexedDB');

      // Ambil dari IndexedDB
      const cachedStories = await IDB.getAllStories();

      if (cachedStories.length > 0) {
        this.view.displayStories(cachedStories);
        this.mapHandler.addMarkers(cachedStories);
      } else {
        this.view.showError('Tidak dapat menampilkan story. Offline dan cache kosong.');
      }
    }
  }
}

export default HomePresenter;
