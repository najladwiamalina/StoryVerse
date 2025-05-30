import Camera from "../../utils/camera.js";
import AddStoryPresenter from "./add-story-presenter";

// Fungsi utilitas untuk manajemen stream global
function addNewStreamToGlobal(stream) {
  if (!Array.isArray(window.currentStreams)) {
    window.currentStreams = [stream];
    return;
  }
  window.currentStreams = [...window.currentStreams, stream];
}

function stopAllMediaStreams() {
  if (!Array.isArray(window.currentStreams)) {
    window.currentStreams = [];
    return;
  }

  window.currentStreams.forEach((stream) => {
    if (stream.active) {
      stream.getTracks().forEach((track) => track.stop());
    }
  });

  window.currentStreams = [];
}

class AddStoryPage {
  constructor() {
    this._presenter = new AddStoryPresenter({
      view: this,
    });
    this._mediaStream = null;
    this._selectedLocation = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._resetPhotoInput = this._resetPhotoInput.bind(this);
    this._stopCamera = this._stopCamera.bind(this);
  }

  async render() {
    return `
      <section class="container add-story-container" aria-labelledby="add-story-title">
        <h1 id="add-story-title" class="add-story-title">Add a New Story</h1>
        
        <form id="add-story-form" class="add-story-form" aria-labelledby="add-story-title">
          <div class="form-group">
            <label for="description" id="description-label">Description</label>
            <textarea id="description" class="form-input" aria-labelledby="description-label" required aria-required="true"></textarea>
          </div>
          
          <div class="form-group camera-preview-container">
            <video id="camera-preview" autoplay playsinline></video>
            <button type="button" id="capture-btn" class="btn">Capture</button>
          </div>
          
          <div class="form-group">
            <canvas id="photo-canvas" style="display:none;"></canvas>
            <img id="photo-preview" class="photo-preview" style="display:none; alt="Captured photo preview">
            <button type="button" id="retake-btn" class="btn" style="display:none; margin-top:10px;">Retake</button>
          </div>
          
          <div class="form-group">
            <label for="location-input">Location</label>
            <div class="map-container">
              <div id="map" style="height: 400px;"></div>
              <small class="map-instruction">Tap the map to choose a location</small>
              <input type="hidden" id="lat">
              <input type="hidden" id="lon">
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Add Story</button>
          </div>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this._initMap();

    this._cameraPreview = document.getElementById("camera-preview");
    this._cameraContainer = document.querySelector(".camera-preview-container");
    this._photoPreview = document.getElementById("photo-preview");
    this._retakeBtn = document.getElementById("retake-btn");
    this._captureBtn = document.getElementById("capture-btn");
    this._addStoryForm = document.getElementById("add-story-form");

    await this._handleMediaSourceChange();

    this._addStoryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this._handleFormSubmit();
    });

    this._retakeBtn.addEventListener("click", () => {
      this._resetPhotoInput();
    });
  }

  cleanup() {
    this._stopCamera();

    if (this._addStoryForm) {
      this._addStoryForm.removeEventListener("submit", this._handleFormSubmit);
    }
    if (this._retakeBtn) {
      this._retakeBtn.removeEventListener("click", this._resetPhotoInput);
    }
    if (this._captureBtn) {
      this._captureBtn.onclick = null;
    }

    this._cameraPreview = null;
    this._cameraContainer = null;
    this._photoPreview = null;
    this._retakeBtn = null;
    this._captureBtn = null;
    this._addStoryForm = null;
  }

  _initMap() {
    this._map = L.map("map").setView([-6.2, 106.816666], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    const CustomMarker = L.DivIcon.extend({
      options: {
        html: `<div class="custom-marker">
                <div class="marker-pin"></div>
                <div class="coordinate-display">Lat: 0.0000, Lng: 0.0000</div>
              </div>`,
        className: "custom-marker-container",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -36],
      },
    });

    this._marker = L.marker(this._map.getCenter(), { draggable: true, icon: new CustomMarker() }).addTo(this._map);
    const updateCoordinateDisplay = (lat, lng) => {
      const display = this._marker.getElement()?.querySelector(".coordinate-display");
      if (display) {
        display.textContent = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
      }
      document.getElementById("lat").value = lat;
      document.getElementById("lon").value = lng;
      this._selectedLocation = { lat, lon: lng };
    };

    this._marker.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      updateCoordinateDisplay(lat, lng);
    });

    this._map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this._marker.setLatLng([lat, lng]);
      updateCoordinateDisplay(lat, lng);
    });

    const center = this._map.getCenter();
    updateCoordinateDisplay(center.lat, center.lng);
  }

  async _handleMediaSourceChange() {
    this._stopCamera();

    if (this._cameraContainer) this._cameraContainer.style.display = "block";
    if (this._photoPreview) this._photoPreview.style.display = "none";
    if (this._retakeBtn) this._retakeBtn.style.display = "none";

    try {
      this._mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      // Tambahkan ke global agar bisa dihentikan saat pindah halaman
      addNewStreamToGlobal(this._mediaStream);

      if (this._cameraPreview) {
        this._cameraPreview.srcObject = this._mediaStream;
      }

      this._captureBtn.onclick = () => this._capturePhoto();
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera access denied. Please allow camera permissions.");
    }
  }

  _capturePhoto() {
    const cameraPreview = this._cameraPreview;
    const canvas = document.getElementById("photo-canvas");
    const context = canvas.getContext("2d");

    canvas.width = cameraPreview.videoWidth;
    canvas.height = cameraPreview.videoHeight;
    context.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);

    this._displayPhotoPreview(canvas.toDataURL("image/jpeg"));

    this._stopCamera();
    if (this._cameraContainer) this._cameraContainer.style.display = "none";
  }

  _displayPhotoPreview(imageSrc) {
    this._photoPreview.src = imageSrc;
    this._photoPreview.style.display = "block";
    this._retakeBtn.style.display = "block";
  }

  _resetPhotoInput() {
    this._photoPreview.src = "";
    this._photoPreview.style.display = "none";
    this._retakeBtn.style.display = "none";

    this._handleMediaSourceChange();
  }

  _stopCamera() {
    try {
      if (this._mediaStream) {
        this._mediaStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        this._mediaStream = null;
      }

      if (this._cameraPreview) {
        this._cameraPreview.pause();
        this._cameraPreview.srcObject = null;
        this._cameraPreview.load();
      }
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  }

  async _handleFormSubmit() {
    try {
      this._stopCamera();

      const description = document.getElementById("description").value;
      const lat = document.getElementById("lat").value;
      const lon = document.getElementById("lon").value;

      if (!description) {
        alert("The description field cannot be empty");
        return;
      }

      if (!lat || !lon) {
        alert("Mark your location on the map");
        return;
      }

      let photoFile;
      const photoPreview = this._photoPreview;

      if (photoPreview.src && photoPreview.style.display !== "none") {
        if (photoPreview.src.startsWith("data:")) {
          const response = await fetch(photoPreview.src);
          const blob = await response.blob();
          photoFile = new File([blob], "story-photo.jpg", {
            type: "image/jpeg",
          });
        } else {
          alert("No valid photo found.");
          return;
        }
      } else {
        alert("Add a photo to proceed");
        return;
      }

      await this._presenter.postStory({
        description,
        photo: photoFile,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      });
    } catch (error) {
      console.error("Error in form submission:", error);
      alert("Failed to upload your story. Please try again.");
    }
  }

  showSuccess() {
    this._stopCamera();
    setTimeout(() => {
      window.location.hash = "#/";
    }, 300);
  }

  showError(error) {
    console.error("Failed to upload your story:", error);
    alert(`Failed to upload your story: ${error.message || "Terjadi kesalahan"}`);
  }
}

export default AddStoryPage;
