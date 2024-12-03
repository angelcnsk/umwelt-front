<template>
    <div class="row q-pa-sm">
        <div class="col-xs-12 col-md-3">
            <q-select 
                class="q-mr-md" 
                style="width: 200px;" 
                :options="visitas"
                option-label="texto"
                v-model="visitSelected"
                label="Visita"
            />
        </div>
        <div class="col-xs-12 col-md-2 d-inline-block q-mt-lg q-ml-sm">
            <q-input v-model="fechas_visita.fecha_inicio" filled type="date" hint="Fecha inicial" />
            
        </div>
        <div class="col-xs-12 col-md-2 d-inline-block q-mt-lg q-ml-sm">
            <q-input v-model="fechas_visita.fecha_fin" filled type="date" hint="Fecha final" />
        </div>
        <div class="col-xs-12 col-md-1 d-inline-block q-mt-lg q-ml-sm">
            <q-input v-model="fechas_visita.hora_inicio" filled type="text" hint="Hora inicio" />
        </div>
        <div class="col-xs-12 col-md-1 d-inline-block q-mt-lg q-ml-sm">
            <q-input v-model="fechas_visita.hora_final" filled type="text" hint="Hora final" />
        </div>
    </div>
    <div class="row q-pa-md items-center justify-start ">
        <!-- <q-btn class="q-mb-md" color="primary" icon="save" label="guardar" @click="autoSave('manual')">
            <q-tooltip>
                Guarda información en tu equipo
            </q-tooltip>
        </q-btn> -->
        <q-btn class="q-mb-md" color="primary" icon="save" label="guardar" @click="asyncSaveData('manual')">
            <q-tooltip>
                Guarda información en el servidor
            </q-tooltip>
        </q-btn>
        <q-btn class="q-mb-md q-ml-md" color="primary" icon="delete_outline" label="Borrar" @click="cleanData('manual')">
            <q-tooltip>
                Borrar datos sin conexión
            </q-tooltip>
        </q-btn>
        <q-btn class="q-mb-md q-ml-md" color="primary" icon="print" label="guía inspección" @click="validatePrint('guia inspeccion')">
            <q-tooltip>
                Imprimir guía de inspección
            </q-tooltip>
        </q-btn>
        <q-btn class="q-mb-md q-ml-md" color="primary" icon="print" label="Acta" @click="validatePrint('acta')">
            <q-tooltip>
                Imprimir Acta
            </q-tooltip>
        </q-btn>
        
    </div>
</template>

<script setup> 
import { ref, toRef, onMounted, watch } from "vue";
import { useQuasar, date } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js';
const storeCapturas = useCapturas();
const $q = useQuasar();
const { visitSelected, fechas_visita, currentService, cleanDataService } = storeCapturas;

const props = defineProps({
    visitas:Object,
    changeVisit: Function
});

// const fechas_visita = toRef(props,'fechas')
const visitas = toRef(props,'visitas')
watch(visitSelected, () => {
    props.changeVisit();
})

const asyncSaveData = () => {
    if(!serviceSelected()) return false

    $q.dialog({
        title: '¿Deseas continuar?',
        message: 'Se guardarán los datos ingresados en la base de datos',
        ok: {
        push: true,
        label:'Continuar'
        },
        cancel: {
        push: true,
        color: 'dark',
        label:'Cancelar'
        },
        persistent: true,

    }).onOk(async data => {
        
        const info = JSON.parse(localStorage.getItem(`service_${service.value.id}_categorias_visita_${visitSelected.value.valor}`))

        //candado cerrar visita
        // if(info.finalizado == 1){
        //     $q.notify({
        //         position:'top',
        //         type:'negative',
        //         message:'La visita está finalizada, no es posible continuar'
        //     })
        //     return false
        // }

        if(info!=null){
            //se hace otro setLocal para evitar perder cualquier dato si no hay conexión, se mantiene en local los cambios
            // setLocal('update')
            
            if(!offline.value){
                //hay conexión
                if(info.acta == undefined){
                    $q.notify({
                        position:'top',
                        type:'negative',
                        message:'Falta el texto del acta'
                    })
                    return false  
                }

                const blob = new Blob([info.acta], { type: 'text/plain' });
                const actaStore = await storeActa({ 
                    file:blob,
                    service_id: info.service_id,
                    visita: visitSelected.value.valor
                })

                const saveData = await saveCaptures({
                    service_id: info.service_id, 
                    categorias:info.categorias, 
                    type:"conceptos",
                    fechas:info.fechas,
                    visita: visitSelected.value.valor,
                    acta:actaStore.path,
                    storageId:actaStore.storageId,
                    finalizado:1
                })

                if(saveData.status == 200){
                    $q.notify({
                        position:'top',
                        type:'positive',
                        message:'Se guardó la información en el servidor'
                    })
                    localStorage.setItem(`service_${service.value.id}_asyncData_visita_${visitSelected.value.valor}`,true)
                }
            } else {
                $q.notify({
                    position:'top',
                    type:'warning',
                    message:'Se guardó la información en tu equipo'
                })
            }
        }
    })
}

const cleanData = async () => {

    if(currentService.value.id == undefined){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para continuar selecciona un servicio'
        })
        return false
    }
    
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

        const keys = [];
        visitas.value.map((visit) => {
            const claves = ['acta','result', 'categories'];
            claves.map((key) => keys.push(`${currentService.value.id}/visita_${visit.valor}/${key}`))
        })
        
        keys.map(async(key) => {
            await cleanDataService(key)
        });
        
        // localStorage.removeItem(`service_${service.value.id}_categorias_visita_${visitSelected.value.valor}`)
        // localStorage.removeItem(`service_${service.value.id}_data`)
        $q.notify({
            position:'top',
            type:'positive',
            message:'Se borró la información guardada sin conexión'
        })
    })
        
}

const validatePrint = (doc) => {
    if(service.value.id == undefined){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para continuar selecciona un servicio'
        })
        return false
    }

    if(visitSelected.value == null){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para continuar selecciona una visita'
        })
        return false
    }

    const asyncData = localStorage.getItem(`service_${service.value.id}_asyncData_visita_${visitSelected.value.valor}`)

    if(asyncData == null || asyncData == undefined){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para continuar guarda la información capturada'
        })
        return false
    }

    if(doc == 'acta'){
        showActa.value = !showActa.value
        return false
    }
    imprimir(doc)
}

const imprimir = (doc) => {
    
    let url = import.meta.env.VITE_api_host
    switch (doc) {
        case 'guia inspeccion':
            url = `${url}reportes/getreport?service_id=${service.value.id}&reporte=3&visita_id=${visitSelected.value.id}`
            break;

        case 'acta':
            if(dataActa.value.persona1 == undefined || dataActa.value.persona1 == ''
                || dataActa.value.cargo1 == undefined || dataActa.value.cargo2 == ''
                || dataActa.value.persona2 == undefined || dataActa.value.persona2 == ''
                || dataActa.value.cargo2 == undefined || dataActa.value.cargo2 == ''
                || dataActa.value.testigo1 == undefined || dataActa.value.testigo1 == ''
                || dataActa.value.testigo_cargo1 == undefined || dataActa.value.testigo_cargo1 == ''
                || dataActa.value.testigo2 == undefined || dataActa.value.testigo2 == ''
                || dataActa.value.testigo_cargo2 == undefined || dataActa.value.testigo_cargo2 == ''
                
            ){
                $q.notify({
                    position:'top',
                    type:'negative',
                    message:'Todos los campos son obligatorios'
                })
                return false
            }
            const queryString = Object.keys(dataActa.value)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(dataActa.value[key]))
            .join('&');
            
            url = `${url}reportes/getreport/?service_id=${service.value.id}&reporte=2&${queryString}&visita_id=${visitSelected.value.id}`
            showActa.value = false
            dataActa.value = {}
    }

    window.open(url,'_blank')
}

onMounted(() => {
    console.log('initial', visitSelected.value)
    visitSelected.value = visitas.value[0];
    console.log('carga fechas', visitSelected.value)
})
</script>
