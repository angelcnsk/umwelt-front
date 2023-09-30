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
                <q-btn label="Número dictamen" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="generarFolio"
                    :disable="data.num_dictamen !== 'Sin número dictamen'"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Genera número de dictamen
                    </q-tooltip>
                </q-btn>
                <q-btn label="Guía Documental" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('documental')"
                    :disable="data.visita_en_curso"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Descarga guía documental
                    </q-tooltip>
                </q-btn>
                <q-btn label="Guía Inspección" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('inspeccion')"
                    :disable="data.visita_en_curso"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Descarga guía de inspección
                    </q-tooltip>
                </q-btn>
                <q-btn label="Acta" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('acta')"
                    :disable="data.visita_en_curso"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Descarga acta
                    </q-tooltip>
                </q-btn>
                <q-btn label="Dictamen" 
                    color="primary" 
                    class="q-mr-md" 
                    @click="getDocument('dictamen')"
                    :disable="data.visita_en_curso"
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
import {ref, computed, watch, onMounted} from 'vue';
import { useQuasar } from "quasar";
import { useServicios } from 'src/composables/useServicios.js'
import { useUsers } from 'src/composables/useUsers.js'

import archivos from 'components/admin/servicios/Archivos.vue'
// import { utils, writeFileXLSX } from 'xlsx';

const props = defineProps({
    servicio_id: String,
    data: Object
})

const servicio_id = ref(props.servicio_id)

const $q = useQuasar();
const storeUsers = useUsers();
const storeServicios = useServicios();
const { AppActiveUser } = storeUsers
const { generarNumDictamen } = storeServicios


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


onMounted(() => {
    
})
    

</script>