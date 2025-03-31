import {db, auth} from 'boot/firebase'
import { collection, query, addDoc, where, updateDoc, doc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

export const documents = ref([])

export async function createDocument(req) {
    addDoc(collection(db, 'documentos_servicio'), {
        'global': req.global,
        'doc_id' : req.doc_id,
        'seccion_id' : req.seccion_id,
        'value': '',
        'user_id': req.user_id,
        'service_id' : req.service_id,
        'created_at': new Date(),
    })
    return true
}

export async function searchDocuments (obj) {
   return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if(user){
                const documentCollection = collection(db, 'documentos_servicio')
                const q = query(documentCollection, where('service_id',"==",obj.service_id))
                const querySnapShot = await getDocs(q)
                
                if(querySnapShot.empty) resolve()
                documents.value = []
                querySnapShot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    const row = doc.data()
                    row.uid = doc.id
                    documents.value.push(row)
                });

                resolve(documents.value)
                
                
            } else {
                location.replace('/logout')
            }
        })
        // resolve()
    })
}

export async function updateRowDoc (objUpdate) {
    try {
        objUpdate.map(async (req) => {
            updateDoc(doc(db,'documentos_servicio',req.uid), {value:req.filled_i, user_id:req.user_id})
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}