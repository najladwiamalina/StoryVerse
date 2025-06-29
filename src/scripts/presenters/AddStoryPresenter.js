import IDB from '../utils/idb';
import CameraComponent from '../views/components/CameraComponent';

class AddStoryPresenter {
  constructor(view) {
    this.view = view;
  }

  async submitStory({ lat, lon, description, name }) {
    const file = CameraComponent.getPhotoFile(); 
    console.log({ file, lat, lon, description, name });

    if (!file || !lat || !lon || !description || !name) {
      alert('Lengkapi semua data!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('description', description);
      formData.append('lat', lat);
      formData.append('lon', lon);

      const token = localStorage.getItem('token');

      const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload gagal');
      }

      const result = await response.json();

      // ⬇️ ✅ SIMPAN ke IndexedDB (ini cukup satu kali aja)
      await IDB.putStory({
        id: Date.now(),
        name,
        description,
        photoUrl: URL.createObjectURL(file),
        createdAt: new Date().toISOString(),
      });

      alert('✅ Story berhasil ditambahkan!');
    } catch (error) {
      console.error('❌ Gagal menyimpan story:', error);
      alert('Gagal tambah story!');
    }
  }
}

export default AddStoryPresenter;
