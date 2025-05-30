import HomePresenter from "./home-presenter";
import { showFormattedDate } from "../../utils";
import { getAllStories as getCachedStories } from "../../utils/db";

export default class HomePage {
  constructor() {
    this._presenter = new HomePresenter({
      view: this,
    });
  }

  async render() {
    return `
      <main class="container" aria-labelledby="stories-heading">
        <h1 id="stories-heading">Dicoding Universe</h1>
        <h2 id="welcome-message" class="welcome-message"></h2>
        <section id="stories-list" class="stories-list" aria-label="Story List">
        </section>
      </main>
    `;
  }

  async afterRender() {
    const userName = localStorage.getItem("userName") || "Guest";
    const welcomeMessage = document.getElementById("welcome-message");
    if (welcomeMessage) {
      welcomeMessage.textContent = `Hello, ${userName}`;
    }

    await this._presenter.showStories();
  }

  showStories(stories) {
    const storiesList = document.querySelector("#stories-list");
    storiesList.innerHTML = stories.map((story) => this._createStoryItem(story)).join("");
  }

  async showCachedStories() {
    const cachedStories = await getCachedStories();
    if (cachedStories.length > 0) {
      this.showStories(cachedStories);
      this.initializeMaps(cachedStories);
    } else {
      this.showError(new Error("No cached stories available."));
    }
  }

  initializeMaps(stories) {
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        try {
          const mapId = `map-${story.id}`;
          const mapElement = document.getElementById(mapId);

          if (!mapElement || typeof L === "undefined") return;

          const map = L.map(mapId).setView([story.lat, story.lon], 15);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          L.marker([story.lat, story.lon]).addTo(map).bindPopup(`Story location: ${story.lat}, ${story.lon}`).openPopup();
        } catch (error) {
          console.error(`Failed to initialize map for story ${story.id}:`, error);
          const mapElement = document.getElementById(`map-${story.id}`);
          if (mapElement) {
            mapElement.innerHTML = '<p class="error">Failed to load the map. Please check your internet connection</p>';
          }
        }
      }
    });
  }

  showError(error) {
    console.error("Failed to load stories:", error);
    document.querySelector("#stories-list").innerHTML = `
      <div class="error-message">
        Oops! We couldn't fetch the stories. Showing cached stories instead.
      </div>
    `;
    this.showCachedStories();
  }

  _createStoryItem(story) {
    const mapId = `map-${story.id}`;
    const hasLocation = story.lat && story.lon;

    return `
      <article class="story-item">
        <img src="${story.photoUrl}" alt="${story.description}" class="story-image">
        <div class="story-content">
          <h3>${story.name || "Guest"}</h3>
          <time datetime="${story.createdAt}">${showFormattedDate(story.createdAt)}</time>
          <p>${story.description}</p>
          ${
            hasLocation
              ? `
                <div class="story-location">
                  <small>Lokasi: ${story.lat}, ${story.lon}</small>
                  <div id="${mapId}" class="story-map" style="height: 150px; width: 100%;"></div>
                </div>
              `
              : ""
          }
        </div>
      </article>
    `;
  }
}
