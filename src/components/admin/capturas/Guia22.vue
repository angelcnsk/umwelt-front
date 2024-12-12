<template>
    <q-card>
        <q-card-section>
            <fechas-component :visitas="visitas" :changeVisit="configService" :categorias="categorias" />
        </q-card-section>
    </q-card>
</template>

<script setup>
import {ref, computed, onMounted, toRef, inject, provide, defineAsyncComponent} from 'vue';
import { useQuasar, date } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js'

const storeCapturas = useCapturas();
const { saveDataCategories, fetchCategories, fetchResult, saveLocalObservations, saveLocalResults, fetchObservations, getDates,setVisitas, fechas_visita, visitSelected, showActa, visitas } = storeCapturas;

const fechasComponent = defineAsyncComponent(() => import('src/components/admin/capturas/FechasComponent.vue'))

const configService = () => {

}

onMounted(() => {
    setVisitas()
})
</script>
