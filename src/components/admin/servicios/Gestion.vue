<template>
<div class="q-ma-md" style="margin-top: 50px;" v-if="service.id != undefined">
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
                <!-- <q-btn label="Guía Documental" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('documental')"
                    :disable="!validateVisit"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        <span v-if="validateVisit">Descarga guía documental</span>
                        <span v-else>Para continuar finaliza la visita</span>
                    </q-tooltip>
                </q-btn> -->
                <q-btn label="Guía Inspección" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('inspeccion')"
                    :disable="!validateVisit"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        <span v-if="validateVisit">Descarga guía de inspección</span>
                        <span v-else>Para continuar selecciona una visita</span>
                    </q-tooltip>
                </q-btn>
                <q-btn label="Acta" 
                    color="primary" 
                    class="q-mr-md" 
                    :disable="!validateVisit"
                    @click="showActa=!showActa"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        <span v-if="validateVisit">Descarga acta</span>
                        <span>Para continuar selecciona una visita</span>
                    </q-tooltip>
                </q-btn>
                <q-btn label="Dictamen" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="showDictamen=true"
                    :disable="!validateVisit"
                >
                    <!-- <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        <span v-if="validateVisit">Descarga dictamen</span>
                    </q-tooltip> -->
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
    <q-dialog v-model="showDictamen" ref="dictamenData">
        <q-card style="min-width: 500px;">
            <q-card-section>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-mt-md q-pa-sm" v-model="dataDictamen.fecha" filled type="date" label="Fecha emisión" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-select :options="servicio.emisores_dictamen"   option-label="name" class="q-pa-sm" v-model="dataDictamen.emite" label="Persona que emite dictamen"  />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataDictamen.resultado" label="Resultado del dictamen" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataDictamen.representante" label="Representante legal empresa" />
                </div>
                <div class="row q-pa-md justify-end">
                    <q-btn label="Descargar" color="primary" @click="getDocument('dictamen')"/>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
    <modal-acta :show="showActa" @closeModal="getActa" />
</div>
</template>


<script setup>
import {ref, computed, watch, onMounted, defineAsyncComponent, inject} from 'vue';
import { useQuasar } from "quasar";
import { useServicios } from 'src/composables/useServicios.js'

const archivos = defineAsyncComponent(() => import('src/components/admin/servicios/Archivos.vue'))

const modalActa = defineAsyncComponent(() => import('src/components/admin/acta/ModalPrintActa.vue'))

const props = defineProps({
    servicio_id: String,
})

const servicio_id = ref(props.servicio_id)

const $q = useQuasar();

const storeServicios = useServicios();
const { generarNumDictamen, newVisit, getStaff, staff, closeServiceStatus } = storeServicios
const offline = inject('statusOnLine')
const visitas = ref(null)
const visitSelected = ref(null)
const nuevaVisita = ref(false)
const currentVisit = ref(false)
const visita = ref({})
const owners = ref([])
const status = ref(false)
const showDictamen = ref(false)
const dataDictamen = ref({})

const showActa = ref(false)
const dataActa = ref({})

const service = inject('servicio')

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
        if(service.value.visitas_en_curso){
            $q.notify({
                position:'top',
                type:'warning',
                message:'Hay una visita en curso'
            })
            return false
        }

        if(!service.value.no_cumple){
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
                    setDates()
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

const getActa = (data) => {
    dataActa.value = data.value
    getDocument('acta')
}

const getDocument = (type) => {
    if((type == 'inspeccion' || type == 'acta') && visitSelected.value == null){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para continuar selecciona una visita'
        })
        return false
    }

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
            //dictamen
            req = 4;
            break;
    }
    console.log(servicio_id, dataActa.value, type)
    let url = `${import.meta.env.VITE_api_host}reportes/getreport/?service_id=${servicio_id.value}&reporte=${req}&visita_id=${visitSelected.value.id}`
    if(req==4){
        if(dataDictamen.value.fecha == undefined || dataDictamen.value.fecha == ''
            || dataDictamen.value.emite == undefined || dataDictamen.value.emite == ''
            || dataDictamen.value.resultado == undefined || dataDictamen.value.resultado == ''
            || dataDictamen.value.representante == undefined || dataDictamen.value.representante == ''
        ){
            notify('Todos los campos son requeridos', 'negative')
            return false
        }
        const queryString = Object.keys(dataDictamen.value)
            .map(key => {
                let value = dataDictamen.value[key];

            // Verificar si el valor es un objeto y extraer un valor específico
            if (typeof value === 'object' && value !== null) {
            // Supongamos que quieres extraer el valor de la propiedad 'subpropiedad'
            value = value.id || '';
            }

            return encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }).join('&');

        url = `${import.meta.env.VITE_api_host}reportes/getreport/?service_id=${servicio_id.value}&reporte=${req}&${queryString}&visita_id=${visitSelected.value.id}`
        showDictamen.value = false
        dataDictamen.value = {}
        dataDictamen.value.representante = servicio.value.representante
    }

    if(req==2){
        if(dataActa.value.persona1 == undefined || dataActa.value.persona1 == ''
            || dataActa.value.cargo1 == undefined || dataActa.value.cargo2 == ''
            || dataActa.value.persona2 == undefined || dataActa.value.persona2 == ''
            || dataActa.value.cargo2 == undefined || dataActa.value.cargo2 == ''
            || dataActa.value.testigo1 == undefined || dataActa.value.testigo1 == ''
            || dataActa.value.testigo_cargo1 == undefined || dataActa.value.testigo_cargo1 == ''
            || dataActa.value.testigo2 == undefined || dataActa.value.testigo2 == ''
            || dataActa.value.testigo_cargo2 == undefined || dataActa.value.testigo_cargo2 == ''
            
        ){
            notify('Todos los campos son requeridos', 'negative')
            return false
        }
        const queryString = Object.keys(dataActa.value)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(dataActa.value[key]))
            .join('&');
            
        url = `${import.meta.env.VITE_api_host}reportes/getreport/?service_id=${servicio_id.value}&reporte=${req}&${queryString}&visita_id=${visitSelected.value.id}`
        showActa.value = false
        dataActa.value = {}
    }

    window.open(url,'_blank')
}

watch(status, async (value) => {
    await closeServiceStatus({
        servicio_id:servicio_id.value,
        status: status.value ? 'abierto' : 'cerrado'
    })
    service.value.status =  status.value ? 'abierto' : 'cerrado'
    $q.notify({
        position:'top',
        type:'positive',
        message:'Estatus de servicio actualizado'
    })
})

const setDates = () => {
    visitas.value = service.value.fechas.map((item) => {return {id:item.id, texto:`Visita ${item.visita}`}})
}

const setDataService = () => {
    setDates()
    status.value = service.value.status == 'abierto'
    dataDictamen.value.representante = service.value.representante
}

const validateVisit = computed(() => {
    if(service.value.fechas!=undefined && visitSelected.value != null){
        service.value.fechas.map((item) => {
            if(item.id == visitSelected.value.id){
                currentVisit.value = item.finalizado == 1
            }
        })
        console.log('true bloquea', currentVisit.value)
    }
    
    return currentVisit.value
})


onMounted(async () => {
    await getStaff({owner_service:true})
    setTimeout(() => {
        setDataService()
    }, 1000);
})
    

</script>