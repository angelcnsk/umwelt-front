<template>
    <q-card class="q-pa-sm">
        <q-card-section>
            <q-uploader
                :factory="upLoadFile"
                label="Carga de archivos"
                multiple
                ref="inputFile"
                style="max-width: 500px"
            />
        </q-card-section>
    </q-card>
        <q-dialog v-model="dialog" position="bottom">
        <q-card style="width: 350px">
            <q-linear-progress indeterminate color="primary" />

            <q-card-section class="row items-center no-wrap">
            <div>
                <div class="text-weight-bold">Auto guardado</div>
            </div>

            <q-space />

            <q-btn flat round icon="check" color="green"/>
            
            </q-card-section>
        </q-card>
        </q-dialog>
</template>

<script setup>
import {ref, onMounted, toRef } from 'vue';
import { useQuasar, date } from "quasar";
import { loadFile } from 'src/composables/firebase/storage'

const props = defineProps({
    service:Object
})
const service = toRef(props,'service')
const $q = useQuasar();
const loading = ref(false)
const inputFile = ref()
const dialog = ref(false)

const notify = (msg, type) => {
    $q.notify({
        position:'top',
        type,
        message:msg
    })
}

const upLoadFile = async (file) => {
    // let input = document.getElementById("fileInput")
    loading.value = true    
    const guardar = await loadFile({
        files:file[0],
        service_id: service.value.id,
    })
    
    
    if(guardar.status != undefined){
        inputFile.value.removeQueuedFiles()
        notify('Archivo cargado con éxito','positive')
        loading.value = false
        // await getSectionFile({service_id:props.servicio_id, type:'get'})
    } else {
        notify('Error al cargar archivo','negative')   
    }
}

</script>