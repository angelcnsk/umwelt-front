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

<script>
import {defineComponent,getCurrentInstance, computed, onMounted, watch, ref, onBeforeMount} from 'vue'
import { useQuasar, date } from "quasar";


import { useUsers } from 'src/composables/useUsers.js'
import { useCapturas } from 'src/composables/useCapturas.js'

import documentacion from 'src/components/admin/capturas/Documentacion.vue'
import guiaConceptos from 'src/components/admin/capturas/GuiaConceptos.vue'
import archivos from 'src/components/admin/capturas/ArchivosMasivos.vue'
import gestion from 'src/components/admin/capturas/GestionServicio.vue'
// import { utils, writeFileXLSX } from 'xlsx';

export default defineComponent({
name: 'Capturas',
components:{
    documentacion,
    guiaConceptos,
    archivos,
    gestion
},
setup () {
    const storeUsers = useUsers();
    const storeCapturas = useCapturas();
    const $q = useQuasar();

    const { AppActiveUser } = storeUsers
    const { getServiceList, servicesList,
        currentService, saveSectionFile
    } = storeCapturas

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
    
    // const offline = computed(() => store.state.app.offline)
    
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
        console.log(item)
        
        if (serviceSelected.value !== null) {
            await getServiceList(serviceSelected.value.id)
            setDataService()
            // setDataOffline(departments.value, 'departments')
        }
        // }
    })

    const setDataService = () => {
        secciones.value = currentService.value.secciones
        if(currentService.value.docs_guardados.length > 0){
            currentService.value.docs_guardados.forEach((docSave)=>{
                currentService.value.secciones.forEach((element)=>{
                    element.documents.forEach((doc)=>{
                        if(doc.id === docSave.doc_id){
                            doc.filled_i = docSave.value
                        }
                    })
                })
            })
        }

        
        guiaconceptos.value = currentService.value.categorias
        
    }

    const guardarLocal = () => {
        if(displayPoints.value != undefined){
            displayPoints.value.localDot()
        }
    }
    

    onMounted( async () => {  
        if (window.navigator.onLine) {
            await getServiceList()
        } else {
            // store.commit('app/SET_OFFLINE_MOD', true)
        }
    })

    return {
        serviceSelected,
        servicesList,
        currentService,
        guiaconceptos,
        secciones,
        tab,
        
    }
}
})    

</script>