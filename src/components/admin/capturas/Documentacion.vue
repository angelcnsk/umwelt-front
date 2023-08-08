<template>
    <q-card class="q-pa-sm">
            <q-card-section>
                <q-list bordered class="rounded-borders" v-if="secciones.length>0">
                    <q-expansion-item
                        group="somegroup"
                        expand-separator
                        icon="ads_click"
                        header-class="text-primary"
                        :label="`${seccion.label}`" v-for="(seccion,i) in secciones" :key="i"
                        style="border: .2px solid gray"
                    >
                    <q-separator />
                        <div class="q-pa-md" v-for="(document,i) in seccion.documents" :key="i">
                            <div class="row wrap q-pa-sm">
                                <!-- <span>{{document.texto  }}</span> -->
                                <span class="text-justify"><span class="text-caption">{{ `${document.global})`  }}</span> {{document.texto  }}</span>
                            </div>
                            <div class="row q-pa-sm">
                                <q-radio v-model="document.filled_i" val="anexo" label="Se anexa" />
                                <q-radio v-model="document.filled_i" val="no_anexo" label="No anexa" />
                                <q-radio v-model="document.filled_i" val="no_cuenta" label="No se cuenta" />
                            </div>                                
                            <div class="row">
                                <div class="col-md-5">
                                    <q-file
                                        id="fileInput"
                                        for="fileInput`"
                                        class="q-mt-sm"
                                        ref="inputFile"
                                        v-model="document.inputFile"
                                        filled
                                        type="file"
                                        label="Selecciona un archivo"
                                    > 
                                        <template v-slot:after>
                                            <q-btn round dense flat icon="send" @click="upLoadFile(document,i)" />
                                        </template>
                                    </q-file>
                                    <q-spinner-dots v-if="loading" class="q-ml-lg" color="primary" size="lg" />
                                </div>
                            </div>
                            
                        </div>
                    </q-expansion-item>
                </q-list>
                <div class="q-pa-md" v-else>
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
    props:['secciones','service'],
    // emits: ['savePoints','async'],
    setup(props, ctx) {
        const storeCapturas = useCapturas();
        const { getServiceList, servicesList,
            currentService, saveCaptures, saveSectionFile
        } = storeCapturas

        const secciones = toRef(props,'secciones')
        const service = toRef(props,'service')
        const uploader = ref()
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

        const upLoadFile = async (docSection, index) => {
            
            let input = document.getElementById("fileInput")
            
            const file = docSection.inputFile
            
            const guardar = await saveSectionFile({
                files:file,
                service_id: currentService.value.id,
                document: docSection 
            })
            inputFile.value = ref()
            if(guardar.status == 200){
                notify('Archivo cargado con éxito','positive')
                docSection.
                loading.value = false
                // await getSectionFile({service_id:props.servicio_id, type:'get'})
            } else {
                notify('Error al cargar archivo','negative')   
            }
        }

        onMounted( async () => {  
            console.log(service)
            setInterval(() => {
                if(secciones.value.length>0)autoSave()
            }, 500000);
        })

        return {
            secciones,
            uploader,
            loading,
            inputFile,
            dialog,
            upLoadFile        
        }
    }
})

</script>