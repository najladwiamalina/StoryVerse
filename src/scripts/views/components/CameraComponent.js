const CameraComponent = {
  stream: null,
  capturedFile: null, // Menyimpan file yang ditangkap kamera

  init() {
    console.log("CameraComponent initialized!");

    const video = document.getElementById('camera');
    const captureBtn = document.getElementById('capture-btn');
    const canvas = document.getElementById('canvas');
    const photoPreview = document.getElementById('photo-preview');

    if (!video || !captureBtn || !canvas || !photoPreview) {
      console.error("Elemen kamera tidak ditemukan di halaman.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.stream = stream;
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error("Gagal mengakses kamera:", err);
      });

    captureBtn.addEventListener('click', () => {
      console.log("Tombol 'Ambil Foto' ditekan!");
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Gagal mengambil foto!');
          return;
        }

        const file = new File([blob], 'story-photo.jpg', { type: 'image/jpeg' });
        this.capturedFile = file;

        // Preview gambar
        photoPreview.src = URL.createObjectURL(file);
      }, 'image/jpeg');
    });
  },

  getPhotoFile() {
    return this.capturedFile;
  },

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      console.log("Stream kamera dimatikan.");
    }
  }
};

export default CameraComponent;
