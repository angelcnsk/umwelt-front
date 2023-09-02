<template>
    <q-card>
        <q-card-section>
            <div class="row q-pa-sm">
                <div class="col-xs-12 col-md-2">
                    <q-select 
                        class="q-mr-md" 
                        style="width: 200px;" 
                        :options="visitas"
                        option-label="texto"
                        v-model="visitSelected"
                        label="Visita"
                    />
                </div>
                <div class="col-xs-12 col-md-2 offset-1">
                    <q-btn class="q-mr-md q-mt-md" icon="add" color="primary" outline @click="addVisit" />
                </div>
                <!-- <div class="col-xs-12 col-md-2">
                    <q-radio v-model="visita" val="1" label="visita 1" />
                </div>
                <div class="col-xs-12 col-md-2">
                    <q-radio v-model="visita" val="2" label="visita 2" />
                </div> -->
                <div class="col-xs-12 col-md-2">
                    <q-btn icon="event" outline class="cursor-pointer q-mt-md" size="md" color="primary" label="Fecha Visita">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="fechas_visita" range>
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-btn>
                </div>
                <div class="col-xs-12 col-md-4 d-inline-block q-mt-lg">
                    <span class="text-body2">Fecha inicial: {{ fechas_visita.from }}</span>
                    <span class="text-body2 q-ml-sm">Fecha final {{ fechas_visita.to }}</span>
                </div>
            </div>
            <div class="row q-pa-md items-center justify-start ">
                <q-btn class="q-mb-md" color="primary" icon="save" label="guardar" @click="autoSave('manual')" /> 
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
                <div style="height: 150px; overflow-y: scroll; border:1px solid">
                    <div class="q-pa-md" v-for="(concepto,i) in categoria.conceptos" :key="i">
                        <div class="row wrap q-pa-sm">
                            <span class="text-justify"><span class="text-caption">{{ `${concepto.global})`  }}</span> {{concepto.texto  }}</span>
                        </div>
                        <div class="row q-pa-sm">
                            <q-checkbox v-model="concepto.value" val="si" label="Si" color="orange" />
                            <!-- <q-checkbox v-else v-model="concepto.value_visita2" :disable="bloquearVisita" val="si" label="Si" color="orange" /> -->
                            <q-checkbox v-model="concepto.value" :disable="bloquearVisita" val="no" label="No" color="orange" />
                            <!-- <q-checkbox v-else v-model="concepto.value_visita2" :disable="bloquearVisita" val="no" label="No" color="orange" /> -->
                            <q-checkbox v-model="concepto.value" val="cumple" label="Cumple" color="orange" />
                            <!-- <q-checkbox v-else v-model="concepto.value_visita2" :disable="bloquearVisita" val="cumple" label="Cumple" color="orange" /> -->
                            <q-checkbox v-model="concepto.value" val="no_cumple" label="No cumple" color="orange" />
                            <!-- <q-checkbox v-else v-model="concepto.value_visita2" :disable="bloquearVisita" val="no_cumple" label="No cumple" color="orange" /> -->
                            <q-checkbox v-model="concepto.value" val="na" label="N.A." color="orange" />
                            <!-- <q-checkbox v-else v-model="concepto.value_visita2" :disable="bloquearVisita" val="na" label="N.A." color="orange" /> -->
                            <q-checkbox v-model="concepto.value" val="et" label="E.T." color="orange" />
                            <!-- <q-checkbox v-else v-model="concepto.value_visita2" :disable="bloquearVisita" val="et" label="E.T." color="orange" /> -->
                        </div>                                                            
                    </div>
                </div>
                <div class="col-md-12">
                                <q-editor
                                    class="q-editor-mb"
                                    v-model="categoria.observaciones"
                                    :dense="$q.screen.lt.md"
                                    :toolbar="toolbar"
                                    :fonts="fonts"
                                    filled
                                    clearable
                                    color="red-12"
                                />
                                <!-- <q-editor
                                    class="q-editor-mb"
                                    v-model="concepto.observaciones2"
                                    v-if="visita==2 && posicion == concepto.global-1"
                                    :dense="$q.screen.lt.md"
                                    :toolbar="toolbar"
                                    :fonts="fonts"
                                    :disable="bloquearVisita"
                                >

                                </q-editor> -->
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
        const observacionText = ref('')

        const dialog = ref(false)
        const loading = ref(false)
        const visitas = ref([{valor:1, texto:'Visita 1'}])
        const tipo = ref('')
        const timeStamp = Date.now()
        const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')
        const visitSelected = ref('')

        const fechas_visita = ref({
            from: formattedString,
            to: formattedString
        })

        watch(fechas_visita,(newVal) => {
            
            if(newVal != undefined && service.value.id != undefined){
                // fechas_visita.value = newVal
                // console.log('cambia valor', fechas_visita.value)    
                
                if(service.value.fechas == undefined){
                    service.value.fechas = []
                    // console.log('agregó array', service.value.fechas)
                } 
                // console.log(visita.value)    
                // if(visita.value == "1"){
                //     service.value.fechas[0] = newVal
                //     // console.log('set fecha1', service.value.fechas)
                // }
                // else {
                //     service.value.fechas[1] = newVal
                //     // console.log('set fecha2', service.value.fechas)
                // }

            } else {
                fechas_visita.value.from = formattedString
                fechas_visita.value.to = formattedString
            }
        })

        // watch(visita, (newVal, oldValue) => {
            
        //     if(service.value.id == undefined){
        //         fechas_visita.value.from = formattedString
        //         fechas_visita.value.to = formattedString
        //     }
        //     setFechas(newVal)
            
        // })
        
        const setNoCumple = () => {
            categorias.value.forEach(categoria => {
                categoria.conceptos.forEach(concepto => {
                    if(concepto.value.includes('no_cumple')) concepto.no_cumple = 1
                })
            });
        }

        watch(service, (newVal) => {
            setFechas()
        })

        const setFechas = (value) => {
            if(service.value.fechas.length == 0){
                fechas_visita.value.from = formattedString
                fechas_visita.value.to = formattedString
                visitSelected.value = visitas.value[0]
            }
            // const valor = value != undefined ? value : visita.value
            // fechas_visita.value = {}
            // if(service.value.fechas != undefined && valor == "1"){
            //     // console.log('trae fechas 1', service.value.fechas)
            //     fechas_visita.value.from = service.value.fechas[0].fecha_inicio != undefined ? service.value.fechas[0].fecha_inicio : service.value.fechas[0].from
            //     fechas_visita.value.to = service.value.fechas[0].fecha_fin != undefined ? service.value.fechas[0].fecha_fin : service.value.fechas[0].to
            // }

            // if(service.value.fechas != undefined && valor == "2"){
            //     // console.log('trae fechas 2', service.value.fechas)
            //     fechas_visita.value.from = service.value.fechas[1].fecha_inicio != undefined ? service.value.fechas[1].fecha_inicio : service.value.fechas[1].from
            //     fechas_visita.value.to = service.value.fechas[1].fecha_fin != undefined ? service.value.fechas[1].fecha_fin : service.value.fechas[1].to
            // } 
        }

        const toolbar = ref([
            [
                {
                    // label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                },
                
            ],
            // ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
            // ['token', 'hr', 'custom_btn'],
            
            // [
            //     // {
            //     //     label: $q.lang.editor.formatting,
            //     //     icon: $q.iconSet.editor.formatting,
            //     //     list: 'no-icons',
            //     //     options: [
            //     //     'p',
            //     //     'h1',
            //     //     'h2',
            //     //     'h3',
            //     //     'h4',
            //     //     'h5',
            //     //     'h6',
            //     //     'code'
            //     //     ]
            //     // },
            //     // {
            //     //     label: $q.lang.editor.fontSize,
            //     //     icon: $q.iconSet.editor.fontSize,
            //     //     fixedLabel: true,
            //     //     fixedIcon: true,
            //     //     list: 'no-icons',
            //     //     options: [
            //     //     'size-1',
            //     //     'size-2',
            //     //     'size-3',
            //     //     'size-4',
            //     //     'size-5',
            //     //     'size-6',
            //     //     'size-7'
            //     //     ]
            //     // },
            //     // {
            //     //     label: $q.lang.editor.defaultFont,
            //     //     icon: $q.iconSet.editor.font,
            //     //     fixedIcon: true,
            //     //     list: 'no-icons',
            //     //     options: [
            //     //     'default_font',
            //     //     'arial',
            //     //     'arial_black',
            //     //     'comic_sans',
            //     //     'courier_new',
            //     //     'impact',
            //     //     'lucida_grande',
            //     //     'times_new_roman',
            //     //     'verdana'
            //     //     ]
            //     // },
            //     // 'removeFormat'
            // ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

            ['undo', 'redo'],
            // ['viewsource']
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
            setNoCumple()
            console.log(service.value.categorias)
            // dialog.value = true
            // tipo.value = type == 'manual' ? 'Guardando...' : 'Auto guardado'
            
            // const saveData = await saveCaptures({
            //     service_id: service.value.id, categorias:service.value.categorias, type:"conceptos",
            //     fechas:service.value.fechas
            // })
            // if(saveData.status == 200){
            //     setTimeout(() => {
            //         dialog.value = false
            //     }, 2000);
            // }
        }

        const bloquearVisita = computed(() => {
            // console.log(fechas_visita.value)
            const splitDate = fechas_visita.value.to.split('-')
            const fecha_final = date.buildDate({year:splitDate[0], month:splitDate[1], date:splitDate[2]})
            return new Date() < fecha_final
        })
        const addVisit = () => {
            visitas.value.push({valor:visitas.value.length+1, texto:`Visita ${visitas.value.length+1}` })
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
        const setLocal = () => {
            const data = JSON.parse(localStorage.getItem('service'))

            if(data != null){
                service.value = data
            } else {
                localStorage.setItem('service', JSON.stringify(service.value))
            }
        }

        onMounted( async () => {
            setLocal()
            setFechas()
            setInterval(() => {
                if(categorias.value.length>0) autoSave()
            }, 300000);
        })

        return {
            categorias,
            loading,
            dialog,
            posicionObservaciones,
            visitas,
            tipo,
            toolbar,
            fonts,
            fechas_visita,
            bloquearVisita,
            observacionText,
            visitSelected,
            addVisit,
            autoSave,
        }
    }
})

</script>

<style>
@media (max-width: 390px) {
    .q-editor-mb{
        max-width: 240px;
    }
}

@media (max-width: 900px) {
    .q-editor-mb{
        max-width: 650px;
    }
}

</style>