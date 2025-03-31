import { ref, onValue, set, update, push, get } from "firebase/database";
import { db } from "boot/firebase";
// goOffline(db);
// goOnline(db);

export const readData = (path) => {
    const dataRef = ref(db, path);
  
    return new Promise((resolve, reject) => {
      // Escucha en tiempo real los cambios del nodo
      onValue(dataRef, 
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            resolve(data); // Resuelve la promesa con los datos
          } else {
            resolve(null);
          }
        }, 
        (error) => {
          reject(error); // Rechaza la promesa si ocurre un error
        }
      );
    });
};

// Función para escribir datos (sobrescribir un nodo)
export const writeData = async (path, data) => {
    const dataRef = ref(db, path);
    try {
      await set(dataRef, data); // Escribe los datos en el nodo
      console.log("Data written successfully");
    } catch (error) {
      console.error("Error writing data:", error);
    }
};

// Función para actualizar datos (sin sobrescribir todo el nodo)
export const updateData = async (path, updates) => {
const dataRef = ref(db, path);
    try {
        await update(dataRef, updates); // Actualiza los campos especificados
        console.log("Data updated successfully");
    } catch (error) {
        console.error("Error updating data:", error);
    }
};

// Función para agregar un nuevo hijo a un nodo
export const pushData = async (path, data) => {
const dataRef = ref(db, path);
    try {
        const newChildRef = push(dataRef); // Crea un nuevo nodo hijo
        await set(newChildRef, data); // Escribe los datos en el nuevo hijo
        console.log("Data pushed successfully");
        return newChildRef.key; // Devuelve la clave generada
    } catch (error) {
        console.error("Error pushing data:", error);
    }
};

export async function getData(path){
    try {
      const snapshot = await get(ref(db,path))
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
      return null;
    }
}
  
export async function saveData(path, data){
    try {
      await set(ref(db,path), data)
    } catch (error) {
      console.error('Error saving data to Firebase:', error);
    }
}