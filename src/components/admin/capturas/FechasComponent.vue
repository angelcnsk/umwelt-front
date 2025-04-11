<template>
    <div class="row q-pa-sm">
        <div class="col-xs-12 col-md-2">
            <q-select 
                class="q-mr-md" 
                style="max-width: 180px;" 
                :options="visitas"
                option-label="texto"
                v-model="visitSelected"
                label="Visita"
            />
        </div>
        <div class="col-xs-12 col-md-2" v-if="currentService.product_id == 2">
            <q-select 
                class="q-mr-md" 
                style="max-width: 180px;" 
                :options="recipientes"
                option-label="texto"
                option-value="value"
                v-model="recipienteSelected"
                label="Recipiente"
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
        <div class="col-xs-12">
            <q-btn-dropdown color="primary" outline label="Acciones">
                <q-list>
                    <q-item clickable v-close-popup @click="addVisitInspector" >
                        <q-item-section>
                            <q-item-label>Agregar visita</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="asyncSaveData('manual')" :disable="disableSave">
                        <q-item-section>
                            <q-item-label>Guardar</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="cleanData('manual')">
                        <q-item-section>
                            <q-item-label>Borrar</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="validatePrint('guia inspeccion')">
                        <q-item-section>
                            <q-item-label>Guía de inspección</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="validatePrint('acta')">
                        <q-item-section>
                            <q-item-label>Acta</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
        </div>
    </div>
    <modalGuia20 :show="showGuia020" @closeModal="closeModalGuia020" :service="currentService" />
</template>

<script setup> 
import { ref, toRef, onMounted, watch, defineAsyncComponent, inject } from "vue";
import { useQuasar } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js';
import { storeActa } from "src/composables/firebase/storage";
import { useVisits } from 'src/composables/useVisits.js';
// import ModalGuiaNom020 from "./ModalGuiaNom020.vue";
const storeCapturas = useCapturas();
const $q = useQuasar();
const { visitSelected, fechas_visita, currentService, cleanDataService, textoActa, saveCaptures, saveDates, setContainer,showActa, visitas, recipienteSelected, recipientes, tab } = storeCapturas;

const modalGuia20 = defineAsyncComponent(() => import('src/components/admin/capturas/ModalGuiaNom020.vue'))

const props = defineProps({
    changeVisit: Function,
    categorias:Object
});

const offline = inject('statusOnLine');
const disableSave = ref(false)
const categorias = toRef(props,'categorias');
const showGuia020 = ref(false);
const dataActa = ref({});

const { addVisitInspector } = useVisits(offline, currentService.value.id, visitSelected);

watch(visitSelected, () => {
    
    fechas_visita.value = []
    if(currentService.value.product_id == 2){
        setContainer();
    } else {
        props.changeVisit();
    }
});

watch(recipienteSelected,() => {
    props.changeVisit();
})

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

    }).onOk(async () => {


        if(fechas_visita.value.hora_inicio == undefined || fechas_visita.value.hora_inicio == null || fechas_visita.value.hora_inicio == '' || fechas_visita.value.hora_final == undefined || fechas_visita.value.hora_final == null || fechas_visita.value.hora_final == ''){
            $q.notify({
                position:'top',
                type:'negative',
                message:'Para continuar ingresa hora inicio y final de la visita'
            })
            return false  
        }
        
        disableSave.value = true;
        $q.loading.show();
                
        let saveData = null;
        if(currentService.value.product_id == 1){
            if(textoActa.value == undefined || textoActa.value == ''){
                $q.notify({
                    position:'top',
                    type:'negative',
                    message:'Falta el texto del actass'
                });
                $q.loading.hide();
                disableSave.value = false;
                return false  
            }
            const blob = new Blob([textoActa.value], { type: 'text/plain' });
            const actaStore = await storeActa({ 
                file:blob,
                service_id: currentService.value.id,
                visita: visitSelected.value.valor,
                date:`${now.getFullYear()}_${now.getUTCMonth()+1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`
            });
            
            saveData = await saveCaptures({
                service_id: currentService.value.id, 
                categorias:categorias.value, 
                type:"conceptos",
                visita: visitSelected.value.valor,
                acta:actaStore.path,
                storageId:actaStore.storageId,
                finalizado:1,
                fechas:fechas_visita.value,
            });
        } else {
            if(recipienteSelected.value == undefined || recipienteSelected.value == null){
                    $q.notify({
                    position:'top',
                    type:'negative',
                    message:'Para continuar selecciona un recipiente'
                })
                return false  
            }

            saveData = await saveCaptures({
                service_id: currentService.value.id, 
                categorias:categorias.value, 
                type:"conceptos",
                tab:tab.value,
                container_id: recipienteSelected.value.value, 
                visita: visitSelected.value.valor,
                fechas:fechas_visita.value,
            });
        }
        
        if(saveData.status == 200){
            $q.notify({
                position:'top',
                type:'positive',
                message:'Se guardó la información en el servidor'
            });
        } else {
            $q.notify({
                position:'top',
                type:'negative',
                message:'Error al guardar la información en el servidor'
            });
        }
        disableSave.value = false;
        $q.loading.hide()
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
        options:{
            type: 'checkbox',
            model: [],
            items: [
            { label: 'Eliminar toda la información del servicio', value: 'all', color: 'primary' }
            ],
        },
        persistent: true
    }).onOk(async (data) => {
        if(data.includes('all')){
            const key = `${currentService.value.id}/`;
            console.log('key', key)
            await cleanDataService({all:true, prefix:key})
            return
        } else {
            const keys = [];
            
            if(currentService.value.product_id == 1){
                visitas.value.map((visit) => {
                    const claves = ['acta','result', 'fechas','observations'];        
                    claves.map((key) => keys.push(`${currentService.value.id}/visita_${visit.valor}/${key}`))
                })
            
            } else {
                if(recipienteSelected.value == null){
                    $q.notify({
                        position:'top',
                        type:'negative',
                        message:'Para continuar elige un recipiente'
                    });
                    return
                }

                keys.push(`${currentService.value.id}/visita_${visitSelected.value.valor}/fechas`)
                recipientes.value.map((container) => {
                    keys.push(`${currentService.value.id}/visita_${visitSelected.value.valor}/contenedor_${container.value}/guia22/result`);
                    keys.push(`${currentService.value.id}/visita_${visitSelected.value.valor}/contenedor_${container.value}/guia25/result`)
                });
            }
            
            keys.map(async(key) => {
                await cleanDataService(key)
            });
        }
        
        $q.notify({
            position:'top',
            type:'positive',
            message:'Se borró la información guardada sin conexión'
        });
    }); 
}

const validatePrint = (doc) => {
    if(currentService.value.product_id == 1){
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
    } else {
        showGuia020.value = !showGuia020.value;
        return false;
    }
    

    if(currentService.value.product_id == 2 && recipienteSelected.value == null){
        $q.notify({
            position:'top',
            type:'negative',
            message:'Para continuar selecciona un recipiente'
        })
        return false
    } else if(currentService.value.product_id == 2 && recipienteSelected.value != null) {
        console.log('recipienteSelected', recipienteSelected.value)
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
            url = `${url}reportes/getreport?service_id=${currentService.value.id}&reporte=3&visita_id=${visitSelected.value.id}`
            break;

        case 'acta':{
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
            
            url = `${url}reportes/getreport?service_id=${currentService.value.id}&reporte=2&${queryString}&visita_id=${visitSelected.value.id}`
            showActa.value = false
            dataActa.value = {}
        }
            
    }

    window.open(url,'_blank')
}

const closeModalGuia020= () => {
    showGuia020.value = false
}

const saveDate = async () => {
    const props = {service_id:fechas_visita.value.service_id, visita:fechas_visita.value.visita, data:fechas_visita.value}
    await saveDates(props)
}

watch(currentService.value.fechas, async () => {
    console.log('currentService', currentService.value);
},{deep:true});

onMounted(async() => {
    visitSelected.value = visitas.value[0];
    // await setFechas();
});

</script>
