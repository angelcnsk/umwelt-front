import { getAuth, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import {db} from 'boot/firebase'
import {ref, set} from 'firebase/database';
import { getData, saveData } from "src/composables/firebase/firebaseService";

// Función para guardar categorías
export async function setCategories(params) {
    try {
                
        // await set(ref(db, `16/categorias`), {
        //     category_id: 13,
        //     user_id: 11,
        //     create_at: new Date().toISOString(),
        // });
        console.log("Datos guardados correctamente");
    } catch (error) {
        console.error("Error al guardar datos:", error);
    }
}

export async function getCategories(){
    return getData('/16')
}