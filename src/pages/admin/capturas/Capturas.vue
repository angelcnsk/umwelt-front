<template>
<q-page class="q-pa-sm">
<div class="q-pa-md">
    <q-card rounded class="q-mb-md">
        <q-card-section>
            <div class="row">
                <div class="col-xs-12 col-md-4">            
                    <q-select :options="servicesList" option-label="service_name" v-model="serviceSelected" label="Servicio" style="width:95%" />
                </div>
                <!-- <div class="col-xs-12 col-md-4">            
                    <q-select :options="departments" option-label="department" v-model="departmentSelected" label="Departamento" style="width:95%" />
                </div>
                <div class="col-xs-12 col-md-4">            
                    <q-select :options="areas" option-label="area" v-model="areaSelected" label="Área" style="width:95%" />
                </div> -->
            </div>
        </q-card-section>
        <q-card-section>
            <div class="row q-gutter-sm">
                <!-- <q-btn label="verificar luxómetro" :disable="device==null" outline color="primary" @click="checkLuxo = !checkLuxo"> 
                    <q-tooltip>Abre ventana para ingresar valores de verificación de luxometro</q-tooltip>
                </q-btn> -->
                
                <!-- <q-btn label="guardar capturas" outline color="primary" @click="guardarLocal">
                    <q-tooltip>Guarda los valores capturados en tu dispositivo</q-tooltip>
                </q-btn>
                
                <q-btn label="limpiar datos" color="red-4" outline="" @click="cleanData">
                    <q-tooltip>Borra los valores capturados de tu dispositivo</q-tooltip>
                </q-btn>
                <q-btn label="Exportar" color="primary" outline="" @click="exportCapture">
                    <q-tooltip>Descarga las capturas realizadas</q-tooltip>
                </q-btn>
                <q-btn label="sincronizar" color="primary" :disable="!captureActive && bloquea" @click="sincronizar">
                    <q-tooltip class="text-center">
                        Guarda los valores capturados en el servidor<br>
                        Se debe guardar cada área
                    </q-tooltip>
                </q-btn> -->
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
import {getCurrentInstance, computed, onMounted, watch, ref, inject} from 'vue'
import { useQuasar, date } from "quasar";


import { useUsers } from 'src/composables/useUsers.js'
import { useCapturas } from 'src/composables/useCapturas.js'
import { searchDocuments, createDocument } from "src/composables/firebase/capturas/nom02/documentos.js";

import documentacion from 'src/components/admin/capturas/Documentacion.vue'
import guiaConceptos from 'src/components/admin/capturas/GuiaConceptos.vue'
import archivos from 'src/components/admin/capturas/ArchivosMasivos.vue'
import gestion from 'src/components/admin/capturas/GestionServicio.vue'
// import { utils, writeFileXLSX } from 'xlsx';

const storeUsers = useUsers();
const storeCapturas = useCapturas();
const $q = useQuasar();

const { getServiceList, servicesList, currentService } = storeCapturas
const { AppActiveUser } = storeUsers
const notify = (msg, type) => {
    $q.notify({
        position:'top',
        type,
        message:msg
    })
}

const servicio = computed(() => {
    return serviceItem.value
})

const serviceSelected = ref(null)

const offline = inject('statusOnLine')

const dataOffline = ref([])
const disableSync = ref(false)
const secciones = ref([])
const guiaconceptos = ref([])

const tab = ref('documentacion')

const inst = getCurrentInstance()

const formDate =  (date) => {
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 101).toString().substring(1)
    const day = (date.getDate() + 100).toString().substring(1)
    return `${year  }-${  month  }-${  day}`
}

const cleanData = () => {
    
    $q.dialog({
        title: '¿Estás seguro?',
        message: 'Esta acción borrará toda la información guardada en tu dispositivo',
        ok: {
            push: true,
            label:'Si, borrar',
            color:'red-4'
        },
        cancel: {
            push: true,
            color: 'dark',
            label:'Cancelar'
        },
        persistent: true
    }).onOk(async data => {
        
        const servicios = JSON.parse(localStorage.getItem(`serviceList`))
        const areas = JSON.parse(localStorage.getItem(`areas_capturadas`))
        
        if(servicios != null){
            servicios.forEach((item) => {
                localStorage.removeItem(`service_data${item.id}`)
            })
        }
        if(areas != null){
            areas.forEach((item) => {
                localStorage.removeItem(`capturePointsArea_${item}`)
            })
        }
        localStorage.removeItem(`luxometro`)
        localStorage.removeItem(`serviceList`)
        localStorage.removeItem(`deviceList`)
        localStorage.removeItem(`areas_capturadas`)
        
        notify('Se borró la información guardada sin conexión', 'positive')
    })
        
}

    // const exportCapture = () => {
    //     const listaStores = Object.keys(localStorage)
    //     const puntos = []
    //     listaStores.find(store => {
    //         if(store.substring(0,14) == 'capturePoints_'){
    //             const dataCapture = JSON.parse(localStorage.getItem(`${store}`))
    //             dataCapture.forEach(item => {
    //                 delete item.producto, 
    //                 delete item.norma, 
    //                 delete item.categoria_norma, 
    //                 delete item.department_id, 
    //                 delete item.department, 
    //                 delete item.status, 
    //                 delete item.created_at, 
    //                 delete item.updated_at,
    //                 delete item.deleted_at,
    //                 delete item.service_name, 
    //                 delete item.selected
    //                 item.fo_aml_01_4_id = item.fo_aml_01_4_id != null ? item.fo_aml_01_4_id.fo_aml_01_4 : null
    //                 puntos.push(item)
    //             })
    //         }
    //     })
        
    //     if(puntos.length>0){
    //         const ws = utils.json_to_sheet(puntos)
    //         const wb = utils.book_new();
    //         utils.book_append_sheet(wb, ws, "capturas_puntos_medicion");
    //         writeFileXLSX(wb, "capturas.xlsx");
    //     } else notify('No hay información para exportar', 'negative')
    // }

watch(serviceSelected, async (item) => {
    if (serviceSelected.value !== null) {
        if(!offline.value){
            await getServiceList(serviceSelected.value.id)
        } else {
            const serviceData = JSON.parse(localStorage.getItem('serviceData'))
            if(serviceSelected.value.id == serviceData.id) currentService.value = serviceData
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