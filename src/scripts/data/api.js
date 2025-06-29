import CONFIG from '../config';

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
};


export async function getAllStories(token) {
  const fetchResponse = await fetch(`${ENDPOINTS.STORIES}?location=1`, { 
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!fetchResponse.ok) {
    throw new Error('Gagal mengambil data stories');
  }

  return fetchResponse.json();
}



const API = {
  async addStory({ photo, lat, lon, description }) {
    const formData = new FormData();
    formData.append('photo', dataURItoBlob(photo)); 
    formData.append('lat', lat);
    formData.append('lon', lon);
    formData.append('description', description);

    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLVVNZjhVVUt3NV93emEzQ0IiLCJpYXQiOjE3NDMyOTA0Njd9.Okv89WPkax6hyS2T85EGC8YvO-i4gUttANsSJ128kRw', // 
      },
      body: formData, 
    });

    return response.json();
  }
};

function dataURItoBlob(dataURI) {
  let byteString = atob(dataURI.split(',')[1]);
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export default API;








