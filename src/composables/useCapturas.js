import { storeToRefs } from 'pinia'
import { useCapturasStore } from '../stores/capturas';
import { useUsersStore } from '../stores/users';
import { useIdb } from "../composables/idb/useIdb";
import { getCategories, getObservations, getResult, getActa, setConceptsValues } from 'src/composables/firebase/capturas/nom02/guiaConceptos.js'
import { updateData } from './firebase/firebaseService';
import { computed } from 'vue';

export const useCapturas = () => {
    const capturasStore = useCapturasStore();
    const userStore = useUsersStore();
    const idb = useIdb();
    const {getDataFromIndexedDB, saveDataToIndexedDB, removeItem} = idb;

    const { 
        getServiceList, saveCaptures, setDateCapture,
        saveSectionFile, getCategoriesBackend
    } = capturasStore;

    const {currentUser} = userStore;
    const { servicesList,currentService, categorias, fechas_visita, visitSelected, showActa, textoActa, serviceSelected, visitas, result,
    pendingResult, pendingObs, observaciones} = storeToRefs(capturasStore)
    
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

    const disableOptions = computed(() => {
        return (opcion,categoria,concepto) => {
            if (opcion === 'si') {
              return categorias.value[categoria].conceptos[concepto].value.includes('no')
            } else if (opcion === 'no') {
              return categorias.value[categoria].conceptos[concepto].value.includes('si') || categorias.value[categoria].conceptos[concepto].value.includes('cumple');
            } else if (opcion === 'cumple') {
              return categorias.value[categoria].conceptos[concepto].value.includes('no') || categorias.value[categoria].conceptos[concepto].value.includes('no_cumple')
            } else if (opcion === 'no_cumple') {
              return categorias.value[categoria].conceptos[concepto].value.includes('cumple') 
            }
        }
    });

    const syncConceptResult = async () => {
        //busco conceptos pendientes de sincronizar
        pendingResult.value = result.value.length >0 ? result.value.filter((item) => item.status && item.status === 'pending') : [];
        
        if(pendingResult.value.length>0){
            pendingResult.value.map(async(pending) => {
                //path de nodo
                const findIndex = result.value.findIndex((item) => item.concepto_id == pending.concepto_id);
                const path = `servicios/${currentService.value.id}/visita_${visitSelected.value.valor}/result/${findIndex}`;
                
                pending.status = !navigator.onLine ? 'pending' : 'completed';
                //se actualiza en idb
                await saveLocalResults({service_id:currentService.value.id, visita:visitSelected.value.valor, data:result.value});
    
                //se actualiza en firebase
                await updateData(path,pending);
                //se elimina elemento del arreglo de pendientes
                pendingResult.value = pendingResult.value.filter((item) => item.concepto_id != pending.concepto_id)
            });  
        }    
    }
    
    const syncObservations = async () => {
        pendingObs.value = categorias.value.filter(cat => cat.id && cat.status === 'pending');
        if(pendingObs.value.length>0){
            const promises = pendingObs.value.map(async(pending) => {
                const findIndex = categorias.value.findIndex((item) => item.id == pending.id);
    
                const path = `servicios/${currentService.value.id}/visita_${visitSelected.value.valor}/observaciones/categoria_id_${categorias.value[findIndex].id}`;
                
                categorias.value[findIndex].observaciones = observaciones.value[`categoria_id_${pending.id}`].texto
                
                await updateData(path,{texto:categorias.value[findIndex].observaciones});
    
                categorias.value.forEach((obj, index) => {
                    if(obj.status) {
                        categorias.value[index] = { ...obj };
                        delete categorias.value[index].status;
                    }
                });
            });
            await Promise.all(promises)
            await saveDataCategories({data:categorias.value,product_id:currentService.value.product_id});
        }
    }

    const changeValue = async (categoria, concepto) => {
        //recibe los indices de cada uno
        const concept = categorias.value[categoria].conceptos[concepto]
        //se busca el concepto en la matriz principal
        const findConcept = result.value.find((item) => item.concepto_id == concept.id)
        
        //se busca el concepto en todas las categorias y se actualiza el valor
        categorias.value.forEach((categoria) => {
            if(categoria.conceptos){
                categoria.conceptos.forEach((concepto) => {
                    if(concept.id == concepto.id) concepto.value = concept.value
                })
            }
        })
        //path de nodo
        const findIndex = result.value.findIndex((item) => item.concepto_id == concept.id)
        const path = `servicios/${currentService.value.id}/visita_${visitSelected.value.valor}/result/${findIndex}`;
        
        const flag = concept.value.includes('no_cumple');
        
        //actualizo los valores en la matriz principal
        findConcept.value = concept.value;
        findConcept.no_cumple = flag?1:0;
        findConcept.status = !navigator.onLine ? 'pending' : 'completed';
        
        const props = {
            value:concept.value, 
            no_cumple:flag?1:0,
            status:!navigator.onLine ? 'pending' : 'completed'
        }
        
        //se actualiza en idb
        await saveLocalResults({service_id:currentService.value.id, visita:visitSelected.value.valor, data:result.value});
    
        //se actualiza en firebase
        await updateData(path,props);   
    }
    
    const saveObservaciones = async (categoria) => {
        //recibe los indices de cada uno y armamos el path
        const path = `servicios/${currentService.value.id}/visita_${visitSelected.value.valor}/observaciones/categoria_id_${categorias.value[categoria].id}`
    
        categorias.value[categoria].status = !navigator.onLine ? 'pending' : 'completed';
        
        const a_observations = categorias.value.reduce((acumulador, categoria) => {
            acumulador[`categoria_id_${categoria.id}`] = { texto: categoria.observaciones };
            return acumulador;
        }, {});
        
        //se guarda en idb
        await saveLocalObservations({service_id:currentService.value.id, visita:visitSelected.value.valor, data:a_observations});
        //guardar status local de categorías
        await saveDataCategories({service_id:currentService.value.id,visita:visitSelected.value.valor, data:categorias.value, product_id:currentService.value.product_id});
        //se guarda en firebase
        await updateData(path,{texto:categorias.value[categoria].observaciones});
    }
    
    const configService = async () => {
        if(currentService.value.id != undefined){
            // categorias.value = []
            setFechas()
            //recupera categorías desde el catálogo
            categorias.value = await fetchCategories({service_id:currentService.value.id,product_id:currentService.value.product_id, visita:visitSelected.value.valor});
            
            //busca si hay resultados en firebase
            result.value = await fetchResult({service_id:currentService.value.id,
            product_id:currentService.value.product_id,visita:visitSelected.value.valor});
            //busca observaciones
            observaciones.value = await fetchObservations({service_id:currentService.value.id, product_id:currentService.value.product_id, visita:visitSelected.value.valor});
            
            //si no existen respuestas previamente guardadas las crea en firebase
            if(result.value === undefined || result.value === null) {
                const a_conceptos = [];
                categorias.value.map((cat) => {
                    if(cat.conceptos){
                        const items = cat.conceptos.map((item) => {
                            return {concepto_id:item.id,service_id:currentService.value.id, value:1,visita_id:visitSelected.value.id,no_cumple:0,user_id:currentUser.value.id}
                        });
                        a_conceptos.push(...items);
                    }
                });
                //filtra listado de conceptos para evitar duplicados por conceptos compartidos
                const uniqueArray = a_conceptos.filter((item, index, self) =>
                    index === self.findIndex((obj) => obj.concepto_id === item.concepto_id)
                );
    
                //guarda en firebase respuestas vacías
                await setConceptsValues({service_id:currentService.value.id, data:uniqueArray, visita:visitSelected.value.valor, product_id:currentService.value.product_id,});
            }
    
            
            //si no existen observaciones para las categorías
            if(observaciones.value === undefined || observaciones.value === null){
                const a_observations = categorias.value.reduce((acumulador, categoria) => {
                    acumulador[`categoria_id_${categoria.id}`] = { texto: categoria.observaciones };
                    return acumulador;
                }, {});
                
                await saveLocalObservations({service_id:currentService.value.id, visita:visitSelected.value.valor, data:a_observations});
                //se guarda en firebase
                if(a_observations){
                    categorias.value.map(async (item, index) => {
                        const path = `servicios/${currentService.value.id}/visita_${visitSelected.value.valor}/observaciones/categoria_id_${categorias.value[index].id}`
    
                        await updateData(path,{texto:''});
                    })
                }
            }
    
            //ejecuta sync de conceptos y observaciones
            await syncConceptResult();
            await syncObservations();
    
            //se relacionan las respuestas con los conceptos correspondientes
            categorias.value.map((cat) => {
                if(observaciones.value){
                    cat.observaciones = (Object.keys(observaciones.value).length > 0 && observaciones.value[`categoria_id_${cat.id}`])  ? observaciones.value[`categoria_id_${cat.id}`].texto : ''
                } else cat.observaciones = ''
                
                if(cat.conceptos){
                    cat.conceptos.forEach((item) => {
                        if(result.value){
                            const match = result.value.find((element) => element.concepto_id == item.id)
                            if(match){
                                item.value = match.value == 1 ? [] : match.value
                            }
                        }
                    });
                }
            });
        }
    }

    return {
        servicesList,currentService,categorias,fechas_visita, visitSelected,showActa,textoActa,serviceSelected, visitas,
        getServiceList, saveCaptures,  setDateCapture, saveSectionFile, fetchCategories, fetchResult,saveLocalResults, fetchObservations, saveLocalObservations, saveActa, fetchActa, cleanDataService, saveDataCategories, saveDates, getDates, setSelectVisitas, setFechas, disableOptions, syncConceptResult, syncObservations, changeValue, saveObservaciones, configService
    }
}