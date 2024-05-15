import {db, auth} from 'boot/firebase'
import { getDatabase, ref as refb, set, onValue, push, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";


export const mensajes = ref({})

export async function launchNotify(req) {
    const db = getDatabase()
    push(refb(db, 'notificaciones/user_id_'+req.user_id), {
        'user_id': req.user_id,
        'email' : req.email,
        'service_id' : req.service_id,
        'planta' : req.planta,
        'created_at': new Date(),
        'view': false,
        'notify': `Hola, te han asignado un nuevo servicio`
    })
    return true
}

export async function getNotify (activeUser) {
    return new Promise((resolve) => {
        const db = getDatabase();
        const notifications = refb(db, 'notificaciones/user_id_' + activeUser.id);
        onAuthStateChanged(auth, (user) => {
            if(user){
                onValue(notifications, (snapshot) => {
            
                    const data = snapshot.val();
                    if(data != null){
                        const a_notify = Object.entries(data)
                        const items = []
                        let unread = 0
                        a_notify.map((item) => {
                            const uid = item[0]
                            item[1].uid = uid
                            if(!item[1].view) unread++
                            items.push(item[1])
                        })
                        mensajes.value.unread = unread
                        mensajes.value.items = items
                    }
                    
                    
                    resolve(mensajes.value)
                });
                
            }
        })
        
//         onAuthStateChanged(auth, (user) => {
//             if(user){
//                 const q = query(collection(db, 'notificaciones'), 
//                     where ("email", "==", activeUser.email),
//                     where ("view", "==", false))
                
//                 onSnapshot(q, (snapShot) => {
//                     snapShot.docChanges().forEach((change) => {
//                         const obj = change.doc.data()
//                         obj.id = change.doc.id
                        
//                         if(change.type == 'added'){    
//                             mensajes.value.push(obj)
//                         }
//                         if(change.type == 'removed'){
//                             let index = mensajes.value.findIndex(objeto => objeto.id === obj.id);
//                             mensajes.value.splice(index, 1);
//                         }
//                     });
//                 })
//             }
//         })
//         resolve(mensajes.value)
    })
}

export async function setNotifyView (req) {
    req.view = true
    try {
        // set(refb(db, 'notificaciones/user_id_'+req.user_id+'/'+req.uid), req)
        const updates = {};
        updates['notificaciones/user_id_'+req.user_id+'/'+req.uid] = req;
        return update(refb(db), updates);
    } catch (error) {
        console.log(error)
        return false
    }
}