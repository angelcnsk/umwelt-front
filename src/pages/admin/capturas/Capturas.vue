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
    
    <div class="q-mt-md">
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

          <q-tab-panel name="inspeccion">
            <div class="q-pa-md" v-if="Object.entries(currentService).length==0">
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
            <guia-conceptos v-else-if="currentService.product_id == 1" :service="currentService" />
              
          </q-tab-panel>
            <q-tab-panel name="guia22">
                <guia-22 :service="currentService" /> 
            </q-tab-panel>
            <q-tab-panel name="guia25">

            </q-tab-panel>

          <!-- <q-tab-panel name="archivos">
            <archivos :service="currentService" />
          </q-tab-panel> -->
          <!-- <q-tab-panel name="gestion">
            <gestion :service="currentService" />
          </q-tab-panel> -->
        </q-tab-panels>
      
    </div>
</div>
</q-page>
</template>

<script setup>
import {onMounted, watch, ref, inject, defineAsyncComponent} from 'vue'

import { useCapturas } from 'src/composables/useCapturas.js'

const guiaConceptos = defineAsyncComponent(() => import('src/components/admin/capturas/GuiaConceptos.vue'))
const guia22 = defineAsyncComponent(() => import('src/components/admin/capturas/Guia22.vue'))

const storeCapturas = useCapturas();
const { getServiceList, servicesList, currentService } = storeCapturas

const serviceSelected = ref(null)
const online = inject('statusOnLine')
const secciones = ref([])

const tab = ref('inspeccion')

const formDate =  (date) => {
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 101).toString().substring(1)
    const day = (date.getDate() + 100).toString().substring(1)
    return `${year  }-${  month  }-${  day}`
}

watch(serviceSelected, async (item) => {
    if (serviceSelected.value !== null) {
        currentService.value = serviceSelected.value
    }
})

const setDataService = async (type) => {
    let empty = true
    secciones.value = currentService.value.secciones

    //si hay internet recupero la data
    //obtengo los documentos del servicio
    if(online.value){
        if(type == 'remote'){
            // let documents = await searchDocuments({
            //     service_id: currentService.value.id
            // })

            // if(documents == undefined){
            //     empty = true
            //     //si no existen documentos se crean
            //     secciones.value.forEach(async (seccion) => {
            //         seccion.documents.forEach(async (document) => {
            //             await createDocument({
            //                 global:document.global,
            //                 seccion_id:seccion.id,
            //                 doc_id:document.id,
            //                 service_id:currentService.value.id,
            //                 value:'',
            //                 user_id:AppActiveUser.value.id,
            //             })
            //         })
            //     })
            // }
            // if(empty){
            // //si no había documentos y se crearon, los recupero
            //     documents = await searchDocuments({
            //         service_id: currentService.value.id
            //     })
            // }
            
            // if(documents != undefined){
            //     documents.forEach((document) => {
            //         currentService.value.secciones.forEach((seccion) => {
            //             seccion.documents.forEach((doc) => {
            //                 if(doc.id === document.doc_id){
            //                     doc.filled_i = document.value
            //                     doc.uid = document.uid
            //                 }
            //             })
            //         })
            //     })
            // }
        } 
        
        //se actualiza el localstorage con la data
        // localStorage.setItem(`service_${currentService.value.id}_data`, JSON.stringify(currentService.value))
    } else {
        //si al seleccionar servicio no hay internet o se busca en local
        //se agrega el valor en vacío para que se pueda llenar el form
        // if(type == 'remote'){
        //     currentService.value.secciones.forEach((seccion) => {
        //         seccion.documents.forEach((doc) => {
        //             doc.filled_i = ''
        //         })
        //     })
        // }
    }
    // guiaconceptos.value = currentService.value.categorias
}

onMounted( async () => {
    if (online.value) {
        //hay conexión a internet
        await getServiceList()
    } else {
        servicesList.value = JSON.parse(localStorage.getItem('serviceList'))
    }
}) 

</script>