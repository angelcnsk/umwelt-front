import {db, auth} from 'boot/firebase'
import { collection, query, onSnapshot, addDoc, where, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";


export const mensajes = ref([])

export async function launchNotify(req) {
    addDoc(collection(db, 'notificaciones'), {
        'firebase_id': req.firebase_id,
        'email' : req.email,
        'service_id' : req.service_id,
        'planta' : req.planta,
        'created_at': new Date(),
        'view': false,
        'notify': `Hola, te han asignado un nuevo servicio`
    })
    return true
}

export async function getNotify () {
   return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if(user){
                const q = query(collection(db, 'notificaciones'), 
                    where ("firebase_id", "==", auth.currentUser.uid),
                    where ("view", "==", false))
                
                onSnapshot(q, (snapShot) => {
                    snapShot.docChanges().forEach((change) => {
                        const obj = change.doc.data()
                        obj.id = change.doc.id
                        
                        if(change.type == 'added'){    
                            mensajes.value.push(obj)
                        }
                        if(change.type == 'removed'){
                            if(obj.view){
                                console.log('set view')
                                let index = this.notifications.findIndex(objeto => objeto.id === obj.id);
                                mensajes.value.splice(index, 1);
                            }
                        }
                    });
                })
            } else {
                location.replace('/logout')
            }
            })
        resolve(mensajes.value)
    })
}

export async function setNotifyView (req) {
    try {
        req.view = true
        updateDoc(doc(db,'notificaciones',req.id), req)
    } catch (error) {
        console.log(error)
        return false
    }
}