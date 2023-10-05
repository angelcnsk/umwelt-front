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
            v-model="tab"
            inline-label
            outside-arrows
            mobile-arrows
            class="bg-primary text-white shadow-2"
        >
            <q-tab name="documentacion" label="Documentación" />
            <q-tab name="inspeccion" label="Inspección" />
            <q-tab name="archivos" label="Archivos" />
            <q-tab name="gestion" label="Gestión" />
        </q-tabs>
        
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="documentacion">
            <documentacion :secciones="secciones" :service="currentService" />
          </q-tab-panel>

          <q-tab-panel name="inspeccion">
            <guia-conceptos :service="currentService" />
          </q-tab-panel>

          <q-tab-panel name="archivos">
            <archivos :service="currentService" />
          </q-tab-panel>
          <q-tab-panel name="gestion">
            <gestion :service="currentService" />
          </q-tab-panel>
        </q-tab-panels>
      
    </div>
</div>
</q-page>
</template>

<script setup>
import {onMounted, watch, ref, inject, defineAsyncComponent} from 'vue'
import { useQuasar } from "quasar";


import { useUsers } from 'src/composables/useUsers.js'
import { useCapturas } from 'src/composables/useCapturas.js'
import { searchDocuments, createDocument } from "src/composables/firebase/capturas/nom02/documentos.js";

const documentacion = defineAsyncComponent(() => import('src/components/admin/capturas/Documentacion.vue'))

const guiaConceptos = defineAsyncComponent(() => import('src/components/admin/capturas/GuiaConceptos.vue'))

const archivos = defineAsyncComponent(() => import('src/components/admin/capturas/ArchivosMasivos.vue'))

const gestion = defineAsyncComponent(() => import('src/components/admin/capturas/GestionServicio.vue'))

const storeUsers = useUsers();
const storeCapturas = useCapturas();
const { getServiceList, servicesList, currentService } = storeCapturas
const { AppActiveUser } = storeUsers

const serviceSelected = ref(null)
const offline = inject('statusOnLine')
const secciones = ref([])
const guiaconceptos = ref([])

const tab = ref('documentacion')

const formDate =  (date) => {
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 101).toString().substring(1)
    const day = (date.getDate() + 100).toString().substring(1)
    return `${year  }-${  month  }-${  day}`
}

watch(serviceSelected, async (item) => {
    if (serviceSelected.value !== null) {
        const serviceData = JSON.parse(localStorage.getItem('serviceData'))

        if(serviceData != null){
            //si existe en localstorage se usa para evitar sobreescribir datos
            if(serviceSelected.value.id == serviceData.id) currentService.value = serviceData  
        } else {
            //si no existe en local se obtiene la información y se hace el set
            await getServiceList(serviceSelected.value.id)
        }
        setDataService()
    }
})

const setDataService = async () => {
    let empty = true
    secciones.value = currentService.value.secciones

    //si hay internet recupero la data
    //obtengo los documentos del servicio
    if(!offline.value){
        let documents = await searchDocuments({
            service_id: currentService.value.id
        })

        if(documents == undefined){
            empty = true
            //si no existen documentos se crean
            secciones.value.forEach(async (seccion) => {
                seccion.documents.forEach(async (document) => {
                    await createDocument({
                        global:document.global,
                        seccion_id:seccion.id,
                        doc_id:document.id,
                        service_id:currentService.value.id,
                        value:'',
                        user_id:AppActiveUser.value.id,
                    })
                })
            })
        }
        
        if(empty){
            //si no había documentos y se crearon, los recupero
            documents = await searchDocuments({
                service_id: currentService.value.id
            })
        }
        
        if(documents != undefined){
            documents.forEach((document) => {
                currentService.value.secciones.forEach((seccion) => {
                    seccion.documents.forEach((doc) => {
                        if(doc.id === document.doc_id){
                            doc.filled_i = document.value
                            doc.uid = document.uid
                        }
                    })
                })
            })
        }
        //se actualiza el localstorage con la data
        localStorage.setItem('serviceData', JSON.stringify(currentService.value))
    } else {
        //si al seleccionar servicio no hay internet
        //se agrega el valor en vacío para que se pueda llenar el form
        currentService.value.secciones.forEach((seccion) => {
            seccion.documents.forEach((doc) => {
                doc.filled_i = ''
            })
        })
    }
    guiaconceptos.value = currentService.value.categorias
}

onMounted( async () => {
    if (!offline.value) {
        //hay conexión a internet
        await getServiceList()
    } else {
        servicesList.value = JSON.parse(localStorage.getItem('serviceList'))
        console.log(servicesList.value)
    }
}) 

</script>