<template>
<div class="q-ma-md" style="margin-top: 50px;">
    <q-card>
        <!-- <q-card-section>
            <div class="text-h6 text-grey-8">Gestión</div>
            <q-separator spaced />
            <div class="text-subtitle text-grey-8">Signatarios y destinatarios</div>
            <q-separator spaced />
            <div class="row q-pa-sm">
                <div class="col-xs-12 col-md-3">
                    <q-select v-model="signatario.elabora" :options="signatoryList.signatario" label="Elaboró" class="q-pa-sm">
                        <template v-slot:prepend>    
                            <q-icon name="help" color="orange" >
                                <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                                    Responsable que aparece en carátula
                                </q-tooltip>
                            </q-icon>
                        </template>
                    </q-select>
                </div>
                <div class="col-xs-12 col-md-3">
                    <q-select v-model="signatario.revisa" :options="signatoryList.aprueba" label="Revisó" class="q-pa-sm">
                        <template v-slot:prepend>    
                            <q-icon name="help" color="orange" >
                                <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                                    Responsable que aparece en carátula
                                </q-tooltip>
                            </q-icon>
                        </template>
                    </q-select>
                </div>
                <div class="col-xs-12 col-md-3">
                    <q-input label="Dirigido a" v-model="signatario.dirigido_a" class="q-pa-sm" />
                </div>
                <div class="col-xs-12 col-md-3">
                    <q-input label="Representante legal" v-model="signatario.representante" class="q-pa-sm" />
                </div>
                <div class="col-xs-12 col-md-2">
                    <q-btn label="guardar" color="primary" class="q-mt-lg q-ml-md" @click="addSignatory"/>
                </div>
            </div>
        </q-card-section> -->
        
        <q-card-section>
            <q-separator spaced />
                <div class="text-subtitle text-grey-8">Archivos</div>
            <q-separator spaced />
            <archivos :servicio_id="props.servicio_id" />
        </q-card-section>
        <q-card-section style="margin-bottom: 100px;">
            <q-separator spaced />
            <div class="text-subtitle text-grey-8">Reporte y control</div>
            <q-separator spaced />

            <div class="row q-pa-md">
                <q-btn label="Guía Documental" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('documental')"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Descarga guía documental
                    </q-tooltip>
                </q-btn>
                <q-btn label="Guía Inspección" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('inspeccion')"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Descarga guía de inspección
                    </q-tooltip>
                </q-btn>
                <q-btn label="Acta" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('acta')"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Descarga acta
                    </q-tooltip>
                </q-btn>
                <q-btn label="Dictamen" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('dictamen')"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Descarga dictamen
                    </q-tooltip>
                </q-btn>
            </div>

        </q-card-section>
    </q-card>
</div>
</template>


<script setup>
import {ref, computed, watch, onMounted, defineProps} from 'vue';
import { useQuasar } from "quasar";
import { useServicios } from 'src/composables/useServicios.js'
import { useUsers } from 'src/composables/useUsers.js'

import archivos from 'components/admin/servicios/Archivos.vue'
// import { utils, writeFileXLSX } from 'xlsx';

const props = defineProps({
    servicio_id: String
})

const servicio_id = ref(props.servicio_id)

const $q = useQuasar();
const storeUsers = useUsers();
const storeServicios = useServicios();
const { AppActiveUser } = storeUsers
const { staff, managePoints, sin_asignar, asignados, serviceItem, 
    getSignatoryList, signatoryList,saveSignatory, 
    getFieldSheets,getPdfFieldSheets, getReport
} = storeServicios


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
    console.log(`${import.meta.env.VITE_api_host}reportes/getreport/?service_id=${servicio_id.value}&reporte=${req}`)
    window.open(`${import.meta.env.VITE_api_host}reportes/getreport/?service_id=${servicio_id.value}&reporte=${req}`,'_blank')
}


onMounted(() => {
    
})
    

</script>