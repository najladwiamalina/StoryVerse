import LikedPresenter from "./liked-presenter";

const LikedPage = {
  async render() {
    return `
    <section class="liked-page container">
      <h2 class="section-title">Story Favorit</h2>
      <div id="story-list" class="story-grid"></div>
    </section>
  `;
  },
  async afterRender() {
    await LikedPresenter.init({
      storyListContainer: document.querySelector("#story-list"),
    });
  },
};

export default LikedPage;
