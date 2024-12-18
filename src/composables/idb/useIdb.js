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

    const removeItem = async (params) => {
      const db = await getDatabase();
      const transaction = db.transaction('data', 'readwrite')
      const objectStore = transaction.objectStore('data');
      
      if(params.all){
        let cursor = await objectStore.openCursor();
        while (cursor) {
          if (cursor.key.startsWith(params.prefix)) {
            await cursor.delete(); // Elimina el elemento si el prefijo coincide
          }
          cursor = await cursor.continue(); // Avanza al siguiente elemento
        }

        await transaction.done; // Asegúrate de que la transacción se complete
        console.log(`Elementos con el prefijo "${params.prefix}" eliminados.`);
        return true;
      } else {
        return db.transaction('data', 'readwrite')
        .objectStore('data')
        .delete(params.prefix);  
      }
      
    }

    

    return {getDatabase, saveDataToIndexedDB, getDataFromIndexedDB, removeItem}
}