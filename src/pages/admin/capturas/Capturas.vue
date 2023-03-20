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
                <q-btn label="verificar luxómetro" :disable="device==null" outline color="primary" @click="checkLuxo = !checkLuxo"> 
                    <q-tooltip>Abre ventana para ingresar valores de verificación de luxometro</q-tooltip>
                </q-btn>
                
                <q-btn label="guardar capturas" outline color="primary" @click="guardarLocal">
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
                </q-btn>
            </div>
        </q-card-section>
    </q-card>

    <div class="row q-pa-md bg-warning q-mt-md justify-center rounded" v-if="device != null && device.end_value == undefined ">
        <span class="text-subtitle2 text-center" 
            v-if="device.end_value == undefined"
        >
            Falta ingresar el valor final de la verificación de luxómetro, favor de ingresarlo previo a cerrar capturas
        </span>
            
    </div>

    <div class="q-mt-md" v-show="puntos_captura.length > 0 && !bloquea ">
        <capture-illumination 
            ref="displayPoints"
            :show="showPoints" 
            :puntos="puntos_captura" 
            :area="areaSelected"
            v-if="typeProduct === 1" 
        />
    </div>
    <q-dialog v-model="checkLuxo" transition-show="flip-down" transition-hide="flip-up" persistent>
        <q-card class="q-dialog-plugin">
            <q-card-section>
                <q-input v-model="device.identificador" label="Luxómetro" :disable="true" />
            </q-card-section>
            <q-card-section>
                <div class="row justify-between">
                    <div class="col-md-5" style="">
                        <q-input type="number" label="Valor inicial" v-model="device.start_value" style="width:95%" min="0" step=".1" />
                    </div>
                    <div class="col-md-5">
                        <q-input type="number" label="Valor final" v-model="device.end_value" style="width:95%" min="0" step=".1" />
                    </div>
                </div>
            </q-card-section>
            <!-- buttons example -->
            <q-card-actions align="right">
                <q-btn color="dark" label="Cancelar" v-close-popup />
                <q-btn color="primary" label="Guardar" @click="saveLuxometro" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</div>
</q-page>
</template>

<script>
import {defineComponent,getCurrentInstance, computed, onMounted, watch, ref, onBeforeMount} from 'vue'
import { useQuasar, date } from "quasar";


import { useUsers } from 'src/composables/useUsers.js'
import { useCapturas } from 'src/composables/useCapturas.js'

import captureIllumination from 'src/components/admin/capturas/PuntosIluminacion.vue'
import { utils, writeFileXLSX } from 'xlsx';

export default defineComponent({
name: 'Capturas',
components:{
    captureIllumination
},
setup () {
    const storeUsers = useUsers();
    const storeCapturas = useCapturas();
    const $q = useQuasar();

    const { AppActiveUser } = storeUsers
    const { getServiceList, servicesList, a_points, captureActive,
        currentService, getAreas, areas, fo_aml_01_4, luxometro
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
    const departmentSelected = ref(null)
    const areaSelected = ref(null)
    
    const departments = ref([])
    const typeProduct = ref(0)
    
    const puntos_captura = ref([])
    
    const checkLuxo = ref(false)
    const showPoints = ref(false)
    const displayPoints = ref()
    // const offline = computed(() => store.state.app.offline)
    
    const dataOffline = ref([])
    
    const bloquea = ref(true)
    const device = ref(null)
    const disableSync = ref(false)

    const inst = getCurrentInstance()

    const config_puntos = () => {
        if(a_points.value.length>0){
            const user_id = a_points.value[0].user_id
            const localPoints = JSON.parse(localStorage.getItem(`capturePoints_${user_id}`))
            
            if (localPoints !== undefined && localPoints !== null) {
                puntos_captura.value = localPoints
                bloquea.value = false
                verificarLuxometroDia()
                return false
            }
        }

        const req = a_points.value
        
        if (req.length > 0) {
            localStorage.setItem(`capturePoints_${req[0].user_id}`, JSON.stringify(req))
            const resp = JSON.parse(localStorage.getItem(`capturePoints_${req[0].user_id}`))
                localStorage.removeItem(`capturePoints_${req[0].user_id}`)

            resp.forEach((item) => {
                if (item.fo_aml_01_4_id > 0) {
                    item.fo_aml_01_4_id = fo_aml_01_4.value.filter(element => element.id === item.fo_aml_01_4_id)[0]
                }
            })

            puntos_captura.value = resp
        } else {
            puntos_captura.value = []
        }
        verificarLuxometroDia()
    }

    const verificarLuxometroDia = () => {
        const today = formDate(new Date())
        const storeluxometro = JSON.parse(localStorage.getItem('luxometro'))

        if (storeluxometro !== null) {
            device.value = storeluxometro
            if (device.value.date < today) {
                localStorage.removeItem(`luxometro`)
                notify('Es necesario que verifques el luxometro','negative')
                
                device.value = luxometro.value
                return false
            }
        } else {
            notify('Es necesario que verifques el luxometro','negative')
            console.log(luxometro.value)
            device.value = luxometro.value
        }
        bloquea.value = false
    }

    watch(checkLuxo, (val) => {
        if(val){
            const storeluxometro = JSON.parse(localStorage.getItem('luxometro'))
            device.value = storeluxometro != null ? storeluxometro : luxometro.value
        }
    })

    const formDate =  (date) => {
        const year = date.getFullYear().toString()
        const month = (date.getMonth() + 101).toString().substring(1)
        const day = (date.getDate() + 100).toString().substring(1)
        return `${year  }-${  month  }-${  day}`
    }

    const saveLuxometro = () => {
        if (device.value.start_value === undefined && device.value.end_value === undefined) {
            notify('Por favor ingresa un valor válido','negative')
        }

        if (device.value.start_value !== undefined && device.value.start_value !== '' && device.value.end_value === undefined) {
            device.value.date = formDate(new Date())
            localStorage.setItem('luxometro', JSON.stringify(device.value))
            notify('No olvides ingresar el valor final, al terminar tus capturas', 'warning')
            bloquea.value = false
            setTimeout(() => { checkLuxo.value = false }, 500)
        }

        if (device.value.end_value !== undefined && device.value.end_value !== '') {
            localStorage.setItem('luxometro', JSON.stringify(device.value))
            
            puntos_captura.value.map(punto => punto.capture_date == device.value.date ? punto.lux_end = device.value.end_value : punto.lux_end)
            localStorage.setItem(`capturePoints_${puntos_captura.value[0].user_id}`, JSON.stringify(puntos_captura.value))
            setTimeout(() => { checkLuxo.value = false }, 500)
        }
        console.log('bloquea', bloquea.value)
    }

// const setDataOffline = (data, node) => {
//     const offlineData = JSON.parse(localStorage.getItem(`service_data${serviceSelect.value.id}`)) != null ? JSON.parse(localStorage.getItem(`service_data${serviceSelect.value.id}`)) : {}
    
//     if(offlineData === null && store.state.app.offline){
//     Swal.fire('No hay información','Para continuar es necesario tener internet','warning')
//     }

//     if(Object.keys(offlineData).length == 0) {
//     if (node == 'areas'){
//         offlineData.areas = data  
//     } else if( node === 'departments') {
//         offlineData.deparments = data
//     }
//     localStorage.setItem(`service_data${serviceSelect.value.id}`, JSON.stringify(offlineData))  
//     }
    
// }

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

    const exportCapture = () => {
        const listaStores = Object.keys(localStorage)
        const puntos = []
        listaStores.find(store => {
            if(store.substring(0,14) == 'capturePoints_'){
                const dataCapture = JSON.parse(localStorage.getItem(`${store}`))
                dataCapture.forEach(item => {
                    delete item.producto, 
                    delete item.norma, 
                    delete item.categoria_norma, 
                    delete item.department_id, 
                    delete item.department, 
                    delete item.status, 
                    delete item.created_at, 
                    delete item.updated_at,
                    delete item.deleted_at,
                    delete item.service_name, 
                    delete item.selected
                    item.fo_aml_01_4_id = item.fo_aml_01_4_id != null ? item.fo_aml_01_4_id.fo_aml_01_4 : null
                    puntos.push(item)
                })
            }
        })
        
        if(puntos.length>0){
            const ws = utils.json_to_sheet(puntos)
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, "capturas_puntos_medicion");
            writeFileXLSX(wb, "capturas.xlsx");
        } else notify('No hay información para exportar', 'negative')
    }

    watch(serviceSelected, async (item) => {
        console.log(item)
        departments.value = []
        departmentSelected.value = ''
        typeProduct.value = 0
        luxometro.value = {
            identificador:item.identificador,
            id:item.device_id,
            lux_start:null,
            lux_end:null
        }        
        // console.log('selecciona servicio y la conexión es:', store.state.app.offline)
        // si no hay conexión a internet
        // if(store.state.app.offline){
        // console.log(store.state.app.offline)
        // // setDataOffline()
        // } else {
        if (serviceSelected.value !== null) {
            showPoints.value = true
            typeProduct.value = serviceSelected.value.product_id
            await getServiceList(serviceSelected.value.id)
            config_puntos()
            // setDataOffline(departments.value, 'departments')
        }
        // }
    })


    watch(departmentSelected, async () => {
        areaSelected.value = ''
        if (departmentSelected.value !== null && departmentSelected.value !== '') {
            // if (!store.state.app.offline){
                await getAreas({department_id:departmentSelected.value.id})
            // } else{
            //     localStorage.setItem(`service_data${serviceSelect.value.id}`, JSON.stringify({areas:departments.value}))
            //     areas.value = JSON.parse(localStorage.getItem(`service_data${serviceSelect.value.id}`))
            // }   
        }
    })

    watch(areaSelected, (value) => {
        if (areaSelected.value !== null && areaSelected.value !== '') {
            config_puntos()
            verificarLuxometroDia()
        }
    })

    const guardarLocal = () => {
        if(displayPoints.value != undefined){
            displayPoints.value.localDot()
        }
    }

    const sincronizar = () => {
        if(displayPoints.value != undefined && captureActive){
            displayPoints.value.async()
        }
    }

    onMounted( async () => {  
        if (window.navigator.onLine) {
            await getServiceList()
            verificarLuxometroDia()  
        } else {
            // store.commit('app/SET_OFFLINE_MOD', true)
        }
    })

    return {
        serviceSelected,
        captureActive,
        departmentSelected,
        areaSelected,
        servicesList,
        departments,
        areas,
        typeProduct,
        puntos_captura,
        checkLuxo,
        device,
        showPoints,
        bloquea,
        captureActive,
        displayPoints,
        saveLuxometro,
        cleanData,
        exportCapture,
        sincronizar,
        guardarLocal
    }
}
})    

</script>