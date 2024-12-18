import {auth, storage} from 'boot/firebase'
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { useServicios } from "../useServicios";

const serviceStore = useServicios()
const { saveSectionFile, removeFile } = serviceStore

export async function loadFile(params) {
    const storage = getStorage();
    
    //se sustituye @ y se crea el path de la imagen
      
    let folderPath = `services/service_${params.service_id}/${params.files.name}`
    
    // Create a storage reference from our storage service
    const storageRef = ref(storage,`${folderPath}`);

    let error = false
    const upload = await uploadBytes(storageRef, params.files)
    console.log(upload)
    
    if(upload.metadata != undefined){
        return await saveSectionFile({path:`${import.meta.env.VITE_bucket}${upload.metadata.fullPath}`, service_id:params.service_id, storageId:upload.metadata.md5Hash, name: params.files.name})
    } else {
        if (upload.error != undefined || upload.code != undefined) 
        return {data:{error:true}}
    }
    
}

export async function destroyFile(params) {
    const storage = getStorage();  
    let folderPath = `services/service_${params.service_id}/${params.file}`
    
    // Create a storage reference from our storage service
    const desertRef = ref(storage,`${folderPath}`);   

    try {
        const deleteFile = await deleteObject(desertRef)
        if(deleteFile === undefined){
            return await removeFile({id:params.id})
        } 
    }
    catch (error) {
        return {data:{error:true}}
    }
}

export async function storeActa(params) {
    const storage = getStorage();
    let folderPath = `services/service_${params.service_id}/actas/acta_visita_${params.visita}_${params.date}.txt`
    
    // Create a storage reference from our storage service
    const storageRef = ref(storage,`${folderPath}`);

    let error = false
    const upload = await uploadBytes(storageRef, params.file)
    console.log(upload)
    
    if(upload.metadata != undefined){
        return {path:`${import.meta.env.VITE_bucket}${upload.metadata.fullPath}`, storageId:upload.metadata.md5Hash}
    } else {
        if (upload.error != undefined || upload.code != undefined) 
        return {data:{error:true}}
    }
}