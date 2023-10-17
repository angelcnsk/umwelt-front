import {db, auth} from 'boot/firebase'
import { collection, query, onSnapshot, addDoc, where, updateDoc, doc, getDocs} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

export const collection2 = ref([]);

export async function createGuideConcepts(req) {
    return new Promise(async (resolve) => {
        // setTimeout(() => {
        //     console.log('los crea')
        //     collection2.value.push(req)
        // }, 3000);
        await addDoc(collection(db, 'guia_nom_002_servicio'), {
            'global': req.global,
            'categoria_id': req.categoria_id,
            'concepto_id' : req.concepto_id,
            'value': req.valor,
            'no_cumple':false,
            'user_id': req.user_id,
            'service_id' : req.service_id,
            'visita_id': req.visita_id,
            'created_at': new Date(),
        })
    })
    
}

export async function observacionesCategorias(req) {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if(user){
                const observaciones = []
                // console.log('llega a service_categoria?')
                
                async function getCategorias(params) {
                    const q = query(collection(db, 'observaciones_categorias'), 
                        where ("service_id", "==", req.service_id),
                        where ("visita_id", "==", req.visita_id),
                        where('categoria_id', '==', req.categoria_id)
                    )
                    return await getDocs(q);
                }
                const querySnapshot = await getCategorias();
                
                //si no lo encuentra lo crea
                if(querySnapshot.empty){
                    const nuevaObservacion = await addDoc(collection(db, 'observaciones_categorias'), {
                        'categoria_id' : req.categoria_id,
                        'user_id': req.user_id,
                        'service_id' : req.service_id,
                        'visita_id': req.visita_id,
                        'texto': req.observaciones,
                        'created_at': new Date(),
                    })
                    // console.log('crea la observación', nuevaObservacion)
                    observaciones.push({
                        uid:nuevaObservacion.id,
                        categoria_id:req.categoria_id,
                        visita_id: req.visita_id,
                    })
                } else {
                    querySnapshot.forEach((doc) => {
                        let observacion = doc.data()
                        observacion.uid = doc.id
                        observaciones.push(observacion)
                    });
                    
                }
                resolve(observaciones)
            } else {
                location.replace('/logout')
            }
        })
        // resolve()
    })
}

export function getGuideConcepts (data) {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
             if(user){
                const q = query(collection(db, 'guia_nom_002_servicio'), 
                where ("service_id", "==", data.service_id),
                where ("visita_id", "==", data.visita_id))
            
                onSnapshot(q, (snapShot) => {
                    snapShot.docChanges().forEach((change) => {
                        const obj = change.doc.data()
                        obj.uid = change.doc.id
                        // console.log('objeto encontrado', obj)
                        if(change.type == 'added'){
                            if(collection2.value.length == 0)collection2.value.push(obj)
                            if(!collection2.value.includes(obj)){
                                collection2.value.push(obj)
                            }
                            // console.log('después de encontrar',concepts.value.length)
                        }
                    });
                })
                console.log('se ejecutó búsqueda', collection2.value)
                resolve(collection2.value)
             } else {
                 location.replace('/logout')
             }
            //  console.log('cosas', concepts.value)
        })
        // console.log('los obtiene')
        // setTimeout(() => {
        //     collection2.value.push(true)
        //     resolve(collection2.value)
        // }, 4000);
    })
}

export async function saveConceptValue(req) {
    try {
        updateDoc(doc(db,'guia_nom_002_servicio',req.uid), {value:req.value, user_id:req.user_id})
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function saveObservation(req) {
    try {
        updateDoc(doc(db,'observaciones_categorias',req.uid), {texto:req.texto, user_id:req.user_id})
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}