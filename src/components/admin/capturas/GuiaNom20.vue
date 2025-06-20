<template>
    <q-card>
        <q-card-section>
            <fechas-component :changeVisit="configNom020" :categorias="categorias" />
        </q-card-section>
        <q-card-section>
            
            <q-list bordered class="rounded-borders" v-if="service.id != undefined && categorias.length > 0 && recipienteSelected">
                <q-expansion-item
                    group="somegroup"
                    expand-separator
                    icon="ads_click"
                    header-class="text-primary"
                    :label="`${categoria.texto}`" v-for="(categoria,index) in categorias" :key="index"
                    style="border: .2px solid gray"
                >
                <q-separator />
                <div v-if="categoria.conceptos && categoria.conceptos.length > 0" style="height: 250px; overflow-y: scroll; border:1px solid">
                    <div class="q-pa-md" v-for="(concepto,i) in categoria.conceptos" :key="i">
                        <div class="row wrap q-pa-sm">
                            <span class="text-justify"><span class="text-caption">{{ `${concepto.global})`  }}</span> {{concepto.texto  }}</span>
                        </div>
                        <div class="row q-pa-sm" v-if="concepto.value">
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="si" label="Si" color="orange" :disable="disableOptions('si',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="no" label="No" color="orange" :disable="disableOptions('no',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="cumple" label="Cumple" color="orange" :disable="disableOptions('cumple',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="no_cumple" label="No cumple" color="orange" :disable="disableOptions('no_cumple',index,i)" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="na" label="N.A." color="orange" />
                            <q-checkbox v-model="concepto.value" @click="changeValue(index, i)" val="et" label="E.T." color="orange" />
                        </div>
                        <div class="q-pa-md">
                            <q-editor
                                @blur="changeValue(index, i)"
                                v-model="concepto.observaciones"
                                ref="editors"
                                min-height="1rem"
                                max-height="3rem"
                                :toolbar="[
                                    ['bold', 'italic', 'underline'],
                                    ['subscript', 'superscript'], // Puedes agregarlo directamente
                                    ['removeFormat'],
                                ]"
                            />
                        </div>
                    </div>
                </div>
                
                </q-expansion-item>
            </q-list>
        </q-card-section>
    </q-card>
</template>

<script setup>
import {onMounted, defineAsyncComponent, toRef} from 'vue';
import { useCapturas } from 'src/composables/useCapturas.js'

const storeCapturas = useCapturas();
const { setSelectVisitas, changeValue, configNom020, disableOptions, categorias, recipienteSelected } = storeCapturas;

const props = defineProps({
    service: Object,
})

const service = toRef(props,'service')

const fechasComponent = defineAsyncComponent(() => import('src/components/admin/capturas/FechasComponent.vue'))

onMounted(() => {
    setSelectVisitas();
})
</script>
