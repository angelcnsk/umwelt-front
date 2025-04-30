import { firestore} from 'boot/firebase'
import { collection, addDoc,doc, onSnapshot, query, orderBy, updateDoc } from "firebase/firestore"; 
import { ref } from "vue";

export const mensajes = ref({});

export async function addNotify(req) {
    try {
        return await addDoc(collection(firestore, `notificaciones/1/items`), {
            'from': req.from,
            'email' : req.email,
            'service_id' : req.service_id,
            'planta' : req.planta,
            'time': new Date().getTime(),
            'created_at': new Date(),
            'view': false,
            'notify': `Hola, te han asignado un nuevo servicio`,
            'avatar': req.avatar,
        });
    } catch (error) {
        console.log(error)
        throw new Error("Error al agregar la notificación: " + error);
    }
}

export const listenToNotifications = (userId, onUpdate
  ) => {
    const q = query(
      collection(firestore, `notificaciones/${userId}/items`),
      orderBy('time', 'desc') // opcional: ordena por fecha
    );
    const avatarDommie = "https://firebasestorage.googleapis.com/v0/b/umwelt-4afa1.appspot.com/o/assets%2Favatar-s-11.png?alt=media&token=1d9c1292-75e8-4f8e-a8b4-64e80ce42087&_gl=1*52kp9q*_ga*NzAyNDQwMzI5LjE2OTQ4MjY4Mzg.*_ga_CW55HF8NVT*MTY5NjQ3NDY0OC41MC4xLjE2OTY0NzYyMDUuMTYuMC4w";

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        avatar: doc.avatar = (doc.avatar == undefined || doc.avatar == null) ? avatarDommie : doc.avatar,        
      }));
      onUpdate(data);
    });
  
    return unsubscribe; // <- úsalo para detener el listener
  };

export async function setNotifyView (req,userId) {
    const {id:notificationId} = req;
    console.log("ID de la notificación:", notificationId);
    try {
        const notificationRef = doc(firestore, `notificaciones/${userId}/items/${notificationId}`);
        await updateDoc(notificationRef, {view: true});
    } catch (error) {
        console.error("Error al marcar la notificación como leída:", error);
        throw new Error("No se pudo actualizar el estado de la notificación");
    }
}