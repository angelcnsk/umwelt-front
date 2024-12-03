import { storeToRefs } from 'pinia'
import { useCapturasStore } from '../stores/capturas'
import { useIdb } from "../composables/idb/useIdb";
import { getCategories, getObservations, getResult, getActa } from 'src/composables/firebase/capturas/nom02/guiaConceptos.js'
import { updateData } from './firebase/firebaseService';

export const useCapturas = () => {
    const capturasStore = useCapturasStore()
    const idb = useIdb();
    const {getDataFromIndexedDB, saveDataToIndexedDB, removeItem} = idb;

    const { 
        getServiceList, saveCaptures, setDateCapture,
        saveSectionFile
    } = capturasStore
    const { servicesList,currentService, categories, fechas_visita, visitSelected, showActa} = storeToRefs(capturasStore)
    
    const fetchCategories = async (params) => {
        try {
            let path = params.product_id == 1 ? 'Nom02Categories' : 'Nom020Categories'

            if(params.visita > 1) path = `${params.service_id}/visita_${visita}/categories`
            console.log('buscar local', path)
            let data = await getDataFromIndexedDB(path);
            if (!data) {
                // Si no hay datos en IndexedDB, obtenerlos desde Firebase
                data = await getCategories(params);
          
                // Guardar los datos en IndexedDB
                await saveDataToIndexedDB(path, data);
              }
              return data;
        } catch (error) {
            console.log('error IDB fetch categories', error)
        }
    }

    const fetchResult = async (params) => {
        try {
            let data = null;
            if(navigator.onLine){
                //firebase
                data = await getResult(params);
                if (data) {
                    // Guardar los datos en IndexedDB
                    await saveDataToIndexedDB(`${params.service_id}/visita_${params.visita}/result`, data);
                }
            } else {
                //caché
                data = await getDataFromIndexedDB(`${params.service_id}/visita_${params.visita}/result`);
            }

            return data;
        } catch (error) {
            console.log('error IDB fetch result', error)
        }
    }

    const fetchObservations = async (params) => {
        try {
            let data = null;
            if(navigator.onLine){
                data = await getObservations(params)
                if(data) await saveDataToIndexedDB(`${params.service_id}/visita_${params.visita}/observations`, data);
            } else {
                data = await getDataFromIndexedDB(`${params.service_id}/visita_${params.visita_id}/observations`);
            }
            return data;
        } catch (error) {
            console.log('error fetch observations', error)
        }
    }

    const fetchActa = async (params) => {
        try {
            let data = null;
            if(navigator.onLine){
                data = await getActa(params)
                if(data) {
                    await saveDataToIndexedDB(`${params.service_id}/visita_${params.visita}/acta`, data.texto)
                    data = data.texto
                }
            } else data = await getDataFromIndexedDB(`${params.service_id}/visita_${params.visita}/acta`);
            return data
        } catch (error) {
            console.log('error fetch acta', error)
        }
    }

    const saveLocalResults = async (params) => {
        const serializableData = JSON.parse(JSON.stringify(params.data));
        await saveDataToIndexedDB(`${params.service_id}/visita_${params.visita}/result`, serializableData);
    }

    const saveLocalObservations = async (params) => {
        // const serializableData = JSON.parse(JSON.stringify(params.data));
        await saveDataToIndexedDB(`${params.service_id}/visita_${params.visita}/observations`, params.data);
    }

    const saveActa = async (params) => {
        const path = `servicios/${params.service_id}/visita_${params.visita}/acta`;

        //se actualiza en firebase
        await updateData(path,{texto:params.data});
        //se actualiza local
        await saveDataToIndexedDB(`${params.service_id}/visita_${params.visita}/acta`, params.data)
    }

    const cleanDataService = async (key) => {
        await removeItem(key);
    }

    return {
        servicesList,currentService,categories,fechas_visita, visitSelected,showActa,
        getServiceList, saveCaptures,  setDateCapture, saveSectionFile, fetchCategories, fetchResult,saveLocalResults, fetchObservations, saveLocalObservations, saveActa, fetchActa, cleanDataService
    }
}