<template>
    <q-dialog v-model="ver" ref="actaEvaluacion" @hide="submitClose">
        <q-card style="min-width: 500px;">
            <q-card-section>
                <span class="text-title">Personas que atienden la visita</span>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.persona1" label="Nombre atiende la visita" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.cargo1" label="Cargo atiende la visita" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.persona2" label="Nombre atiende la visita 2" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.cargo2" label="Cargo atiende la visita 2" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.testigo1" label="Nombre testigo 1" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.testigo_cargo1" label="Domicilio testigo 1" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.testigo2" label="Domicilio testigo 2" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.testigo_cargo2" label="Cargo testigo 2" />
                </div>
                <div class="row q-pa-md justify-end">
                    <q-btn label="Descargar" color="primary" @click="imprimir('acta')"/>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import {ref, watch, toRef} from 'vue';
import { useQuasar } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js';
const storeCapturas = useCapturas();
const { currentService, visitSelected } = storeCapturas;

const $q = useQuasar();

const imprimir = (doc) => {
    
    let url = import.meta.env.VITE_api_host
    switch (doc) {
        case 'guia inspeccion':
            url = `${url}reportes/getreport?service_id=${currentService.value.id}&reporte=3&visita_id=${visitSelected.value.id}`
            break;

        case 'acta':{
            if(dataActa.value.persona1 == undefined || dataActa.value.persona1 == ''
                || dataActa.value.cargo1 == undefined || dataActa.value.cargo2 == ''
                // || dataActa.value.persona2 == undefined || dataActa.value.persona2 == ''
                // || dataActa.value.cargo2 == undefined || dataActa.value.cargo2 == ''
                // || dataActa.value.testigo1 == undefined || dataActa.value.testigo1 == ''
                // || dataActa.value.testigo_cargo1 == undefined || dataActa.value.testigo_cargo1 == ''
                // || dataActa.value.testigo2 == undefined || dataActa.value.testigo2 == ''
                // || dataActa.value.testigo_cargo2 == undefined || dataActa.value.testigo_cargo2 == ''
                
            ){
                $q.notify({
                    position:'top',
                    type:'negative',
                    message:'Para continuar agrega al menos un nombre y cargo de quien atiende la visita',
                    timeout:3000
                })
                return false
            }
            const queryString = Object.keys(dataActa.value)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(dataActa.value[key]))
            .join('&');
            
            url = `${url}reportes/getreport?service_id=${currentService.value.id}&reporte=2&${queryString}&visita_id=${visitSelected.value.id}`
            
            dataActa.value = {}
            submitClose();
        }
            
    }

    window.open(url,'_blank')
}


const props = defineProps({
    show: Boolean,
})
const mostrar = toRef(props, 'show')
const ver = ref(mostrar.value == true)

const dataActa = ref({})

const emits = defineEmits(['closeModal']);

// const submitData = () => {
//     // emits('closeModal',dataActa)
//     imprimir(showActa.value)
// }

const submitClose = () => {
    ver.value = false
    emits('closeModal')
}

watch(mostrar,(valor) => {
    ver.value = valor
},{deep:true})


</script>
