<template>
    <q-card class="q-pa-sm">
            <q-card-section>
                <q-list bordered class="rounded-borders" v-if="categorias.length>0">
                    <q-expansion-item
                        group="somegroup"
                        expand-separator
                        icon="ads_click"
                        header-class="text-primary"
                        :label="`${categoria.texto}`" v-for="(categoria,i) in categorias" :key="i"
                        style="border: .2px solid gray"
                    >
                    <q-separator />
                        <div class="q-pa-md" v-for="(concepto,i) in categoria.conceptos" :key="i">
                            <div class="row wrap q-pa-sm">
                                
                                <span class="text-justify"><span class="text-caption">{{ `${i+1})`  }}</span> {{concepto.texto  }}</span>
                            </div>
                            <div class="row q-pa-sm">
                                <q-checkbox v-model="concepto.valor" val="si" label="Si" color="orange" />
                                <q-checkbox v-model="concepto.valor" val="no" label="No" color="orange" />
                                <q-checkbox v-model="concepto.valor" val="cumple" label="Cumple" color="orange" />
                                <q-checkbox v-model="concepto.valor" val="no_cumple" label="No cumple" color="orange" />
                                <q-checkbox v-model="concepto.valor" val="na" label="N.A." color="orange" />
                                <q-checkbox v-model="concepto.valor" val="et" label="E.T." color="orange" />

                                

                            </div>                                
                            <div v-for="(posicion,index) in posicionObservaciones" :key="index" class="row">
                                <div class="col-md-12">
                                    
                                    <q-input
                                        v-if="posicion == i" 
                                        v-model="concepto.observaciones"
                                        filled
                                        clearable
                                        type="textarea"
                                        color="red-12"
                                        label="Observaciones"                                        
                                    />
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
    name: "guiaconceptos",
    props:['categorias','service'],
    // emits: ['savePoints','async'],
    setup(props, ctx) {
        const storeCapturas = useCapturas();
        const { getServiceList, servicesList,
            currentService, saveCaptures, saveSectionFile
        } = storeCapturas

        const categorias = toRef(props,'categorias')
        const service = toRef(props,'service')
        const posicionObservaciones = service.value.posicion_observaciones
        
        
        
        const dialog = ref(false)
        const loading = ref(false)

        const autoSave = async () => {            
            dialog.value = true
            
            const saveData = await saveCaptures({service_id: service.value.id, secciones:service.value.secciones})
            if(saveData.status == 200){
                setTimeout(() => {
                    dialog.value = false
                }, 2000);
            }
        }

        // const upLoadFile = async (docSection, index) => {
            
        //     let input = document.getElementById("fileInput")
            
        //     const file = docSection.inputFile
            
        //     const guardar = await saveSectionFile({
        //         files:file,
        //         service_id: currentService.value.id,
        //         document: docSection 
        //     })
        //     inputFile.value = ref()
        //     if(guardar.status == 200){
        //         notify('Archivo cargado con éxito','positive')
        //         docSection.
        //         loading.value = false
        //         // await getSectionFile({service_id:props.servicio_id, type:'get'})
        //     } else {
        //         notify('Error al cargar archivo','negative')   
        //     }
        // }

        onMounted( async () => {  
            console.log(service)
            setInterval(() => {
                if(categorias.value.length>0)autoSave()
            }, 50000);
        })

        return {
            categorias,
            loading,
            dialog,
            posicionObservaciones,
        }
    }
})

</script>