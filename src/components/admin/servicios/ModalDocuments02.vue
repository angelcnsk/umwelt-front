<template>
    <q-dialog v-model="ver" ref="modalDocs20" @hide="submitClose" persistent>
        <q-card style="min-width: 500px;">
            <q-card-section class="text-center"><span class="text-h6 text-center">Documentos de servicio</span></q-card-section>
            <q-card-section>
                <div class="col-xs-12 col-md-3">
                    <q-select 
                        class="q-ma-sm" 
                        :options="visitas"
                        option-label="label"
                        option-value="id"
                        v-model="documentOptions.visit"
                        label="Visita"
                    />
                </div>
            </q-card-section>
            <q-card-section>
                <div class="col-xs-12 col-md-3">
                    <q-select 
                        class="q-ma-sm" 
                        :options="contenedores"
                        option-label="label"
                        option-value="id"
                        v-model="documentOptions.container"
                        label="Recipiente"
                    />
                </div>
            </q-card-section>
            <q-card-section>
                <div class="col-xs-12 col-md-3">
                    <q-select 
                        class="q-ma-sm" 
                        :options="selectDocs"
                        option-label="label"
                        option-value="value"
                        v-model="documentOptions.document"
                        label="Documento"
                    />
                </div>
            </q-card-section>
            <q-card-section v-if="documentOptions.document && documentOptions.document.value == 3" class="q-pa-md">
                <div class="col-xs-12 q-pa-sm">
                    <q-input v-model="documentOptions.atiende" label="Nombre atendió visita" />
                </div>
                <div class="col-xs-12 q-pa-sm">
                    <q-input v-model="documentOptions.cargo" label="Cargo atendió visita" />
                </div>

                <div class="col-xs-12 q-pa-sm">
                    <q-input v-model="documentOptions.testigo1" label="Nombre testigo 1" />
                </div>
                <div class="col-xs-12 q-pa-sm">
                    <q-input v-model="documentOptions.domicilio_testigo1" label="Domicilio testigo 1" />
                </div>

                <div class="col-xs-12 q-pa-sm">
                    <q-input v-model="documentOptions.testigo2" label="Nombre testigo 2" />
                </div>
                <div class="col-xs-12 q-pa-sm">
                    <q-input v-model="documentOptions.domicilio_testigo2" label="Domicilio testigo 2" />
                </div>

            </q-card-section>
            <q-card-section>
                <div class="row q-pa-md justify-end">
                    <q-btn label="Cancelar" color="black" class="q-mr-sm" @click="ver=!ver"/>
                    <q-btn label="Descargar" color="primary" @click="validateGetDoc"/>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, computed, toRef, watch } from "vue";
import { useServicios } from 'src/composables/useServicios.js';
import { useQuasar } from "quasar";
const {containers,serviceItem} = useServicios();
const $q = useQuasar();

const props = defineProps({
    show: Boolean,
});
const mostrar = toRef(props, 'show')
const ver = ref(mostrar.value == true);
const emits = defineEmits(['closeModal']);

const visitas = computed(() => {
    return serviceItem.value.fechas.map((item) => {
        return {id:item.id, label:`Visita ${item.visita}`}
    });
});

const contenedores = computed(() => {
    return containers.value.map((item) => {
        return {id:item.id, label:`${item.name} - ${item.serial}` }
    });
});

const selectDocs = ref([
    {value:1, label:'Guía 22'}, 
    {value:2, label:'Guía 25'},
    {value:3, label:'Acta RSP CAT III'},
])

const documentOptions = ref({service_id:null, visit:null, container:null, document:null})

const validateGetDoc = () => {
    if(documentOptions.value.container === null || documentOptions.value.document === null || documentOptions.value.visit === null){
        $q.notify({
          position:'top',
          type:'negative',
          message:'Para continuar selecciona todos los campos'
        })
        return false;
    }
    let url = ''

    if(documentOptions.value.document.value == 3){
        url = `${import.meta.env.VITE_api_host}reportes/getreport?service_id=${serviceItem.value.id}&document=${documentOptions.value.document.value}&visita_id=${documentOptions.value.visit.id}&container_id=${documentOptions.value.container.id}&reporte=${documentOptions.value.document.value}&atiende=${documentOptions.value.atiende}&cargo=${documentOptions.value.cargo}&testigo1=${documentOptions.value.testigo1}&domicilio_testigo1=${documentOptions.value.domicilio_testigo1}&testigo2=${documentOptions.value.testigo2}&domicilio_testigo2=${documentOptions.value.domicilio_testigo2}&product_id=${serviceItem.value.product_id}`
    } else {
        url = `${import.meta.env.VITE_api_host}reportes/getreport?service_id=${serviceItem.value.id}&document=${documentOptions.value.document.value}&visita_id=${documentOptions.value.visit.id}&container_id=${documentOptions.value.container.id}&reporte=${documentOptions.value.document.value}&product_id=${serviceItem.value.product_id}`
    }


    documentOptions.value = {service_id:null, visit:null, container:null, document:null};
    ver.value = false
    window.open(url,'_blank')
}

const submitClose = () => {
    ver.value = false
    emits('closeModal')
}

watch(mostrar,(valor) => {
    ver.value = valor
},{deep:true})
</script>
