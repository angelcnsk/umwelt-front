<template>
    <q-card flat class="rounded-borders overflow-hidden">
        <q-card-section>
            <fechas-component :changeVisit="configNom02" :categorias="categorias" />
        </q-card-section>
        <q-card-section>
            
            <q-list separator class="rounded-borders" v-if="service.id != undefined && categorias.length > 0">
                <q-expansion-item
                    group="categorias"
                    expand-separator
                    icon="category"
                    header-class="text-primary"
                    :label="`${categoria.texto}`" 
                    v-for="(categoria,index) in categorias" 
                    :key="categoria.id || index"
                    :caption="`${categoria.conceptos?.length || 0} ítems`"
                    class="bg-grey-2 rounded-borders q-mb-sm text-blue-grey-10"
                    :default-opened="index === 0"
                >
                <q-separator />
                <div v-if="categoria.conceptos && categoria.conceptos.length > 0" class="q-pa-md q-gutter-y-lg">
                    <div class="bg-white rounded-borders shadow-sm q-pa-md" v-for="(concepto,i) in categoria.conceptos" :key="i">
                        <!-- Pregunta -->
                        <div class="text-body1 text-weight-medium text-grey-9 q-mb-md">
                            <span class="text-pink-6">{{ concepto.global }})</span>
                            {{ concepto.texto }}
                        </div>
                        <div class="row q-pa-sm" v-if="concepto.value">
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="si" label="Si" color="orange" :disable="disableOptions('si',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="no" label="No" color="orange" :disable="disableOptions('no',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="cumple" label="Cumple" color="orange" :disable="disableOptions('cumple',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="no_cumple" label="No cumple" color="orange" :disable="disableOptions('no_cumple',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="na" label="N.A." color="orange" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="et" label="E.T." color="orange" />
                        </div>
                    </div>
                </div>
                <q-separator />
                <q-card-section class="bg-blue-grey-1">
                    <q-editor
                        class="q-editor-mb"
                        v-model="categoria.observaciones"
                        :dense="$q.screen.lt.md"
                        :toolbar="getEditorProps($q).toolbarActa"
                        :fonts="getEditorProps($q).fonts"
                        filled
                        clearable
                        min-height="10rem"
                        dmax-height="20rem"
                        color="red-12"
                        @blur="saveObservaciones(index)"
                    />
                </q-card-section>
                </q-expansion-item>
                
                <contentActa :service="service" :categorias="categorias" v-if="service.product_id == 1" />
            </q-list>
        </q-card-section>
        
    </q-card>
    
    <modal-acta :show="showActa" :service="service" @closeModal="getActa" />

</template>

<script setup>
import {onMounted, toRef, defineAsyncComponent, watch} from 'vue';
import { useQuasar } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js'
import {getEditorProps} from '../acta/editorProps'
const $q = useQuasar();

const storeCapturas = useCapturas();
const { setSelectVisitas, changeValue, saveObservaciones, configNom02, disableOptions, categorias, showActa } = storeCapturas;

const contentActa = defineAsyncComponent(() => import('src/components/admin/acta/ActaEditor.vue'))

const modalActa = defineAsyncComponent(() => import('src/components/admin/acta/ModalPrintActa.vue'))

const fechasComponent = defineAsyncComponent(() => import('src/components/admin/capturas/FechasComponent.vue'))

const props = defineProps({
    service: Object,
})

const service = toRef(props,'service')

watch(service, async () => {
    if (service.value != undefined) {
        setSelectVisitas();
    }
})

const getActa = () => {
    showActa.value = false    
}

onMounted( async () => {
    setSelectVisitas();
})

</script>

<style>
@media (max-width: 390px) {
    .q-editor-mb{
        max-width: 240px;
    }
}

@media (max-width: 900px) {
    .q-editor-mb{
        max-width: 650px;
    }
}

</style>