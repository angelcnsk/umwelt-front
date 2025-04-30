import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, goOffline, goOnline } from "firebase/database";
import { getStorage} from "firebase/storage"
import { getFirestore } from "firebase/firestore";


// Agregar configuración firebase:
var firebaseConfig = {
  apiKey:import.meta.env.VITE_apiKey,
  authDomain:import.meta.env.VITE_authDomain,
  projectId:import.meta.env.VITE_projectId,
  storageBucket:import.meta.env.VITE_storageBucket,
  messagingSenderId:import.meta.env.VITE_messagingSenderId,
  appId:import.meta.env.VITE_appId
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)
const storage = getStorage(app);
const firestore = getFirestore(app,'umwelt-dev');

// Habilitar la persistencia offline
db.persistenceEnabled = true;

export { db, auth, storage, firestore, goOffline, goOnline }