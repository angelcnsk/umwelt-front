import {db, auth} from 'boot/firebase'
import { collection, query, onSnapshot, addDoc, where, updateDoc, doc, getDoc, getDocs, writeBatch } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

export const concepts = ref([])

export async function createGuideConcepts(req) {
    addDoc(collection(db, 'guia_nom_002_servicio'), {
        'global': req.global,
        'concepto_id' : req.concepto_id,
        'categoria_id' : req.categoria_id,
        'value': req.valor,
        'no_cumple':false,
        'user_id': req.user_id,
        'service_id' : req.service_id,
        'visita_id': req.visita_id,
        'created_at': new Date(),
    })
    return true
}

export async function searchGuideConcepts (data) {
    return new Promise((resolve) => {
         onAuthStateChanged(auth, async (user) => {
             if(user){
                const q = query(collection(db, 'guia_nom_002_servicio'), 
                where ("service_id", "==", data.service_id),
                where ("visita_id", "==", data.visita_id))
            
                onSnapshot(q, (snapShot) => {
                    snapShot.docChanges().forEach((change) => {
                        const obj = change.doc.data()
                        obj.id = change.doc.id
                        
                        if(change.type == 'added'){    
                            concepts.value.push(obj)
                        }
                    });
                })

             } else {
                 location.replace('/logout')
             }
         })
         // resolve()
     })
 }