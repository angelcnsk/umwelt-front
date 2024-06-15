<template>
    <q-card>
        <q-card-section>
            <div class="row q-pa-sm">
                <div class="col-xs-12 col-md-3">
                    <q-select 
                        class="q-mr-md" 
                        style="width: 200px;" 
                        :options="visitas"
                        option-label="texto"
                        v-model="visitSelected"
                        label="Visita"
                    />
                </div>
                <div class="col-xs-12 col-md-2 d-inline-block q-mt-lg q-ml-sm">
                    <q-input v-model="fechas_visita.fecha_inicio" filled type="date" hint="Fecha inicial" />
                    
                </div>
                <div class="col-xs-12 col-md-2 d-inline-block q-mt-lg q-ml-sm">
                    <q-input v-model="fechas_visita.fecha_fin" filled type="date" hint="Fecha final" />
                </div>
                <div class="col-xs-12 col-md-1 d-inline-block q-mt-lg q-ml-sm">
                    <q-input v-model="fechas_visita.hora_inicio" filled type="text" hint="Hora inicio" />
                </div>
                <div class="col-xs-12 col-md-1 d-inline-block q-mt-lg q-ml-sm">
                    <q-input v-model="fechas_visita.hora_final" filled type="text" hint="Hora final" />
                </div>
            </div>
            <div class="row q-pa-md items-center justify-start ">
                <!-- <q-btn class="q-mb-md" color="primary" icon="save" label="guardar" @click="autoSave('manual')">
                    <q-tooltip>
                        Guarda información en tu equipo
                    </q-tooltip>
                </q-btn> -->
                <q-btn class="q-mb-md" color="primary" icon="save" label="guardar" @click="asyncSaveData('manual')">
                    <q-tooltip>
                        Guarda información en el servidor
                    </q-tooltip>
                </q-btn>
                <q-btn class="q-mb-md q-ml-md" color="primary" icon="delete_outline" label="Borrar" @click="cleanData('manual')">
                    <q-tooltip>
                        Borrar datos sin conexión
                    </q-tooltip>
                </q-btn>
                <q-btn class="q-mb-md q-ml-md" color="primary" icon="print" label="guía inspección" @click="imprimir('guia inspeccion')">
                    <q-tooltip>
                        Imprimir guía de inspección
                    </q-tooltip>
                </q-btn>
                <q-btn class="q-mb-md q-ml-md" color="primary" icon="print" label="Acta" @click="imprimir('acta')">
                    <q-tooltip>
                        Imprimir Acta
                    </q-tooltip>
                </q-btn>
                
            </div>
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
                <div style="height: 150px; overflow-y: scroll; border:1px solid" v-if="categoria.conceptos.length>0">
                    <div class="q-pa-md" v-for="(concepto,i) in categoria.conceptos" :key="i">
                        <div class="row wrap q-pa-sm">
                            <span class="text-justify"><span class="text-caption">{{ `${concepto.global})`  }}</span> {{concepto.texto  }}</span>
                        </div>
                        <div class="row q-pa-sm">
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
                        max-height="300px"
                        color="red-12"
                        @blur="saveObservaciones(index)"
                    />
                </div>
                </q-expansion-item>
                
                <contentActa :service="service" :autoSaveParent="autoSave" />
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
        <q-dialog v-model="dialog" position="bottom">
        <q-card style="width: 350px">
            <q-linear-progress indeterminate color="primary" />

            <q-card-section class="row items-center no-wrap">
            <div>
                <div class="text-weight-bold">{{tipo}}</div>
            </div>

            <q-space />

            <q-btn flat round icon="check" color="green"/>
            
            </q-card-section>
        </q-card>
        </q-dialog>

</template>

<script setup>
import {ref, computed, watch, onMounted, toRef, inject, provide, defineAsyncComponent} from 'vue';
import { useQuasar, date } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js'
import { createGuideConcepts, getGuideConcepts, observacionesCategorias, saveConceptValue, saveObservation } from 'src/composables/firebase/capturas/nom02/guiaConceptos.js'
import { storeActa } from "src/composables/firebase/storage";

const $q = useQuasar();
const storeCapturas = useCapturas();
const { saveCaptures, newVisit, listenerObservations, getCategories} = storeCapturas

const contentActa = defineAsyncComponent(() => import('src/components/admin/capturas/Acta.vue'))

const props = defineProps({
    service: Object
})

const offline = inject('statusOnLine')
const currentUser = inject('currentUser')
const categorias = ref([])
const service = toRef(props,'service')

const dialog = ref(false)
const visitas = ref([])
const tipo = ref('')
const timeStamp = Date.now()
const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')
const visitSelected = ref('')
const conceptos = ref([])

provide('currentVisit', visitSelected);

const fechas_visita = ref({
    fecha_inicio: formattedString,
    fecha_fin: formattedString,
    hora_inicio: "00:00",
    hora_final: "00:00",
})

const setNoCumple = () => {
    //se recorren los conceptos y si alguno incluye la opción no cumple, se guarda bandera para identificar puntos que no cumplen
    return new Promise((resolve) => {
        categorias.value.forEach(categoria => {
            categoria.conceptos.forEach(concepto => {
                if(concepto.value.includes('no_cumple')) concepto.no_cumple = 1
                else concepto.no_cumple = 0
            })
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
        
        visitSelected.value = visitas.value[0]
    }
    setLocal(type)
    setFechas()
}

watch(service, (newVal) => {
    setService('load')
})

const changeValue = async (categoria, concepto) => {
    //recibe los indices de cada uno
    const concept = categorias.value[categoria].conceptos[concepto]
    
    //se busca el concepto en todas las categorias y se actualiza el valor
    categorias.value.forEach((categoria) => {
        categoria.conceptos.forEach((concepto) => {
            if(concept.id == concepto.id) concepto.value = concept.value
        })
    })
    // await saveConceptValue({
    //     uid:categorias.value[categoria].conceptos[concepto].uid,
    //     value:categorias.value[categoria].conceptos[concepto].value,
    //     user_id:currentUser.value.id
    // })
    setLocal('update')
}

const saveObservaciones = async (categoria) => {
    //recibe los indices de cada uno
    // console.log('editar observaciones',  categorias.value)
    /*await saveObservation({
        uid:categorias.value[categoria].uid,
        texto:categorias.value[categoria].observaciones,
        user_id:currentUser.value.id
    })*/
    setLocal('update')
}

watch(visitSelected, async (fecha) => {
    if(service.value.id != undefined){
        // categorias.value = []
        setFechas()
        console.log("trae conceptos", conceptos.value.length)
        async function createConcepts(){
            if(conceptos.value.length == 0){
                console.log('espera a que se complete la promesa?', conceptos.value)
                //si no encuentra conceptos para el servicio, los crea
                service.value.categorias.forEach(async (category) => {
                    console.log("recorre categorías")
                    //maneja las observaciones de cada categoría
                    const categoriasObservaciones =  await observacionesCategorias({
                        categoria_id:category.id,
                        user_id:currentUser.value.id,
                        service_id:service.value.id,
                        visita_id:visitSelected.value.valor,
                        observaciones:category.observaciones
                    })
                    //hago el set de uid de la categoría
                    if(categoriasObservaciones.length > 0){
                        categoriasObservaciones.forEach((item) => {
                            if(item.categoria_id == category.id && item.visita_id == visitSelected.value.valor) category.uid = item.uid
                        })
                    }

                    category.conceptos.forEach(async (concepto) => {
                        await createGuideConcepts({
                            concepto_id:concepto.id,
                            valor:concepto.value.length == 0 ? [] : concepto.value,
                            categoria_id:concepto.categoria_id,
                            user_id:currentUser.value.id,
                            service_id:service.value.id,
                            visita_id:visitSelected.value.valor,
                            global:concepto.global
                        })
                    })
                })
                conceptos.value = await getGuideConcepts({service_id:service.value.id, visita_id:visitSelected.value.valor})
                console.log('get Concepts', conceptos.value)
            }
            // console.log('qué tiene?', conceptos.value.length)
            //si ya existen los conceptos se iteran
            
            setTimeout(() => {
                // console.log('por qué trae data?', conceptos.value)
                if(conceptos.value.length>0){
                    //console.log('hace set')
                    conceptos.value.forEach((concept) => {
                        console.log("se ejecuta set de conceptos")
                        categorias.value.forEach((category) => {
                            category.conceptos.forEach((item) => {
                                if(item.categoria_vista_id == concept.categoria_id && concept.concepto_id == item.id){
                                    item.value = concept.value
                                    item.uid = concept.uid
                                }
                            })
                        })
                    })
                    setLocal('update')
                }
            }, 3000);
        }
    
        //si no existe, es la primera vez y se hace el set de la data
        const data = JSON.parse(localStorage.getItem(`service_${service.value.id}_categorias_visita_${visitSelected.value.valor}`))

        if(data!=null){
            categorias.value = data.categorias
        } else {
            const getCategorias = await getCategories({service_id:service.value.id, visita:visitSelected.value.valor})
            categorias.value = getCategorias.status == 200 ? getCategorias.data.categorias : categorias.value
            
        }
        
        // if(!offline.value) {
        //     //si hay conexión a internet
        //     if(data == null){
        //         //obtiene los conceptos desde firebase
        //         // conceptos.value = await getGuideConcepts({service_id:service.value.id, visita_id:visitSelected.value.valor})
                
        //         // setTimeout(async () => {
        //         //     await createConcepts()
        //         // }, 2000);
        //     }
        // }
        
        
    }
})

const setFechas = (value) => {
    if(service.value.fechas != undefined){
        fechas_visita.value = service.value.fechas.find(visit => visit.id == visitSelected.value.id)
        console.log('ok fechas', fechas_visita.value)
        
    }
}

const autoSave = async (type) => {
    if(!serviceSelected()) return false     
    await setNoCumple()
    setLocal('update')
    // dialog.value = true
    // tipo.value = type == 'manual' ? 'Guardando...' : 'Auto guardado'
}

const bloquearVisita = computed(() => {
    const splitDate = fechas_visita.value.to.split('-')
    const fecha_final = date.buildDate({year:splitDate[0], month:splitDate[1], date:splitDate[2]})
    return new Date() < fecha_final
})

const setLocal = async (type) => {
    if(service.value.categorias != undefined){
        if(type == 'load'){
        const data = JSON.parse(localStorage.getItem(`service_${service.value.id}_categorias_visita_${visitSelected.value.valor}`))
        
            if(data != null){
                categorias.value = data.categorias
                visitSelected.value = visitas.value[0]
                fechas_visita.value = data.fechas
            } 
            else {
                categorias.value = service.value.categorias
            }
        }   
    }
    
    if(type == 'update'){
        const indice = visitas.value.indexOf(visitSelected.value)
        
        const info = JSON.parse(localStorage.getItem(`service_${service.value.id}_categorias_visita_${visitSelected.value.valor}`))
        
        await setNoCumple()

        localStorage.setItem(`service_${service.value.id}_categorias_visita_${visitSelected.value.valor}`, JSON.stringify({
            service_id:service.value.id,
            categorias:categorias.value,
            fechas:fechas_visita.value,
            visita:visitSelected.value.valor,
            finalizado: service.value.fechas[indice].finalizado,
            acta: (info && info.acta) ? info.acta : ''
        }))
        setTimeout(() => {
            listenerObservations()
        }, 1000);
    }
    
}

const asyncSaveData = () => {
    if(!serviceSelected()) return false

    $q.dialog({
        title: '¿Deseas continuar?',
        message: 'Se guardarán los datos ingresados en la base de datos',
        ok: {
        push: true,
        label:'Continuar'
        },
        cancel: {
        push: true,
        color: 'dark',
        label:'Cancelar'
        },
        persistent: true,

    }).onOk(async data => {
        
        const info = JSON.parse(localStorage.getItem(`service_${service.value.id}_categorias_visita_${visitSelected.value.valor}`))

        //candado cerrar visita
        // if(info.finalizado == 1){
        //     $q.notify({
        //         position:'top',
        //         type:'negative',
        //         message:'La visita está finalizada, no es posible continuar'
        //     })
        //     return false
        // }

        if(info!=null){
            //se hace otro setLocal para evitar perder cualquier dato si no hay conexión, se mantiene en local los cambios
            setLocal('update')
            
            if(!offline.value){
                //hay conexión
                if(info.acta == undefined){
                    $q.notify({
                        position:'top',
                        type:'negative',
                        message:'Falta el texto del acta'
                    })
                    return false  
                }

                const blob = new Blob([info.acta], { type: 'text/plain' });
                const actaStore = await storeActa({ 
                    file:blob,
                    service_id: info.service_id,
                    visita: visitSelected.value.valor
                })

                const saveData = await saveCaptures({
                    service_id: info.service_id, 
                    categorias:info.categorias, 
                    type:"conceptos",
                    fechas:info.fechas,
                    visita: visitSelected.value.valor,
                    acta:actaStore.path,
                    storageId:actaStore.storageId,
                    finalizado:1
                })

                if(saveData.status == 200){
                    $q.notify({
                        position:'top',
                        type:'positive',
                        message:'Se guardó la información en el servidor'
                    })
                    localStorage.setItem(`service_${service.value.id}_asyncData_visita_${visitSelected.value.valor}`,true)
                }
            } else {
                $q.notify({
                    position:'top',
                    type:'warning',
                    message:'Se guardó la información en tu equipo'
                })
            }
        }
    })
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

const cleanData = () => {
    
    if(service.value.id == undefined){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para continuar selecciona un servicio'
        })
        return false
    }
    
    $q.dialog({
        title: '¿Estás seguro?',
        message: 'Esta acción borrará toda la información guardada en tu dispositivo',
        ok: {
            push: true,
            label:'Si, borrar',
            color:'red-4'
        },
        cancel: {
            push: true,
            color: 'dark',
            label:'Cancelar'
        },
        persistent: true
    }).onOk(async data => {
        
        localStorage.removeItem(`service_${service.value.id}_categorias_visita_${visitSelected.value.valor}`)
        localStorage.removeItem(`service_${service.value.id}_data`)
        $q.notify({
            position:'top',
            type:'positive',
            message:'Se borró la información guardada sin conexión'
        })
    })
        
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

const imprimir = (doc) => {
    if(service.value.id == undefined){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para continuar selecciona un servicio'
        })
        return false
    }

    const asyncData = localStorage.getItem(`service_${service.value.id}_asyncData_visita_${visitSelected.value.valor}`)

    if(asyncData == null || asyncData == undefined){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para continuar guarda la información capturada'
        })
        return false
    }

    let url = import.meta.env.VITE_api_host
    switch (doc) {
        case 'guia inspeccion':
            url = `${url}reportes/getreport?service_id=${service.value.id}&reporte=3&visita_id=${visitSelected.value.id}`
        break;

        case 'acta':
        url = `${url}reportes/getreport?service_id=${service.value.id}&reporte=2&visita_id=${visitSelected.value.id}`
        break;
    }

    window.open(url,'_blank')
}

onMounted( async () => {
    setService('load')
    setInterval(() => {
        if(categorias.value.length>0) autoSave()
    }, 300000);
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