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
        saveSectionFile, getCategoriesBackend
    } = capturasStore
    const { servicesList,currentService, categories, fechas_visita, visitSelected, showActa, textoActa, serviceSelected, visitas, result,
    pendingResult, pendingObs} = storeToRefs(capturasStore)
    
    const fetchCategories = async (params) => {
        try {
            let path = params.product_id == 1 ? 'Nom02Categories' : 'Nom020Categories'

            if(params.visita > 1) path = `${params.service_id}/visita_${params.visita}/categories`
            
            let data = await getDataFromIndexedDB(path);
            if (!data) {
                // Si no hay datos en IndexedDB, obtenerlos desde Firebase
                data = await getCategories(params);
                if(!data){
                    data = await getCategoriesBackend({service_id:params.service_id, visita:params.visita});
                    if(data.status == 200) data = data.data.categorias
                }
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
            let data = await getDataFromIndexedDB(`${params.service_id}/visita_${params.visita}/result`);

            if(!data){
                //firebase
                data = await getResult(params);
                if (data) {
                    // Guardar los datos en IndexedDB
                    await saveDataToIndexedDB(`${params.service_id}/visita_${params.visita}/result`, data);
                }
            } 

            return data;
        } catch (error) {
            console.log('error IDB fetch result', error)
        }
    }

    const fetchObservations = async (params) => {
        try {
            let data = await getDataFromIndexedDB(`${params.service_id}/visita_${params.visita}/observations`);

            if(!data){
                data = await getObservations(params)
                if(data) await saveDataToIndexedDB(`${params.service_id}/visita_${params.visita}/observations`, data);
            } 
            return data;
        } catch (error) {
            console.log('error fetch observations', error)
        }
    }

    const fetchActa = async (params) => {
        try {
            let data = await getDataFromIndexedDB(`${params.service_id}/visita_${params.visita}/acta`);
            
            if(!data){
                data = await getActa(params)
                if(data) {
                    await saveDataToIndexedDB(`${params.service_id}/visita_${params.visita}/acta`, data.texto)
                    data = data.texto
                }
            }
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
        const serializableData = JSON.parse(JSON.stringify(params.data));
        await saveDataToIndexedDB(`${params.service_id}/visita_${params.visita}/observations`, serializableData);
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

    const saveDataCategories = async (params) => {
        try {
            let path = params.product_id == 1 ? 'Nom02Categories' : 'Nom020Categories';
            const serializableData = JSON.parse(JSON.stringify(params.data));
            await saveDataToIndexedDB(path, serializableData);
        } catch (error) {
            console.log('error al guardar categories local', error)
        }
    }

    const saveDates = async (params) => {
        try {
            const path = `${params.service_id}/visita_${params.visita}/fechas`;
            const serializableData = JSON.parse(JSON.stringify(params.data));
            await saveDataToIndexedDB(path, serializableData);
        } catch (error) {
            console.log('error al guardar fechas', error)
        }
    }

    const getDates = async (params) => {
        try {
            return await getDataFromIndexedDB(`${params.service_id}/visita_${params.visita}/fechas`);
        } catch (error) {
            console.log('error al obtener fechas', error)
        }
    }

    const setSelectVisitas = () => {
        visitas.value = []
        let visita = 0
        const fechas = currentService.value.fechas.length == 0 ? 1 : currentService.value.fechas.length
        
        for (let index = 0; index < fechas; index++) {
            visitas.value.push(
                {   valor:currentService.value.fechas[index].visita, 
                    texto:`Visita ${currentService.value.fechas[index].visita}`, id:currentService.value.fechas[index].id
                })
            visita++
        }
    }

    const setFechas = async (value) => {
        console.log(visitSelected.value)
        if(currentService.value.fechas != undefined){
            const data = await getDates({service_id:currentService.value.id,
                visita:visitSelected.value.valor
            });
            if(data){
                fechas_visita.value = data
            } else {
                fechas_visita.value = currentService.value.fechas.find(visit => visit.id == visitSelected.value.id)
            }
        }
    }


    return {
        servicesList,currentService,categories,fechas_visita, visitSelected,showActa,textoActa,serviceSelected, visitas,
        getServiceList, saveCaptures,  setDateCapture, saveSectionFile, fetchCategories, fetchResult,saveLocalResults, fetchObservations, saveLocalObservations, saveActa, fetchActa, cleanDataService, saveDataCategories, saveDates, getDates, setSelectVisitas, setFechas
    }
}