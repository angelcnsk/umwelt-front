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

<script>
import {defineComponent, ref, computed, watch, onMounted, toRef, defineEmits} from 'vue';
import { useQuasar, date } from "quasar";
import { useUsers } from 'src/composables/useUsers.js'
import { useCapturas } from 'src/composables/useCapturas.js'

export default defineComponent({
    name: "documentacion",
    props:['service'],
    // emits: ['savePoints','async'],
    setup(props, ctx) {
        const storeCapturas = useCapturas();
        const { getServiceList, servicesList,
            currentService, saveCaptures, saveSectionFile
        } = storeCapturas

        const service = toRef(props,'service')
        
        const loading = ref(false)
        const inputFile = ref()
        const dialog = ref(false)

        const autoSave = async () => {            
            dialog.value = true
            
            const saveData = await saveCaptures({service_id: service.value.id, secciones:service.value.secciones, type:'documentos'})
            if(saveData.status == 200){
                setTimeout(() => {
                    dialog.value = false
                }, 2000);
            }
        }

        const upLoadFile = async (file) => {
            // console.log(inputFile.value)
            const guardar = await saveSectionFile({
                files:file[0],
                service_id: currentService.value.id,
            })
            inputFile.value = ref()
            console.log(guardar)
            notify('Archivo cargado con éxito','positive')
            if(guardar.status == 200){
                console.log('se cargó bien')
                notify('Archivo cargado con éxito','positive')
                // await getSectionFile({service_id:props.servicio_id, type:'get'})
            } else {
                notify('Error al cargar archivo','negative')   
            }
        }

        

        onMounted( async () => {  
            console.log(service)
            // setInterval(() => {
            //     if(secciones.value.length>0)autoSave()
            // }, 300000);
        })

        return {
            loading,
            inputFile,
            dialog,
            upLoadFile  
        }
    }
})

</script>