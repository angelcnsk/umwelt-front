import { openDB } from 'idb';

export const useIdb = () => {
    const getDatabase = async () => {
        return openDB('firebase-cache', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('data')) {
              db.createObjectStore('data', { keyPath: 'id' });
            }
          },
        });
    };

    const saveDataToIndexedDB = async (key, data) => {
        const db = await getDatabase();
        const tx = db.transaction('data', 'readwrite');
        await tx.store.put({ id: key, data });
        await tx.done;
    };
      
    const getDataFromIndexedDB = async (key) => {
        const db = await getDatabase();
        const tx = db.transaction('data', 'readonly');
        const result = await tx.store.get(key);
        return result?.data || null;
    };

    const removeItem = async (key) => {
      const db = await getDatabase();
      return db.transaction('data', 'readwrite')
      .objectStore('data')
      .delete(key);
    }

    return {getDatabase, saveDataToIndexedDB, getDataFromIndexedDB, removeItem}
}