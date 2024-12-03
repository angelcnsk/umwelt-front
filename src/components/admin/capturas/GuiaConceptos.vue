<template>
    <q-card>
        <q-card-section>
            <fechas-component :visitas="visitas" :changeVisit="configService" />
        </q-card-section>
        <q-card-section>
            
            <q-list bordered class="rounded-borders" v-if="service.id != undefined && categorias.length > 0">
                <q-expansion-item
                    group="somegroup"
                    expand-separator
                    icon="ads_click"
                    header-class="text-primary"
                    :label="`${categoria.texto}`" v-for="(categoria,index) in categorias" :key="index"
                    style="border: .2px solid gray"
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
import {ref, computed, watch, onMounted, toRef, inject, provide, defineAsyncComponent} from 'vue';
import { useQuasar, date } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js'
import { setConceptsValues } from 'src/composables/firebase/capturas/nom02/guiaConceptos.js'
import { storeActa } from "src/composables/firebase/storage";
import { updateData } from 'src/composables/firebase/firebaseService';

const $q = useQuasar();
const storeCapturas = useCapturas();
const { saveCaptures, fetchCategories, fetchResult, saveLocalObservations, saveLocalResults, fetchObservations, fechas_visita, visitSelected } = storeCapturas;

const contentActa = defineAsyncComponent(() => import('src/components/admin/acta/Acta.vue'))

const modalActa = defineAsyncComponent(() => import('src/components/admin/acta/ModalPrintActa.vue'))

const fechasComponent = defineAsyncComponent(() => import('src/components/admin/capturas/FechasComponent.vue'))

const props = defineProps({
    service: Object
})

const offline = inject('statusOnLine')
const currentUser = inject('currentUser')
const categorias = ref([])
const service = toRef(props,'service')

const showActa = ref(false)
const dataActa = ref({})

const visitas = ref([])

const timeStamp = Date.now()
const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')
// const visitSelected = ref(null)

const observaciones = ref([])
const result = ref([]);

provide('currentVisit', visitSelected);

const setNoCumple = () => {
    //se recorren los conceptos y si alguno incluye la opción no cumple, se guarda bandera para identificar puntos que no cumplen
    return new Promise((resolve) => {
        categorias.value.forEach(categoria => {
            if(categoria.conceptos){
                categoria.conceptos.forEach(concepto => {
                    if(concepto.value.includes('no_cumple')) concepto.no_cumple = 1
                    else concepto.no_cumple = 0
                })
            }
        });
        resolve()
    })
}

const setService = (type) => {
    //al seleccionar el servicio se buscan el total de visitas y se hace el set para mostrar el select de visitas
    if(service.value.id != undefined){
        visitas.value = []
        let visita = 0
        const fechas = service.value.fechas.length == 0 ? 1 : service.value.fechas.length
        
        for (let index = 0; index < fechas; index++) {
            visitas.value.push(
                {   valor:service.value.fechas[index].visita, 
                    texto:`Visita ${service.value.fechas[index].visita}`, id:service.value.fechas[index].id
                })
            visita++
        }
    }
}

watch(service, (newVal) => {
    // setService('load')
})

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
    const path = `servicios/${service.value.id}/visita_${visitSelected.value.valor}/result/${findIndex}`;
    
    const flag = concept.value.includes('no_cumple');
    
    //actualizo los valores en la matriz principal
    findConcept.value = concept.value;
    findConcept.no_cumple = flag?1:0;

    const props = {
        value:concept.value, no_cumple:flag?1:0 
    }
    //se actualiza en firebase
    await updateData(path,props);
    //se actualiza en idb
    await saveLocalResults({service_id:service.value.id, visita:visitSelected.value.valor, data:result.value});
    
}

const saveObservaciones = async (categoria) => {
    //recibe los indices de cada uno y armamos el path
    const path = `servicios/${service.value.id}/visita_${visitSelected.value.valor}/observaciones/categoria_id_${categorias.value[categoria].id}`
    await updateData(path,{texto:categorias.value[categoria].observaciones});
    await saveLocalObservations({service_id:service.value.id, visita:visitSelected.value.valor, data:categorias.value[categoria].observaciones})
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
        observaciones.value = await fetchObservations({service_id:service.value.id, product_id:service.value.product_id, visita:visitSelected.value.valor})
        
        //si no existen respuestas previamente guardadas las crea en firebase
        if(result.value === undefined || result.value === null) {
            const a_conceptos = []
            categorias.value.map((cat) => {
                if(cat.conceptos){
                    const items = cat.conceptos.map((item) => {
                        return {concepto_id:item.id,service_id:service.value.id, value:1,visita_id:visitSelected.value.id,no_cumple:0,user_id:currentUser.value.id}
                    });
                    a_conceptos.push(...items);
                }
            });
            const uniqueArray = a_conceptos.filter((item, index, self) =>
                index === self.findIndex((obj) => obj.concepto_id === item.concepto_id)
            );

            //guarda en firebase respuestas vacías
            await setConceptsValues({service_id:service.value.id, data:uniqueArray, visita:visitSelected.value.valor, product_id:service.value.product_id,});
        }

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

const setFechas = (value) => {
    if(service.value.fechas != undefined){
        fechas_visita.value = service.value.fechas.find(visit => visit.id == visitSelected.value.id)
    }
}

const bloquearVisita = computed(() => {
    const splitDate = fechas_visita.value.to.split('-')
    const fecha_final = date.buildDate({year:splitDate[0], month:splitDate[1], date:splitDate[2]})
    return new Date() < fecha_final
})

const setLocal = async (type) => {
    if(service.value.categorias != undefined){
        const data = JSON.parse(localStorage.getItem(`service_${service.value.id}_categorias_visita_${visitSelected.value.valor}`))
        
        if(data != null){
            categorias.value = data.categorias
            visitSelected.value = visitas.value[0]
            fechas_visita.value = data.fechas
        } else categorias.value = service.value.categorias;
    }
}

const serviceSelected = () => {
    if(service.value.id == undefined){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para continuar selecciona un servicio'
        })
        return false
    }
    return true
}

const disableOptions = computed(() => {
    return (opcion,categoria,concepto) => {
        if (opcion === 'si') {
          return categorias.value[categoria].conceptos[concepto].value.includes('no') || categorias.value[categoria].conceptos[concepto].value.includes('no_cumple');
        } else if (opcion === 'no') {
          return categorias.value[categoria].conceptos[concepto].value.includes('si') || categorias.value[categoria].conceptos[concepto].value.includes('cumple');
        } else if (opcion === 'cumple') {
          return categorias.value[categoria].conceptos[concepto].value.includes('no') || categorias.value[categoria].conceptos[concepto].value.includes('no_cumple');
        } else if (opcion === 'no_cumple') {
          return categorias.value[categoria].conceptos[concepto].value.includes('si') || categorias.value[categoria].conceptos[concepto].value.includes('cumple');
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

const getActa = (data) => {
    if(data != undefined){
        dataActa.value = data.value
        imprimir('acta')
    } else {
       showActa.value = false
    }
    
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