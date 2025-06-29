import { openDB } from 'idb';

const DATABASE_NAME = 'story-app-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
  },
});

const IDB = {
  async putStory(story) {
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },
  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default IDB;
