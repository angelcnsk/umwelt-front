<template>
<q-page class="q-pa-sm">
<div class="q-pa-md">
    <q-card rounded class="q-mb-md">
        <q-card-section>
            <div class="row">
                <div class="col-xs-12 col-md-4">            
                    <q-select :options="servicesList" option-label="service_name" v-model="serviceSelected" label="Servicio" style="width:95%" />
                </div>
            </div>
        </q-card-section>
    </q-card>
    
    <div class="q-mt-md" v-if="Object.entries(currentService).length==0">
        <div class="q-pa-md">
            <q-item style="max-width: 300px">
            <q-item-section avatar>
                <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
                <q-item-label>
                <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                <q-skeleton type="text" width="65%" />
                </q-item-label>
            </q-item-section>
            </q-item>

            <q-item style="max-width: 300px">
            <q-item-section avatar>
                <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
                <q-item-label>
                <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                <q-skeleton type="text" width="90%" />
                </q-item-label>
            </q-item-section>
            </q-item>

            <q-item style="max-width: 300px">
            <q-item-section avatar>
                <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
                <q-item-label>
                <q-skeleton type="text" width="35%" />
                </q-item-label>
                <q-item-label caption>
                <q-skeleton type="text" />
                </q-item-label>
            </q-item-section>
            </q-item>
        </div>
    </div>
    <div v-else>
        <q-tabs
            no-swipe
            v-model="tab"
            inline-label
            outside-arrows
            mobile-arrows
            class="bg-primary text-white shadow-2"
            
        >
            <!-- <q-tab name="documentacion" label="Documentación" /> -->
            <q-tab v-if="currentService.product_id == 1" name="inspeccion" label="Inspección" />
            <q-tab v-if="currentService.product_id == 2" name="guia22" label="Guía 22" />
            <q-tab v-if="currentService.product_id == 2" name="guia25" label="Guía 25" />
            <!-- <q-tab name="archivos" label="Archivos" /> -->
            
        </q-tabs>
        
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <!-- <q-tab-panel name="documentacion">
            <documentacion :secciones="secciones" :service="currentService" />
          </q-tab-panel> -->
            
            <q-tab-panel v-if="currentService.product_id == 1" name="inspeccion">
                <guia-inspeccion :service="currentService"/>
            </q-tab-panel>
            <q-tab-panel v-if="currentService.product_id == 2" name="guia22">
                <guia-nom20 :service="currentService"/> 
            </q-tab-panel>
            <q-tab-panel v-if="currentService.product_id == 2" name="guia25">
                <guia-nom20 :service="currentService"/> 
            </q-tab-panel>
        </q-tab-panels>
    </div>
</div>
</q-page>
</template>

<script setup>
import {onMounted, watch, ref, inject, defineAsyncComponent} from 'vue'

import { useCapturas } from 'src/composables/useCapturas.js'

const GuiaInspeccion = defineAsyncComponent(() => import('src/components/admin/capturas/GuiaInspeccion.vue'));

const GuiaNom20 = defineAsyncComponent(() => import('src/components/admin/capturas/GuiaNom20.vue'));

const storeCapturas = useCapturas();
const { getServiceList, servicesList, currentService, serviceSelected, tab, recipienteSelected } = storeCapturas
const online = inject('statusOnLine')

watch(serviceSelected, async (item) => {
    if (serviceSelected.value !== null) {
        currentService.value = serviceSelected.value
        tab.value = currentService.value.product_id == 1 ? 'inspeccion' : 'guia22'
    }
});

watch(tab,() => {
    if(serviceSelected.value.product_id == 2) recipienteSelected.value = null
})

onMounted( async () => {
    if (online.value) {
        //hay conexión a internet
        await getServiceList()
    } else {
        servicesList.value = JSON.parse(localStorage.getItem('serviceList'))
    }
}) 

</script>