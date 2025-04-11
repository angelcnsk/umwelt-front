import { storeToRefs } from 'pinia'
import { useCapturasStore } from '../stores/capturas';
import { useUsers } from '../composables/useUsers';
import { useIdb } from "../composables/idb/useIdb";
import { getCategories, getObservations, getResult, getActa, setConceptsValues } from 'src/composables/firebase/capturas/nom02/guiaConceptos.js'
import { updateData } from './firebase/firebaseService';
import { computed } from 'vue';
import { useQuasar } from "quasar";

export const useCapturas = () => {
    const $q = useQuasar();
    const {AppActiveUser} = useUsers()
    const capturasStore = useCapturasStore();
    const idb = useIdb();
    const {getDataFromIndexedDB, saveDataToIndexedDB, removeItem} = idb;
    

    const { 
        getServiceList, saveCaptures, setDateCapture,
        saveSectionFile, getCategoriesBackend, serviceAddVisit
    } = capturasStore;

    const { servicesList,currentService, categorias, fechas_visita, visitSelected, showActa, textoActa, serviceSelected, visitas, result,
    pendingResult, pendingObs, observaciones, tab, recipientes, recipienteSelected} = storeToRefs(capturasStore)
    
    const fetchCategories = async (params) => {
        try {
            let data = null;
            let path = tab.value == 'inspeccion' ? 'Nom02Categories' : tab.value == 'guia22' ? 'Nom020Categories/22' : 'Nom020Categories/25';
            
            if(params.visita > 1){
                if(params.product_id == 1){
                    path = `${params.service_id}/visita_${params.visita}/categories`
                } else {
                    path = `${params.service_id}/visita_${params.visita}/container_${params.container_id}/categories/${tab.value}`
                }
            }
            data = await getDataFromIndexedDB(path);
            
            if (!data && params.visita == 1) {
                params.path = tab.value == 'inspeccion' ? 'catalogos/nom02' : tab.value == 'guia22' ? 'catalogos/nom020/22' : 'catalogos/nom020/25';
                // Si no hay datos en IndexedDB, obtenerlos desde Firebase
                data = await getCategories(params);
                
                if(!data){
                    //si no existen en fb se buscan en el backend
                    data = await getCategoriesBackend({service_id:params.service_id, visita:params.visita});
                    if(data.status == 200) data = data.data.categorias
                }
                // console.log('no existen en backend visita1', data)
                // data = data.filter(cat => cat.conceptos && cat.conceptos.length>0)
                // Guardar los datos en IndexedDB
                await saveDataToIndexedDB(path, data);
            } else if (!data && params.visita > 1){
                //buscar categorías en fb
                params.path = `${params.service_id}/visita_${params.visita}/container_${params.container_id}/categories/${tab.value}`
                
                data = await getCategories(params);

                if(!data){
                    //si no existen en fb se buscan en el backend
                    data = await getCategoriesBackend({service_id:params.service_id, visita:params.visita, container_id:params.container_id});
                    if(data.status == 200) data = data.data.categorias
                }
            }
                await saveDataToIndexedDB(path, data);
                return data;
        } catch (error) {
            console.log('error IDB fetch categories', error)
        }
    }

    const fetchResult = async (params) => {
        try {
            let data = await getDataFromIndexedDB(params.path);
            
            if(!data){
                //firebase
                data = await getResult(params);
                if (data) {
                    // Guardar los datos en IndexedDB
                    await saveDataToIndexedDB(params.path, data);
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
                data = await getObservations({path:`servicios/${params.service_id}/visita_${params.visita}/observaciones`})
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
        await saveDataToIndexedDB(params.path, serializableData);
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
        // let visita = 0
        const fechas = currentService.value.fechas.length == 0 ? 1 : currentService.value.fechas.length
        
        for (let index = 0; index < fechas; index++) {
            visitas.value.push(
                {   valor:currentService.value.fechas[index].visita, 
                    texto:`Visita ${currentService.value.fechas[index].visita}`, id:currentService.value.fechas[index].id
                })
            // visita++
        }
        visitSelected.value = visitas.value[0];   
    }

    const setFechas = async () => {
        if(currentService.value.fechas != undefined){
            fechas_visita.value = [];
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

                let path = '';
                
                if(currentService.value.product_id == 1){
                    path = `servicios/${currentService.value.id}/visita_${visitSelected.value.valor}/result/${findIndex}`;
                } else {
                    path = `${currentService.value.id}/visita_${visitSelected.value.valor}/contenedor_${recipienteSelected.value.value}/${tab.value}/result/${findIndex}`;
                }
                
                
                pending.status = !navigator.onLine ? 'pending' : 'completed';
                //se actualiza en idb
                await saveLocalResults({service_id:currentService.value.id, data:result.value, path:`${currentService.value.id}/visita_${visitSelected.value.valor}/result`});
    
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
                    if(concept.id == concepto.id){
                        concepto.value = concept.value;
                        concepto.observaciones = concept.observaciones;
                        concepto.no_cumple = concept.value.includes('no_cumple') ? 1:0;
                    }
                })
            }
        })
        //path de nodo
        const findIndex = result.value.findIndex((item) => item.concepto_id == concept.id)
        let path = '';
        if(currentService.value.product_id == 1){
            path = `${currentService.value.id}/visita_${visitSelected.value.valor}/result`;
        } else {
            path = `${currentService.value.id}/visita_${visitSelected.value.valor}/contenedor_${recipienteSelected.value.value}/${tab.value}/result`;
        }
        
        
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

        if(currentService.value.product_id == 2){
            findConcept.observaciones = props.observaciones = concept.observaciones;
        } 
        
        //se actualiza en idb
        await saveLocalResults({path:path, data:result.value});
    
        //se actualiza en firebase
        await updateData(`servicios/${path}/${findIndex}`,props);   
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
    
    const configNom02 = async () => {
        //se limpian los datos de la visita
        categorias.value = [];
        result.value = [];
        observaciones.value = [];
        
        $q.loading.show({
            message: 'Cargando servicio...'
        });
        if(currentService.value.id != undefined){
            try {
                // categorias.value = []
                await setFechas()
                //recupera categorías desde el catálogo
                console.log('visitSelected.value__', visitSelected.value)
                categorias.value = await fetchCategories({service_id:currentService.value.id,product_id:currentService.value.product_id, visita:visitSelected.value.valor});
                
                const localPath = `${currentService.value.id}/visita_${visitSelected.value.valor}/result`
                //busca si hay resultados en firebase
                result.value = await fetchResult({path:localPath});
                //busca observaciones
                observaciones.value = await fetchObservations({service_id:currentService.value.id, product_id:currentService.value.product_id, visita:visitSelected.value.valor});
                
                //si no existen respuestas previamente guardadas las crea en firebase
                if ((result.value === undefined || result.value === null) && (categorias.value && categorias.value.length > 0)) {
                    const a_conceptos = [];
                    categorias.value.map((cat) => {
                        if(cat.conceptos){
                            const items = cat.conceptos.map((item) => {
                                return {concepto_id:item.id,service_id:currentService.value.id, value:1,visita_id:visitSelected.value.id,no_cumple:0,user_id:AppActiveUser.value.id}
                            });
                            a_conceptos.push(...items);
                        }
                    });
                    //filtra listado de conceptos para evitar duplicados por conceptos compartidos
                    const uniqueArray = a_conceptos.filter((item, index, self) =>
                        index === self.findIndex((obj) => obj.concepto_id === item.concepto_id)
                    );
                    result.value = uniqueArray
                    
                    //guarda en firebase respuestas vacías
                    await setConceptsValues({
                        path:`servicios/${localPath}`,
                        data:uniqueArray
                    });
                }
        
                
                //si no existen observaciones para las categorías
                if(observaciones.value === undefined || observaciones.value === null && (categorias.value && categorias.value.length>0)){
                    const a_observations = categorias.value.reduce((acumulador, categoria) => {
                        acumulador[`categoria_id_${categoria.id}`] = { texto: categoria.observaciones };
                        return acumulador;
                    }, {});
                    
                    await saveLocalObservations({service_id:currentService.value.id, visita:visitSelected.value.valor, data:a_observations});
                    //se guarda en firebase
                    if(a_observations){
                        await Promise.all(
                            categorias.value.map(async (item, index) => {
                                const path = `servicios/${currentService.value.id}/visita_${visitSelected.value.valor}/observaciones/categoria_id_${categorias.value[index].id}`
            
                                await updateData(path,{texto:''});
                            })
                        )
                        observaciones.value = a_observations;
                    }
                }
        
                //ejecuta sync de conceptos y observaciones
                if(result.value.length && observaciones.value.length && categorias.value.length){
                    await syncConceptResult();
                    await syncObservations();
                }
        
                //se relacionan las respuestas con los conceptos correspondientes
                categorias.value.map((cat) => {
                    if(observaciones.value){
                        cat.observaciones = (Object.keys(observaciones.value).length > 0 && observaciones.value[`categoria_id_${cat.id}`])  ? observaciones.value[`categoria_id_${cat.id}`].texto : ''
                    } else cat.observaciones = ''
                    
                    if(cat.conceptos){
                        cat.conceptos.forEach((item) => {
                            if(result.value){
                                const match = result.value.find((element) => element.concepto_id == item.id);
                                
                                if(match){
                                    item.value = (match.value == 1 || !match.value) ? [] : match.value;
                                    item.no_cumple = (match.value == 1 || !match.value) ? 0 : match.value.includes('no_cumple') ? 1 : 0;
                                }
                            }
                        });
                    }
                });
                $q.loading.hide();
            } catch (error) {
                $q.loading.hide();
                console.log('Error al cargar servicio en configNom02:', error.message, error.stack);
            }
        }
    }

    const configNom020 = async () => {
        //se limpian los datos de la visita
        categorias.value = [];
        result.value = [];
        observaciones.value = [];
        
        $q.loading.show({
            message: 'Cargando servicio...'
        });

        if(recipienteSelected.value != null){
            try {
                await setFechas()

                //recupera categorías desde el catálogo
                categorias.value = await fetchCategories({service_id:currentService.value.id,product_id:currentService.value.product_id, visita:visitSelected.value.valor, container_id:recipienteSelected.value.id});

                categorias.value = categorias.value.filter(cat => cat.conceptos && cat.conceptos.length>0);
                
                const localPath = `${currentService.value.id}/visita_${visitSelected.value.valor}/contenedor_${recipienteSelected.value.value}/${tab.value}`
                
                //busca si hay resultados en firebase
                result.value = await fetchResult({path:`${localPath}/result`});
                
                //si no existen respuestas previamente guardadas las crea en firebase
                if(result.value === undefined || result.value === null && (categorias.value && categorias.value.length>0)) {
                    const a_conceptos = [];
                    categorias.value.map((cat) => {
                        if(cat.conceptos){
                            const items = cat.conceptos.map((item) => {
                                return {concepto_id:item.id,service_id:currentService.value.id, value:1,visita_id:visitSelected.value.id,no_cumple:0,user_id:AppActiveUser.value.id,
                                observaciones:''    
                                }
                            });
                            a_conceptos.push(...items);
                        }
                    });
                    //filtra listado de conceptos para evitar duplicados por conceptos compartidos
                    const uniqueArray = a_conceptos.filter((item, index, self) =>
                        index === self.findIndex((obj) => obj.concepto_id === item.concepto_id)
                    );
                    
                    result.value = uniqueArray
                    //guarda en firebase respuestas vacías
                    await setConceptsValues({
                        path:`servicios/${localPath}/result`,
                        data:uniqueArray, 
                    });
                }
        
                //ejecuta sync de conceptos y observaciones
                if(result.value != null && result.value.length && categorias.value.length){
                    await syncConceptResult();
                }
        
                //se relacionan las respuestas con los conceptos correspondientes
                categorias.value.map((cat) => {
                    if(cat.conceptos){
                        cat.conceptos.forEach((item) => {
                            if(result.value){
                                const match = result.value.find((element) => element.concepto_id == item.id)
                                if(match){
                                    item.value = (match.value == 1 || !match.value) ? [] : match.value
                                    item.no_cumple = (match.value == 1 || !match.value) ? 0 : match.value.includes('no_cumple') ? 1 : 0;
                                    item.observaciones = match.observaciones;
                                }
                            }
                        });
                    }
                });
                $q.loading.hide();
            } catch (error) {
                $q.loading.hide();
                console.log('Error al cargar servicio en configNom02:', error.message, error.stack);
            }
        }
    }

    const setContainer = async () => {
        recipientes.value = [];
        recipienteSelected.value = null
        const filter = serviceSelected.value.recipientes.filter((item) => item.visita_id === visitSelected.value.id );

        recipientes.value = filter.map((item) => ({
            value: item.id,
            texto: item.name
        }));
    }

    return {
        servicesList,currentService, categorias,fechas_visita, visitSelected,showActa,textoActa,serviceSelected, visitas,tab,recipienteSelected,recipientes,getServiceList, saveCaptures,  setDateCapture, saveSectionFile, fetchCategories, fetchResult,saveLocalResults, fetchObservations, saveLocalObservations, saveActa, fetchActa, cleanDataService, saveDataCategories, saveDates, getDates, setSelectVisitas, setFechas, disableOptions, syncConceptResult, syncObservations, changeValue, saveObservaciones, configNom02, configNom020, setContainer, serviceAddVisit
    }
}