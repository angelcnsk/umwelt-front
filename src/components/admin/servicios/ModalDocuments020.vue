<template>
    <q-dialog v-model="ver" ref="modalDocs20" @hide="submitClose" persistent>
        <q-card style="min-width: 500px;">
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
                        label="Contenedor"
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
const selectContainers = computed(() => containers.map((item) => {
    return {id:item.id, label:item.name}
}));
const props = defineProps({
    show: Boolean,
});
const mostrar = toRef(props, 'show')
const ver = ref(mostrar == true);
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
    {value:'guia22', label:'Guía 22'}, 
    {value:'guia25', label:'Guía 25'},
    {value:'acta', label:'Acta RSP CAT III'},
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
    let url = `${import.meta.env.VITE_api_host}reportes/getreport/?service_id=${serviceItem.value.id}&document=${documentOptions.value.document.value}&visita_id=${documentOptions.value.visit.id}&container_id=${documentOptions.value.container.id}`

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
