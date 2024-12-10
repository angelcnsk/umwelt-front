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
import { storeActa } from "src/composables/firebase/storage";
const storeCapturas = useCapturas();
const $q = useQuasar();
const { visitSelected, fechas_visita, currentService, cleanDataService, textoActa, saveCaptures, saveDates, showActa } = storeCapturas;

const props = defineProps({
    visitas:Object,
    changeVisit: Function,
    categorias:Object
});


const visitas = toRef(props,'visitas');
const categorias = toRef(props,'categorias');
watch(visitSelected, () => {
    props.changeVisit();
});

watch(fechas_visita, async (valor) => {
    if(valor.fecha_inicio != fechas_visita.value.fecha_inicio ||
       valor.fecha_fin != fechas_visita.fecha_fin ||
       valor.hora_inicio != fechas_visita.hora_inicio ||
       valor.hora_final != fechas_visita.hora_final 
    ){
        await saveDate();    
    }
},{deep:true});

const asyncSaveData = () => {
    const now = new Date();
    
    if(!navigator.onLine){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para sincronizar asegúrate de tener conexión a internet'
        })
        return false
    }

    $q.dialog({
        title: '¿Deseas continuar?',
        message: 'Se guardará en la base de datos la información ingresada',
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

        if(textoActa.value == undefined || textoActa.value == ''){
            $q.notify({
                position:'top',
                type:'negative',
                message:'Falta el texto del acta'
            })
            return false  
        }
        
        
        const blob = new Blob([textoActa.value], { type: 'text/plain' });
        const actaStore = await storeActa({ 
            file:blob,
            service_id: currentService.value.id,
            visita: visitSelected.value.valor,
            date:`${now.getFullYear()}_${now.getUTCMonth()+1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`
        });

        const saveData = await saveCaptures({
            service_id: currentService.value.id, 
            categorias:categorias.value, 
            type:"conceptos",
            visita: visitSelected.value.valor,
            acta:actaStore.path,
            storageId:actaStore.storageId,
            finalizado:1,
            fechas:fechas_visita.value,
        })

        if(saveData.status == 200){
            $q.notify({
                position:'top',
                type:'positive',
                message:'Se guardó la información en el servidor'
            });
        }
    });
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
    if(currentService.value.id == undefined){
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

    if(doc == 'acta'){
        showActa.value = !showActa.value
        return false
    }
}

const imprimir = (doc) => {
    
    let url = import.meta.env.VITE_api_host
    switch (doc) {
        case 'guia inspeccion':
            url = `${url}reportes/getreport?service_id=${currentService.value.id}&reporte=3&visita_id=${visitSelected.value.id}`
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
            
            url = `${url}reportes/getreport/?service_id=${currentService.value.id}&reporte=2&${queryString}&visita_id=${visitSelected.value.id}`
            showActa.value = false
            dataActa.value = {}
    }

    window.open(url,'_blank')
}

const saveDate = async (params) => {
    const props = {service_id:fechas_visita.value.service_id, visita:fechas_visita.value.visita, data:fechas_visita.value}
    await saveDates(props)
}

onMounted(async() => {
    visitSelected.value = visitas.value[0];
});

</script>
