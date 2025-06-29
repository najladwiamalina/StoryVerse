import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let currentMarker = null;

const redIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapComponent = {
  init() {
    const map = L.map('map').setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.getElementById('latitude').value = lat;
      document.getElementById('longitude').value = lng;

      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      currentMarker = L.marker([lat, lng], { icon: redIcon }).addTo(map)
        .bindPopup(`Lat: ${lat}, Lon: ${lng}`)
        .openPopup();
    });
  }
};

export default MapComponent;
