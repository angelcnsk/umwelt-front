<template>
    <q-dialog v-model="ver" ref="actaEvaluacion" @hide="submitClose">
        <q-card style="min-width: 500px;">
            <q-card-section>
                <span class="text-title">Personas que atienden la visita</span>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.persona1" label="Nombre persona 1" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.cargo1" label="Cargo persona 1" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.persona2" label="Nombre persona 2" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.cargo2" label="Cargo persona 2" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.testigo1" label="Nombre testigo 1" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.testigo_cargo1" label="Cargo testigo 1" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.testigo2" label="Nombre testigo 2" />
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-input class="q-pa-sm" v-model="dataActa.testigo_cargo2" label="Cargo testigo 2" />
                </div>
                <div class="row q-pa-md justify-end">
                    <q-btn label="Descargar" color="primary" @click="submitData"/>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import {ref, computed, watch, onMounted, defineAsyncComponent, inject, toRef} from 'vue';

const props = defineProps({
    show: Boolean,
})
const mostrar = toRef(props, 'show')
const ver = ref(mostrar == true)

const dataActa = ref({})

const emits = defineEmits(['closeModal']);

const submitData = () => {
    emits('closeModal',dataActa)
}

const submitClose = () => {
    ver.value = false
    emits('closeModal')
}

watch(mostrar,(valor) => {
    ver.value = valor
},{deep:true})


</script>
