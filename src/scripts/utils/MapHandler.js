// src/scripts/utils/MapHandler.js
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class MapHandler {
  constructor(mapContainerId) {
    this.mapContainerId = mapContainerId;
    this.map = null;
  }

  initMap() {
    this.map = L.map(this.mapContainerId).setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  addMarkers(stories) {
    if (!this.map) {
      console.error('Peta belum diinisialisasi');
      return;
    }

    const markerIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon], { icon: markerIcon }).addTo(this.map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }
}

export default MapHandler;
