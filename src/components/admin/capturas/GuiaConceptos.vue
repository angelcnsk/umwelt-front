<template>
    <q-card class="q-pa-sm">
            <q-card-section>
                <div class="row q-pa-md d-inline-block">
                    <q-radio v-model="visita" val="1" label="visita 1" />
                    <q-radio v-model="visita" val="2" label="visita 2" />
                    <q-btn class="q-ml-md" color="primary" icon="save" label="guardar" @click="autoSave('manual')" /> 
                </div>
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
                                <span class="text-justify"><span class="text-caption">{{ `${concepto.global})`  }}</span> {{concepto.texto  }}</span>
                            </div>
                            <div class="row q-pa-sm">
                                <q-checkbox v-if="visita == 1" v-model="concepto.value_visita1" val="si" label="Si" color="orange" />
                                <q-checkbox v-else v-model="concepto.value_visita2" val="si" label="Si" color="orange" />
                                <q-checkbox v-if="visita == 1" v-model="concepto.value_visita1" val="no" label="No" color="orange" />
                                <q-checkbox v-else v-model="concepto.value_visita2" val="no" label="No" color="orange" />
                                <q-checkbox v-if="visita == 1" v-model="concepto.value_visita1" val="cumple" label="Cumple" color="orange" />
                                <q-checkbox v-else v-model="concepto.value_visita2" val="cumple" label="Cumple" color="orange" />
                                <q-checkbox v-if="visita == 1" v-model="concepto.value_visita1" val="no_cumple" label="No cumple" color="orange" />
                                <q-checkbox v-else v-model="concepto.value_visita2" val="no_cumple" label="No cumple" color="orange" />
                                <q-checkbox v-if="visita == 1" v-model="concepto.value_visita1" val="na" label="N.A." color="orange" />
                                <q-checkbox v-else v-model="concepto.value_visita2" val="na" label="N.A." color="orange" />
                                <q-checkbox v-if="visita == 1" v-model="concepto.value_visita1" val="et" label="E.T." color="orange" />
                                <q-checkbox v-else v-model="concepto.value_visita2" val="et" label="E.T." color="orange" />

                                

                            </div>                                
                            <div v-for="(posicion,index) in posicionObservaciones" :key="index" class="row">
                                <div class="col-md-12">
                                    <!-- {{ `${posicion}, ${i}` }} -->
                                    <!-- <q-input
                                        v-if="posicion == concepto.global-1"
                                        v-model="concepto.observaciones"
                                        filled
                                        clearable
                                        type="textarea"
                                        color="red-12"
                                        label="Observaciones"                                        
                                    /> -->
                                    <q-editor
                                        v-model="concepto.observaciones"
                                        v-if="visita==1 && posicion == concepto.global-1"
                                        :dense="$q.screen.lt.md"
                                        :toolbar="toolbar"
                                        :fonts="fonts"
                                        filled
                                        clearable
                                        color="red-12"
                                    />
                                    <q-editor
                                        v-model="concepto.observaciones2"
                                        v-if="visita==2 && posicion == concepto.global-1"
                                        :dense="$q.screen.lt.md"
                                        :toolbar="toolbar"
                                        :fonts="fonts"
                                    >

                                    </q-editor>
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
                <div class="text-weight-bold">{{tipo}}</div>
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
        const $q = useQuasar();
        const storeCapturas = useCapturas();
        const { getServiceList, servicesList,
            currentService, saveCaptures, saveSectionFile
        } = storeCapturas

        const categorias = toRef(props,'categorias')
        const service = toRef(props,'service')
        const posicionObservaciones = service.value.posicion_observaciones
        const observaciones = ref([])

        const dialog = ref(false)
        const loading = ref(false)
        const visita = ref("1")
        const tipo = ref('')

        const toolbar = ref([
            [
                {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                },
                
            ],
            ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
            ['token', 'hr', 'custom_btn'],
            
            [
                {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: [
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'h5',
                    'h6',
                    'code'
                    ]
                },
                {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                    ]
                },
                {
                    label: $q.lang.editor.defaultFont,
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana'
                    ]
                },
                'removeFormat'
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

            ['undo', 'redo'],
            ['viewsource']
        ])
        const fonts = ref({
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana'
        })    
                                                    

        const autoSave = async (type) => {            
            dialog.value = true
            tipo.value = type == 'manual' ? 'Guardando...' : 'Auto guardado'
            const saveData = await saveCaptures({service_id: service.value.id, categorias:service.value.categorias, type:"conceptos"})
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
            // console.log(conceptos.value,'nada?')
            setInterval(() => {
                if(categorias.value.length>0)autoSave()
            }, 300000);
        })

        return {
            categorias,
            loading,
            dialog,
            posicionObservaciones,
            visita,
            tipo,
            toolbar,
            fonts,
            autoSave
        }
    }
})

</script>