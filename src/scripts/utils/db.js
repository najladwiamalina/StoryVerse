import CONFIG from "../config";

const DATABASE_NAME = CONFIG.DATABASE_NAME;
const DATABASE_VERSION = CONFIG.DATABASE_VERSION;
const OBJECT_STORE_NAME = CONFIG.OBJECT_STORE_NAME;

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

export async function getAllStories() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, "readonly");
    const store = transaction.objectStore(OBJECT_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveStory(story) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const store = transaction.objectStore(OBJECT_STORE_NAME);
    const request = store.put(story);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteStory(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const store = transaction.objectStore(OBJECT_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllStories() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const store = transaction.objectStore(OBJECT_STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
