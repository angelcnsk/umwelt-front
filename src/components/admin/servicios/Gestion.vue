<template>
<div class="q-ma-md" style="margin-top: 50px;">
    <q-card>
        <q-card-section>
            <q-separator spaced />
                <div class="text-subtitle text-grey-8">Archivos</div>
            <q-separator spaced />
            <archivos :servicio_id="props.servicio_id" />
        </q-card-section>
        <q-card-section>
            <q-separator spaced />
            <div class="text-subtitle text-grey-8">Gestión de visitas</div>
            <q-separator spaced />
            <div class="row q-pa-md">
                <div class="col-xs-12 col-md-2">
                    <q-btn class="q-mr-md q-mt-md" label="visita" icon-right="add" color="primary" @click="addVisit('init')" />
            </div>
            </div>
            
        </q-card-section>
        <q-card-section style="margin-bottom: 100px;">
            <q-separator spaced />
            <div class="text-subtitle text-grey-8">Reporte y control</div>
            <q-separator spaced />
            
            <div class="row q-pa-md">
                <q-btn label="Número dictamen" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="generarFolio"
                    :disable="data.num_dictamen !== 'Sin número dictamen'"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        <span v-if="data.num_dictamen == 'Sin número dictamen'">Genera número de dictamen </span>
                        <span v-else>Ya tiene número de dictamen</span>
                    </q-tooltip>
                </q-btn>
                <q-btn label="Guía Documental" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('documental')"
                    :disable="data.visitas_en_curso ==1"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        <span v-if="!data.visitas_en_curso">Descarga guía documental</span>
                        <span>Para continuar finaliza la visita</span>
                    </q-tooltip>
                </q-btn>
                <q-btn label="Guía Inspección" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('inspeccion')"
                    :disable="data.visitas_en_curso==1"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        <span v-if="!data.visitas_en_curso">Descarga guía de inspección</span>
                        <span>Para continuar finaliza la visita</span>
                    </q-tooltip>
                </q-btn>
                <q-btn label="Acta" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('acta')"
                    :disable="data.visitas_en_curso==1"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        <span v-if="!data.visitas_en_curso">Descarga acta</span>
                        <span>Para continuar finaliza la visita</span>
                    </q-tooltip>
                </q-btn>
                <q-btn label="Dictamen" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('dictamen')"
                    :disable="data.visitas_en_curso==1"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        <span v-if="!data.visitas_en_curso">Descarga dictamen</span>
                        <span>Para continuar finaliza la visita</span>
                    </q-tooltip>
                </q-btn>
                <q-toggle
                    v-model="status"
                    color="green"
                    label="Cerrado / Abierto"
                />
            </div>

        </q-card-section>
    </q-card>
    <q-dialog v-model="nuevaVisita" ref="modalVisita" >
        <q-card class="q-dialog-plugin" style="min-width: 900px;">
            <q-card-section>
                <div class="text-h6">Agregar visita</div>
                <div class="row">
                    <div class="col-xs-12 col-md-3 d-inline-block q-mt-lg q-ml-md">
                        <q-input v-model="visita.from" filled type="date" hint="Fecha inicial" />    
                    </div>
                    <div class="col-xs-12 col-md-3 d-inline-block q-mt-lg q-ml-md">
                        <q-input v-model="visita.to" filled type="date" hint="Fecha final" />
                    </div>
                    <div class="col-xs-12 col-md-2 d-inline-block q-mt-lg q-ml-md">
                        <q-input v-model="visita.inicio" filled type="time" hint="Hora inicio" />
                    </div>
                    <div class="col-xs-12 col-md-2 d-inline-block q-mt-lg q-ml-md">
                        <q-input v-model="visita.fin" filled type="time" hint="Hora final" />
                    </div>
                </div>
                <div class="row q-pa-md">
                    <div class="col-md-3 col-xs-12 q-pa-sm">
                        <q-select
                            v-model="visita.owner" 
                            :model-value="visita.owner"
                            hide-selected
                            fill-input
                            use-input
                            input-debounce="0"
                            :options="owners"
                            option-label="label"
                            @filter="filterStaff"
                            
                            label="Responsable"
                        >
                            <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                Sin resultados
                                </q-item-section>
                            </q-item>
                            </template>
                        </q-select>
                    </div>
                </div>
                <div class="row q-pa-md justify-end">
                    <q-btn label="Guardar" color="primary" @click="addVisit('create')"/>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</div>
</template>


<script setup>
import {ref, computed, watch, onMounted, defineAsyncComponent, inject} from 'vue';
import { useQuasar } from "quasar";
import { useServicios } from 'src/composables/useServicios.js'

const archivos = defineAsyncComponent(() => import('src/components/admin/servicios/Archivos.vue'))

const props = defineProps({
    servicio_id: String,
    data: Object
})

const servicio_id = ref(props.servicio_id)

const $q = useQuasar();

const storeServicios = useServicios();
const { generarNumDictamen, newVisit, getStaff, staff, closeServiceStatus } = storeServicios
const offline = inject('statusOnLine')
const nuevaVisita = ref(false)
const visita = ref({})
const owners = ref([])
const status = ref(false)

const notify = (msg, type) => {
    $q.notify({
        position:'top',
        type,
        message:msg
    })
}

const signatory = computed(() =>{
    return props.signatory
})

const signatario = ref({elabora:'', revisa:''})

watch(signatory, (value) => {
    if(value != null){
        signatario.value = JSON.parse(value)
    }
})

const addVisit = (type) => {
    if(type == 'init'){
        if(props.data.visitas_en_curso){
            $q.notify({
                position:'top',
                type:'warning',
                message:'Hay una visita en curso'
            })
            return false
        }

        if(!props.data.no_cumple){
            $q.notify({
                position:'top',
                type:'warning',
                message:'No es necesario agregar una visita, todos los puntos cumplen'
            })
            return false
        }

        nuevaVisita.value = true
        return true
    }
    

    if(type == 'create'){
        if(offline.value){
            $q.notify({
                position:'top',
                type:'warning',
                message:'Para agregar una visita es necesario tener conexión a internet'
            })
            return false
        }

        if(visita.value.owner == null || visita.value.owner == ''){
            $q.notify({
                position:'top',
                type:'negative',
                message:'Para continuar selecciona un responsable'
            })
            return false
        }

        $q.dialog({
            title: '¿Deseas agregar otra visita?',
            message: '',
            ok: {
                push: true,
                label:'Continuar'
            },
            cancel: {
                push: true,
                color: 'dark',
                label:'Cancelar'
            },
            persistent: true
        }).onOk(async data => {

            // visitas.value.push({valor:visitas.value.length+1, texto:`Visita ${visitas.value.length+1}` })
            const addVisit = await newVisit({service_id:servicio_id.value, 
                visita:visita.value, 
                owner_id:visita.value.owner.value
            })
            
            if(addVisit.status == 200){
                if(addVisit.data.msg){
                    $q.notify({
                        position:'top',
                        type:'warning',
                        message:'No es necesario agregar una visita, todos los puntos cumplen'
                    })
                } else {
                    localStorage.removeItem('categorias')
                    service.value.fechas = addVisit.data.fechas
                    setService()                    
                    $q.notify({
                        position:'top',
                        type:'positive',
                        message:'Se agregó una nueva visita'
                    })
                }
            }

        })  
    }
}

const filterStaff = (val, update, abort) => {
    if (val === '') {
        update(() => {
            owners.value = staff.value
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        owners.value = staff.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
    })
}

const getDocument = (type) => {
    let req = 0
    switch (type) {
        case 'documental':
            req = 1;
            break;
        case 'inspeccion':
            req = 3;
            break;
        case 'acta':
            req = 2;
            break;
        default:
            req = 4;
            break;
    }
    // console.log(`${import.meta.env.VITE_api_host}reportes/getreport/?service_id=${servicio_id.value}&reporte=${req}`)
    window.open(`${import.meta.env.VITE_api_host}reportes/getreport/?service_id=${servicio_id.value}&reporte=${req}`,'_blank')
}

const generarFolio = () => {
    $q.dialog({
            title: '¿Estás seguro?',
            message: 'Se asingará un número de dictamen al servicio',
            ok: {
            push: true,
            label:'Aceptar'
            },
            cancel: {
            push: true,
            color: 'dark',
            label:'Cancelar'
            },
            persistent: true
            }).onOk(async app => {

            const getfolio = await generarNumDictamen({servicio_id:props.data.id, generar_folio:true})
            if(getfolio.status == 200){
                notify('Se asignó número de dictamen', 'positive')
            } else {
                notify('Por favor contácta al administrador', 'negative')
            }
                            
        }).onCancel(() => {
            // console.log('>>>> Cancel')
        }).onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
        })   
}

watch(status, async (value) => {
    await closeServiceStatus({
        servicio_id:props.data.id,
        status: status.value == false ? 'cerrado' : 'abierto'
    })
    props.data.status =  status.value == false ? 'cerrado' : 'abierto'
    $q.notify({
        position:'top',
        type:'positive',
        message:'Estatus de servicio actualizado'
    })
})


onMounted(async () => {
    await getStaff({owner_service:true})
    status.value = props.data.status == 'abierto'
})
    

</script>