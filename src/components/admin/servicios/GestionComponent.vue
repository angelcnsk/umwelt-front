<template>
<div class="q-ma-md" style="margin-top: 50px;" v-if="service.id != undefined">
    <q-card>
        <!-- <q-card-section>
            <q-separator spaced />
                <div class="text-subtitle text-grey-8">Archivos</div>
            <q-separator spaced />
            <archivos :servicio_id="props.servicio_id" />
        </q-card-section> -->
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
                    <q-btn class="q-mr-md q-mt-md" label="visita" icon-right="add" color="primary" @click="toggleNuevaVisita" />
            </div>
            </div>
            
        </q-card-section>
        <q-card-section v-if="service.product_id == 2">
            <q-separator spaced />
                <div class="text-subtitle text-grey-8">Recipientes RSP CAT III</div>
            <q-separator spaced />
            <contenedores :service="service" />
        </q-card-section>
        <q-card-section style="margin-bottom: 100px;">
            <q-separator spaced />
            <div class="text-subtitle text-grey-8">Reporte y control</div>
            <q-separator spaced />
            
            <div class="row q-pa-md" v-if="service.product_id ==1">
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
                    :disable="!getDictamen"
                >
                    <!-- <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        <span v-if="validateVisit">Descarga dictamen</span>
                    </q-tooltip> -->
                </q-btn>
                
            </div>
            <div class="row q-pa-md" v-if="service.product_id ==2">
                <q-btn label="Documentos" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="showDocs20 = !showDocs20"
                />
            </div>
            <div>
                <q-toggle
                    v-model="status"
                    color="green"
                    @click="changeStatus"
                    label="Cerrado / Abierto"
                />
            </div>
        </q-card-section>
    </q-card>
    <q-dialog v-model="showAddVisit" ref="modalVisita" >
        <q-card class="q-dialog-plugin" style="min-width: 900px;">
            <q-card-section>
                <div class="text-h6">Agregar visita</div>
                <div class="row">
                    <div class="col-xs-12 col-md-3 d-inline-block q-mt-lg q-ml-md">
                        <q-input v-model="newVisitObj.from" filled type="date" hint="Fecha inicial" />
                    </div>
                    <div class="col-xs-12 col-md-3 d-inline-block q-mt-lg q-ml-md">
                        <q-input v-model="newVisitObj.to" filled type="date" hint="Fecha final" />
                    </div>
                    <div class="col-xs-12 col-md-2 d-inline-block q-mt-lg q-ml-md">
                        <q-input v-model="newVisitObj.inicio" filled type="time" hint="Hora inicio" />
                    </div>
                    <div class="col-xs-12 col-md-2 d-inline-block q-mt-lg q-ml-md">
                        <q-input v-model="newVisitObj.fin" filled type="time" hint="Hora final" />
                    </div>
                </div>
                <div class="row q-pa-md">
                    <div class="col-md-3 col-xs-12 q-pa-sm">
                        <q-select
                            v-model="newVisitObj.owner_id" 
                            :model-value="newVisitObj.owner_id"
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="0"
                            :options="owners"
                            option-label="label"
                            @filter="filterStaff"
                            label="Responsable"
                            option-value="value"
                            emit-value
                            map-options
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
                    <q-btn label="Guardar" color="primary" @click="addVisit"/>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog v-model="showDictamen" ref="dictamenData">
        <q-card style="min-width: 800px;">
            <q-card-section>
                <div class="row">
                    <div class="col-md-4">
                        <q-input class="q-mt-md q-pa-sm" v-model="dataDictamen.fecha" filled type="date" label="Fecha emisión" />
                    </div>
                </div>
                <div class="row">
                    <span class="q-pa-sm text-subtitle2 q-mt-md">Visitas realizadas:</span>
                </div>
                <div class="q-pa-sm">
                    <div class="row bg-blue-4 q-pa-sm q-mt-sm text-body1 text-bold text-white" v-for="(text, index) in visitasText" :key="index">{{ text }}</div>
                </div>
            
                <div class="row">
                    <span class="q-pa-sm text-subtitle2 q-mt-md">Texto de fechas de visita:</span>
                    <span class="q-pa-sm">{{ dataDictamen.textoDictamen + dataDictamen.textoFechas + dataDictamen.textoDictamentResult + ' Cumple'}}</span>
                </div>
                <div class="row q-pa-sm q-mt-md justify-between">
                    <div class="col-xs-12 col-md-6">
                        <q-input v-model="dataDictamen.textoFechas" style="max-width: 95%;" filled label="Fecha de visitas"/>
                    </div>
                </div>
                <div class="row justify-between">
                    <div class="col-xs-12 col-md-6">
                        <q-select style="max-width: 95%;" :options="service.emisores_dictamen"   option-label="name" class="q-pa-sm" v-model="dataDictamen.emite" label="Persona que emite dictamen"  />
                    </div>
                    <div class="col-xs-12 col-md-6">
                        <q-input class="q-pa-sm" style="max-width: 95%;" v-model="dataDictamen.representante" label="Representante legal empresa" />
                    </div>
                </div>
                
                <div class="row q-pa-md justify-end">
                    <q-btn label="Descargar" color="primary" @click="getDocument('dictamen')"/>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
    <modal-acta :show="showActa" @closeModal="getActa" />
    <modalDocuments02 :show="showDocs20" @closeModal="closeModalDoc20" :service="service" />
</div>
</template>


<script setup>
import {ref, computed, watch, onMounted, defineAsyncComponent, inject} from 'vue';
import { useQuasar } from "quasar";
import { useServicios } from 'src/composables/useServicios.js'
import { useCapturas } from 'src/composables/useCapturas.js'
import { useVisits } from 'src/composables/useVisits.js'

const modalActa = defineAsyncComponent(() => import('src/components/admin/acta/ModalPrintActa.vue'))

const contenedores = defineAsyncComponent(() => import('src/components/admin/servicios/ContenedoresList.vue'))

const modalDocuments02 = defineAsyncComponent(() => import('src/components/admin/servicios/ModalDocuments02.vue'))

const props = defineProps({
    servicio_id: String,
})

const $q = useQuasar();
const offline = inject('statusOnLine');
const visitSelected = ref(null);
const servicio_id = ref(props.servicio_id);
const { addVisit, toggleNuevaVisita, showAddVisit, setServiceDates, newVisitObj } = useVisits(offline, visitSelected, servicio_id);
const storeServicios = useServicios();
const storeCapturas = useCapturas();
const { getStaff, staff, closeServiceStatus } = storeServicios;
const { visitas } = storeCapturas;

const owners = ref([])
const status = ref(false)
const showDictamen = ref(false)
const dataDictamen = ref({
    textoDictamen:"La inspección del cumplimiento de la norma NOM-002-STPS-2010, Condiciones de Seguridad Prevención y Protección contra incendios en los centros de trabajo fue realizada ",
    textoDictamentResult:" con el siguiente resultado:",
    textoFechas:"",
})

const showActa = ref(false)
const showDocs20 = ref(false)
const dataActa = ref({})
const service = inject('servicio')
const visitasText = ref([])

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

// const listFechas = computed(() => visitasText.value.join('<br>'))

const signatario = ref({elabora:'', revisa:''})

watch(signatory, (value) => {
    if(value != null){
        signatario.value = JSON.parse(value)
    }
})

const filterStaff = (val, update) => {
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
    if(data != undefined){
        dataActa.value = data.value
        getDocument('acta')
    } else {
       showActa.value = false
    }
    
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
    
    let url = `${import.meta.env.VITE_api_host}reportes/getreport?service_id=${servicio_id.value}&reporte=${req}&visita_id=${visitSelected.value.id}`
    if(req==4){
        if(dataDictamen.value.fecha == undefined || dataDictamen.value.fecha == ''
            || dataDictamen.value.emite == undefined || dataDictamen.value.emite == ''
            || dataDictamen.value.representante == undefined || dataDictamen.value.representante == ''
            || dataDictamen.value.textoFechas == undefined || dataDictamen.value.textoFechas == ''
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

        url = `${import.meta.env.VITE_api_host}reportes/getreport?service_id=${servicio_id.value}&reporte=${req}&${queryString}&visita_id=${visitSelected.value.id}`
        showDictamen.value = false
        dataDictamen.value = {}
        dataDictamen.value.representante = service.value.representante
    }

    if(req==2){
        if(dataActa.value.persona1 == undefined || dataActa.value.persona1 == ''
            || dataActa.value.cargo1 == undefined || dataActa.value.cargo2 == ''
            // || dataActa.value.persona2 == undefined || dataActa.value.persona2 == ''
            // || dataActa.value.cargo2 == undefined || dataActa.value.cargo2 == ''
            // || dataActa.value.testigo1 == undefined || dataActa.value.testigo1 == ''
            // || dataActa.value.testigo_cargo1 == undefined || dataActa.value.testigo_cargo1 == ''
            // || dataActa.value.testigo2 == undefined || dataActa.value.testigo2 == ''
            // || dataActa.value.testigo_cargo2 == undefined || dataActa.value.testigo_cargo2 == ''
            
        ){
            notify('Para continuar agrega al menos un nombre y cargo de quien atiende la visita', 'negative')
            return false
        }
        const queryString = Object.keys(dataActa.value)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(dataActa.value[key]))
            .join('&');
            
        url = `${import.meta.env.VITE_api_host}reportes/getreport?service_id=${servicio_id.value}&reporte=${req}&${queryString}&visita_id=${visitSelected.value.id}`
        showActa.value = false
        dataActa.value = {}
    }

    window.open(url,'_blank')
}

const changeStatus = async() => {
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
}

const setDataService = () => {
    setServiceDates();
    status.value = service.value.status == 'abierto'
    dataDictamen.value.representante = service.value.representante
    
    visitasText.value = service.value.fechas != undefined ? service.value.fechas.map(fecha => {
        // Función para convertir fecha de 'aaaa/mm/dd' a 'dd/mm/aaaa'
        const formatFecha = (fechaStr) => {
            console.log(fechaStr)
            const [year, month, day] = fechaStr.split('-');
            return `${day}/${month}/${year}`;
        };

        // Formatear las fechas de inicio y fin
        const fechaInicio = formatFecha(fecha.fecha_inicio);
        const fechaFin = formatFecha(fecha.fecha_fin);

        return `Visita ${fecha.visita}: Inicio:${fechaInicio} - Fin:${fechaFin} \n`;
    }) : []
}

const getDictamen = computed(() => {
    return visitSelected.value != null && service.value.has_doc && !service.value.no_cumple
})

const validateVisit = computed(() => {
    return service.value.has_doc && visitSelected.value != null
})

const closeModalDoc20 = () => {
    showDocs20.value = false
}


onMounted(async () => {
    newVisitObj.value.service_id = servicio_id.value
    await getStaff({owner_service:true})
    setTimeout(() => {
        setDataService()
    }, 1000);
})
    

</script>