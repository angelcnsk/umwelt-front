import { defineStore } from 'pinia'
import { auth, db } from "boot/firebase";
import { collection, query, onSnapshot, addDoc, where, updateDoc } from "firebase/firestore";

export const useNotificacionesStore = defineStore('notificaciones', {
    state: () => {
        return { 
            notifications:[]
        }
    },
    actions:{
        async launchNotify (req){
            
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
        },

        async getNotify(){
            setTimeout(() => {
                const q = query(collection(db, 'notificaciones'), 
                    where ("firebase_id", "==", auth.currentUser.uid),
                    where ("view", "==", false)
                )
                
                onSnapshot(q, (snapShot) => {
                    snapShot.docChanges().forEach((change) => {
                        const obj = change.doc.data()
                        obj.id = change.doc.id
                        if(change.type == 'added'){    
                            this.notifications.push(obj)
                        }
                        if(change.type == 'modified'){
                            if(obj.view){
                                let index = this.notifications.findIndex(objeto => objeto.id === obj.id);
                                this.notifications.splice(index, 1);
                            }
                        }
                    });
                })
            }, 900);
        },

        setNotifyView(req){
            req.view = true
            const ref = db.collection('notificaciones')
            console.log(ref)
            // ref.updateDoc(req).catch((e) => console.log('error view notify', e))
        }
    }
})