<template>
    <q-card>
        <q-card-section>
            <fechas-component :visitas="visitas" :changeVisit="configService" :categorias="categorias" />
        </q-card-section>
        <q-card-section>
            
            <q-list bordered class="rounded-borders" v-if="service.id != undefined && categorias.length > 0">
                <q-expansion-item
                    group="somegroup"
                    expand-separator
                    icon="ads_click"
                    header-class="text-primary"
                    :label="`${categoria.texto}`" v-for="(categoria,index) in categorias" 
                    :key="index"
                    style="border: .2px solid gray"
                    :model-value="openIndex === index"
                    @click="toggleExpansion(index)"
                >
                <q-separator />
                <div v-if="categoria.conceptos && categoria.conceptos.length > 0" style="height: 150px; overflow-y: scroll; border:1px solid">
                    <div class="q-pa-md" v-for="(concepto,i) in categoria.conceptos" :key="i">
                        <div class="row wrap q-pa-sm">
                            <span class="text-justify"><span class="text-caption">{{ `${concepto.global})`  }}</span> {{concepto.texto  }}</span>
                        </div>
                        <div class="row q-pa-sm" v-if="concepto.value">
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="si" label="Si" color="orange" :disable="disableOptions('si',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="no" label="No" color="orange" :disable="disableOptions('no',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="cumple" label="Cumple" color="orange" :disable="disableOptions('cumple',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="no_cumple" label="No cumple" color="orange" :disable="disableOptions('no_cumple',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="na" label="N.A." color="orange" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="et" label="E.T." color="orange" />
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <q-editor
                        class="q-editor-mb"
                        v-model="categoria.observaciones"
                        :dense="$q.screen.lt.md"
                        :toolbar="toolbar"
                        :fonts="fonts"
                        filled
                        clearable
                        min-height="10rem"
                        dmax-height="20rem"
                        color="red-12"
                        @blur="saveObservaciones(index)"
                    />
                </div>
                </q-expansion-item>
                
                <contentActa :service="service" :categorias="categorias" />
            </q-list>
            <div class="q-pa-md" v-else>
                <q-item style="max-width: 300px">
                <q-item-section avatar>
                    <q-skeleton type="QAvatar" />
                </q-item-section>

                <q-item-section>
                    <q-item-label>
                    <q-skeleton type="text" />
                    </q-item-label>
                    <q-item-label caption>
                    <q-skeleton type="text" width="65%" />
                    </q-item-label>
                </q-item-section>
                </q-item>

                <q-item style="max-width: 300px">
                <q-item-section avatar>
                    <q-skeleton type="QAvatar" />
                </q-item-section>

                <q-item-section>
                    <q-item-label>
                    <q-skeleton type="text" />
                    </q-item-label>
                    <q-item-label caption>
                    <q-skeleton type="text" width="90%" />
                    </q-item-label>
                </q-item-section>
                </q-item>

                <q-item style="max-width: 300px">
                <q-item-section avatar>
                    <q-skeleton type="QAvatar" />
                </q-item-section>

                <q-item-section>
                    <q-item-label>
                    <q-skeleton type="text" width="35%" />
                    </q-item-label>
                    <q-item-label caption>
                    <q-skeleton type="text" />
                    </q-item-label>
                </q-item-section>
                </q-item>
            </div>
            
        </q-card-section>
        
    </q-card>
    
    <modal-acta :show="showActa" @closeModal="getActa" />

</template>

<script setup>
import {ref, computed, onMounted, toRef, inject, provide, defineAsyncComponent, nextTick} from 'vue';
import { useQuasar } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js'
import { setConceptsValues } from 'src/composables/firebase/capturas/nom02/guiaConceptos.js'
import { updateData } from 'src/composables/firebase/firebaseService';

const $q = useQuasar();
const storeCapturas = useCapturas();
const { saveDataCategories, fetchCategories, fetchResult, saveLocalObservations, saveLocalResults, fetchObservations, getDates, fechas_visita, visitSelected, showActa } = storeCapturas;

const contentActa = defineAsyncComponent(() => import('src/components/admin/acta/ActaEditor.vue'))

const modalActa = defineAsyncComponent(() => import('src/components/admin/acta/ModalPrintActa.vue'))

const fechasComponent = defineAsyncComponent(() => import('src/components/admin/capturas/FechasComponent.vue'))

const props = defineProps({
    service: Object
})

inject('statusOnLine')
const currentUser = inject('currentUser')
const categorias = ref([])
const service = toRef(props,'service')

const openIndex = ref(null)

const visitas = ref([])
const observaciones = ref([])
const result = ref([]);
const pendingResult = ref([]);
const pendingObs = ref([])

provide('currentVisit', visitSelected);

const toggleExpansion = async (index) => {
  if (openIndex.value === index) {
    openIndex.value = null; // Cierra el actual si se hace clic en él
  } else {
    openIndex.value = null; // Cierra cualquier otro abierto primero
    await nextTick(); // Espera a que Vue actualice el DOM antes de abrir el nuevo
    openIndex.value = index; // Ahora abre el nuevo
  }
};

const setNoCumple = () => {
    for (const categoria of categorias.value) {
        if (!categoria.conceptos) continue; // Evita iterar si no hay conceptos

        for (const concepto of categoria.conceptos) {
            concepto.no_cumple = concepto.value.includes('no_cumple') ? 1 : 0;
        }
    }
};

const setService = () => {
    //al seleccionar el servicio se buscan el total de visitas y se hace el set para mostrar el select de visitas
    if(service.value.id != undefined){
        visitas.value = []
        // let visita = 0
        const fechas = service.value.fechas.length == 0 ? 1 : service.value.fechas.length
        
        for (let index = 0; index < fechas; index++) {
            visitas.value.push(
                {   valor:service.value.fechas[index].visita, 
                    texto:`Visita ${service.value.fechas[index].visita}`, id:service.value.fechas[index].id
                })
            // visita++
        }
    }
}

    const changeValue = async (categoria, concepto) => {
    //recibe los indices de cada uno
    const concept = categorias.value[categoria].conceptos[concepto]
    //se busca el concepto en la matriz principal
    const findConcept = result.value.find((item) => item.concepto_id == concept.id)
    
    //se busca el concepto en todas las categorias y se actualiza el valor
    setNoCumple();
    // for (const categoria of categorias.value) {
    //     if (!categoria.conceptos) continue; // Evita iterar si no hay conceptos

    //     for (const concepto of categoria.conceptos) {
    //         if (concept.id === concepto.id) concepto.value = concept.value;
    //         concepto.no_cumple = concepto.value.includes('no_cumple') ? 1 : 0;
    //     }
    // }
    //path de nodo
    const findIndex = result.value.findIndex((item) => item.concepto_id == concept.id)
    const path = `servicios/${service.value.id}/visita_${visitSelected.value.valor}/result/${findIndex}`;
    
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
    await saveLocalResults({service_id:service.value.id, visita:visitSelected.value.valor, data:result.value});

    //se actualiza en firebase
    await updateData(path,props);   
}

const saveObservaciones = async (categoria) => {
    //recibe los indices de cada uno y armamos el path
    // const path = `servicios/${service.value.id}/visita_${visitSelected.value.valor}/observaciones/categoria_id_${categorias.value[categoria].id}`

    categorias.value[categoria].status = !navigator.onLine ? 'pending' : 'completed';
    
    const a_observations = categorias.value.reduce((acumulador, categoria) => {
        acumulador[`categoria_id_${categoria.id}`] = { texto: categoria.observaciones };
        return acumulador;
    }, {});
    
    //se guarda en idb
    await saveLocalObservations({service_id:service.value.id, visita:visitSelected.value.valor, data:a_observations});
    //guardar status local de categorías
    await saveDataCategories({service_id:service.value.id,visita:visitSelected.value.valor, data:categorias.value, product_id:service.value.product_id});
    //se guarda en firebase
    // await updateData(path,{texto:categorias.value[categoria].observaciones});
    
}

const configService = async () => {
    if(service.value.id != undefined){
        // categorias.value = []
        setFechas()
        //recupera categorías desde el catálogo
        categorias.value = await fetchCategories({service_id:service.value.id,product_id:service.value.product_id, visita:visitSelected.value.valor});
        
        //busca si hay resultados en firebase
        result.value = await fetchResult({service_id:service.value.id,
        product_id:service.value.product_id,visita:visitSelected.value.valor});
        //busca observaciones
        observaciones.value = await fetchObservations({service_id:service.value.id, product_id:service.value.product_id, visita:visitSelected.value.valor});
        
        //si no existen respuestas previamente guardadas las crea en firebase
        if(result.value === undefined || result.value === null) {
            const a_conceptos = [];
            categorias.value.map((cat) => {
                if(cat.conceptos){
                    const items = cat.conceptos.map((item) => {
                        return {concepto_id:item.id,service_id:service.value.id, value:1,visita_id:visitSelected.value.id,no_cumple:0,user_id:currentUser.value.id}
                    });
                    a_conceptos.push(...items);
                }
            });
            //filtra listado de conceptos para evitar duplicados por conceptos compartidos
            const uniqueArray = a_conceptos.filter((item, index, self) =>
                index === self.findIndex((obj) => obj.concepto_id === item.concepto_id)
            );

            //guarda en firebase respuestas vacías
            await setConceptsValues({service_id:service.value.id, data:uniqueArray, visita:visitSelected.value.valor, product_id:service.value.product_id,});
        }

        
        //si no existen observaciones para las categorías
        if(observaciones.value === undefined || observaciones.value === null){
            const a_observations = categorias.value.reduce((acumulador, categoria) => {
                acumulador[`categoria_id_${categoria.id}`] = { texto: categoria.observaciones };
                return acumulador;
            }, {});
            
            await saveLocalObservations({service_id:service.value.id, visita:visitSelected.value.valor, data:a_observations});
            //se guarda en firebase
            if(a_observations){
                categorias.value.map(async (item, index) => {
                    const path = `servicios/${service.value.id}/visita_${visitSelected.value.valor}/observaciones/categoria_id_${categorias.value[index].id}`

                    await updateData(path,{texto:''});
                })
            }
        }

        //ejecuta sync de conceptos y observaciones
        await syncConceptResult();
        await syncObservations();
            // console.log('resultados', result.value)

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
                            item.value = match.value == 1 || match.value == undefined ? [] : match.value;
                        }
                    }
                });
            }
        });
    }
}

const setFechas = async () => {
    if(service.value.fechas != undefined){
        const data = await getDates({service_id:service.value.id,
            visita:visitSelected.value.valor
        });
        if(data){
            fechas_visita.value = data
        } else {
            fechas_visita.value = service.value.fechas.find(visit => visit.id == visitSelected.value.id)
        }
        
    }
}

const syncConceptResult = async () => {
    //busco conceptos pendientes de sincronizar
    pendingResult.value = result.value.filter((item) => item.status && item.status === 'pending');
    // console.log('async', result.value);
    // console.log('async2', pendingResult.value);
    if(pendingResult.value.length>0){
        pendingResult.value.map(async(pending) => {
            //path de nodo
            const findIndex = result.value.findIndex((item) => item.concepto_id == pending.concepto_id);
            const path = `servicios/${service.value.id}/visita_${visitSelected.value.valor}/result/${findIndex}`;
            
            pending.status = !navigator.onLine ? 'pending' : 'completed';
            //se actualiza en idb
            await saveLocalResults({service_id:service.value.id, visita:visitSelected.value.valor, data:result.value});

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

            const path = `servicios/${service.value.id}/visita_${visitSelected.value.valor}/observaciones/categoria_id_${categorias.value[findIndex].id}`;
            
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
        await saveDataCategories({data:categorias.value,product_id:service.value.product_id});
    }
}

// const bloquearVisita = computed(() => {
//     const splitDate = fechas_visita.value.to.split('-')
//     const fecha_final = date.buildDate({year:splitDate[0], month:splitDate[1], date:splitDate[2]})
//     return new Date() < fecha_final
// })

// const setLocal = async () => {
//     if(service.value.categorias != undefined){
//         const data = JSON.parse(localStorage.getItem(`service_${service.value.id}_categorias_visita_${visitSelected.value.valor}`))
        
//         if(data != null){
//             categorias.value = data.categorias
//             visitSelected.value = visitas.value[0]
//             fechas_visita.value = data.fechas
//         } else categorias.value = service.value.categorias;
//     }
// }



const disableOptions = computed(() => {
    return (opcion,categoria,concepto) => {
        if (opcion === 'si') {
          return categorias.value[categoria].conceptos[concepto].value.includes('no')
            // || categorias.value[categoria].conceptos[concepto].value.includes('no_cumple');
        } else if (opcion === 'no') {
          return categorias.value[categoria].conceptos[concepto].value.includes('si') || categorias.value[categoria].conceptos[concepto].value.includes('cumple');
        } else if (opcion === 'cumple') {
          return categorias.value[categoria].conceptos[concepto].value.includes('no') 
        //   || categorias.value[categoria].conceptos[concepto].value.includes('no_cumple');
        } else if (opcion === 'no_cumple') {
          return categorias.value[categoria].conceptos[concepto].value.includes('cumple') 
        //   || categorias.value[categoria].conceptos[concepto].value.includes('si');
        }
    }
})

const toolbar = ref([
    [
        {
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
        },
        
    ],
    ['removeFormat'],
    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
    ['undo', 'redo'],
])
const fonts = ref({
    arial: 'Arial',
    arial_black: 'Arial Black',
    comic_sans: 'Comic Sans MS',
    courier_new: 'Courier New',
    impact: 'Impact',
    lucida_grande: 'Lucida Grande',
    times_new_roman: 'Times New Roman',
    verdana: 'Verdana'
})

const getActa = () => {
    showActa.value = false    
}

onMounted( async () => {
    setService('load')
})

</script>

<style>
@media (max-width: 390px) {
    .q-editor-mb{
        max-width: 240px;
    }
}

@media (max-width: 900px) {
    .q-editor-mb{
        max-width: 650px;
    }
}

</style>