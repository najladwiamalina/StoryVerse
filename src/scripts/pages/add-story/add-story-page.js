import CameraComponent from '../../views/components/CameraComponent';
import MapComponent from '../../views/components/MapComponent';
import AddStoryPresenter from '../../presenters/AddStoryPresenter';
import '../../../styles/add-story.css';

const AddStoryPage = {
  async render() {
    return `
      <h2>Tambah Story</h2>

      <section>
        <label for="camera">Ambil Foto</label><br />
        <video id="camera" autoplay></video>
        <button id="capture-btn">Ambil Foto</button>
        <canvas id="canvas" style="display: none;"></canvas>
        <img id="photo-preview" alt="Hasil Foto">
      </section>

      <section>
        <div id="map" style="height: 400px;"></div>
      </section>

      <section>
        <label for="latitude">Latitude</label><br />
        <input type="text" id="latitude" placeholder="Latitude" readonly>

        <label for="longitude">Longitude</label><br />
        <input type="text" id="longitude" placeholder="Longitude" readonly>
      </section>

      <section>
        <label for="description">Deskripsi</label><br />
        <textarea id="description" placeholder="Deskripsi"></textarea>
      </section>

      <button id="submit-btn">Tambah Story</button>
    `;
  },

  async afterRender() {
    CameraComponent.init();
    MapComponent.init();

    const presenter = new AddStoryPresenter();

    document.querySelector('#submit-btn').addEventListener('click', async () => {
      const description = document.querySelector('#description').value;
      const lat = parseFloat(document.querySelector('#latitude').value);
      const lon = parseFloat(document.querySelector('#longitude').value);
      const file = CameraComponent.getPhotoFile();
      const name = 'User';

      if (!file || !description || !lat || !lon) {
        alert('Lengkapi semua data!');
        return;
      }

      await presenter.submitStory({
        name,
        lat,
        lon,
        description,
      });
    });
  },

  async destroy() {
    //  Ini penting agar kamera mati saat user berpindah halaman
    CameraComponent.stop();
  }
};

export default AddStoryPage;
