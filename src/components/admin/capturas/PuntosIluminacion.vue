<template>
    <div class="row q-pa-sm">
        <div class="col-md-2">
            <q-input 
                class="q-mt-sm q-ml-sm"
                filled 
                v-model="fecha_captura" 
                mask="date" 
                style="max-width: 180px; width: 150px;"
            >
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="fecha_captura">
                            <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
        </div>
        
        <div class="col-md-3 mt-1">
      
        <q-btn  
            class="q-mt-md"
            color="primary"
            outline
            label="guardar"
            @click="setDate"
        />
         
    </div>
    
  </div>

  <div class="q-pa-md q-mt-lg">
    <div class="row">
        <q-checkbox v-model="selection" :val="'all'" class="q-mt-md" label="Seleccionar todos" />
    </div>
    <q-list bordered class="rounded-borders">

        <q-expansion-item
            expand-separator
            icon="ads_click"
            :header-class="point.sync == 1? 'text-primary' : 'text-red'"
            :label="`Dpto:${point.department} Área: ${point.area} Pto: ${i+1} `" v-for="(point,i) in puntos" :key="i"
            :caption="`Fecha Captura: ${point.capture_date != null ? point.capture_date : ''} Luxometro: Inicio: ${point.lux_start != null ? point.lux_start : ''} Final: ${point.lux_end != null ? point.lux_end : ''} `"
            style="border: .2px solid gray"
        >
        <q-separator />
            <div class="row q-pa-sm">
                <div class="col-md-1 d-inline-block ml-2">
                    <q-checkbox v-model="point.selected" :val="i" class="q-mt-md" />
                    <!-- <q-btn
                        color="red-4"
                        @click="confirmRemove(i)"
                        icon="delete"
                        round
                        size="xs"
                    >
                        <q-tooltip>Borrar punto de medición</q-tooltip>
                    </q-btn> -->
                    
                </div>
                <div class="col-md-3">
                    <q-input v-model="point.ubicacion" label="Ubicación" style="width: 95%;" />
                </div>

                <div class="col-md-3">
                    <q-select v-model="point.tipo_luz" :options="tipo_luz" label="Tipo de luz" style="width: 95%;" />
                </div>

                <div class="col-md-3">
                    <q-select v-model="point.plano_trabajo" :options="plano_trabajo" label="Plano de trabajo" style="width: 95%;" />
                </div>
            </div>
            
            <div class="row q-mt-sm q-pa-sm">
                <div class="col-md-2 ml-1">
                    <q-toggle v-model="point.condicion_critica" label="Condición crítica" />
                </div>
                <div class="col-md-2">
                    <q-toggle v-model="point.pared" label="Pared" />
                </div>
            </div>
            
            <div class="row q-mt-sm q-pa-sm">
                <div class="col-md-2">
                    <q-input ref="inicio" filled v-model="point.hora_1" mask="time" :rules="['time']" label="Hora 1" class="q-ml-sm" style="max-width: 180px;">
                        <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="point.hora_1">
                                <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-time>
                            </q-popup-proxy>
                        </q-icon>
                        </template>
                    </q-input>
                </div>
                <div class="col-md-2 q-ml-md">
                    <q-input label="plano_e1_1" v-model="point.plano_e1_1"  @change="ajustarRedondeo('plano_e1_1', i)" name="plano_e1_1" style="width: 95%;"/>
                </div>
                <div class="col-md-2">
                    <q-input label="plano_e2_1" v-model="point.plano_e2_1"  @change="ajustarRedondeo('plano_e2_1', i)" name="plano_e2_1" style="width: 95%;"/>
                </div>
                <div class="col-md-2" v-if="point.pared">
                    <q-input label="pared_e1_1"  v-model="point.pared_e1_1"  @change="ajustarRedondeo('pared_e1_1', i)" name="pared_e1_1" style="width: 95%;"/>
                </div>
                <div class="col-md-2" v-if="point.pared">
                    <q-input label="pared_e2_1" v-model="point.pared_e2_1"  @change="ajustarRedondeo('plano_e2_1', i)" name="pared_e2_1" style="width: 95%;"/>
                </div>
            </div>
            
            <div class="row q-mt-md q-pa-sm" v-if="point.tipo_luz != 'Artificial' && point.tipo_luz != null">
                <div class="col-md-2">
                    <q-input ref="inicio" filled v-model="point.hora_2" mask="time" :rules="['time']" label="Hora 2" class="q-ml-sm" style="max-width: 180px;">
                            <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="point.hora_2">
                                    <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-time>
                                </q-popup-proxy>
                            </q-icon>
                            </template>
                    </q-input>
                </div>
                <div class="col-md-2 q-ml-md">
                    <q-input label="plano_e1_2" v-model="point.plano_e1_2"  @change="ajustarRedondeo('plano_e1_2', i)" name="plano_e1_2" style="width: 95%;" />
                </div>
                <div class="col-md-2">
                    <q-input label="plano_e2_2" v-model="point.plano_e2_2"  @change="ajustarRedondeo('plano_e2_2', i)" name="plano_e2_2" style="width: 95%;" />
                </div>
                <div class="col-md-2" v-if="point.pared">
                    <q-input label="pared_e1_2" v-model="point.pared_e1_2"  @change="ajustarRedondeo('pared_e1_2', i)" name="pared_e1_2" style="width: 95%;" />
                </div>
                <div class="col-md-2" v-if="point.pared">
                    <q-input label="pared_e2_2" v-model="point.pared_e2_2" @change="ajustarRedondeo('pared_e2_2', i)" name="pared_e2_2" style="width: 95%;" />
                </div>
            </div>
            
            <div class="row q-mt-md q-pa-sm" v-if="point.tipo_luz != 'Artificial' && point.tipo_luz != null">
                <div class="col-md-2">
                    <q-input ref="inicio" filled v-model="point.hora_3" mask="time" :rules="['time']" label="Hora 3" class="q-ml-sm" style="max-width: 180px;">
                            <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="point.hora_3">
                                    <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-time>
                                </q-popup-proxy>
                            </q-icon>
                            </template>
                    </q-input>
                </div>
                <div class="col-md-2 q-ml-md">
                    <q-input label="plano_e1_3" v-model="point.plano_e1_3" @change="ajustarRedondeo('plano_e1_3', i)" name="plano_e1_3" style="width: 95%;" />
                </div>
                <div class="col-md-2">
                    <q-input label="plano_e2_3" v-model="point.plano_e2_3" @change="ajustarRedondeo('plano_e2_3', i)" name="plano_e2_3" style="width: 95%;" />
                </div>
                <div class="col-md-2" v-if="point.pared">
                    <q-input label="pared_e1_3" v-model="point.pared_e1_3" @change="ajustarRedondeo('pared_e1_3', i)" name="pared_e1_3" style="width: 95%;" />
                </div>
                <div class="col-md-2" v-if="point.pared">
                    <q-input label="pared_e2_3" v-model="point.pared_e2_3" @change="ajustarRedondeo('pared_e2_3', i)" name="pared_e2_3" style="width: 95%;" />
                </div>
            </div>
            <div class="row q-mt-md q-pa-md q-mb-lg">
                <div class="col-md-2">
                    <q-select label="Tarea visual" v-model="point.fo_aml_01_4_id" :options="fo_aml_01_4" option-label="fo_aml_01_3"  @input="setFoAml4(point)" style="width:95% ;" />
                </div>
                <div class="col-md-4">
                    <q-input label="Observaciones" v-model="point.observaciones" name="observaciones" style="width: 95%;"/>
                </div>
            </div>

        </q-expansion-item>

    </q-list>
  </div>
</template>

<script>
import {defineComponent, ref, computed, watch, onMounted, toRef, defineEmits} from 'vue';
import { useQuasar, date } from "quasar";
import { useUsers } from 'src/composables/useUsers.js'
import { useCapturas } from 'src/composables/useCapturas.js'

export default defineComponent({
    name: "captureIllumination",
    props:['show', 'puntos', 'area'],
    // emits: ['savePoints','async'],
    setup(props, ctx) {
        const $q = useQuasar();
        const storeUsers = useUsers();
        const storeCapturas = useCapturas();

        const { AppActiveUser } = storeUsers
        const { fo_aml_01_4, saveCaptures } = storeCapturas
        const puntos = ref([])

        //reactividad de props  
        const mostrarPuntos = toRef(props, 'puntos')
        const area = ref('')
        const areas_capturadas = ref([])

        const async = () => {
            const device = JSON.parse(localStorage.getItem(`luxometro`))
            
            const por_sincronizar = puntos.value.filter(punto => (punto.sync == 0 && punto.capture_date == device.date && punto.lux_end != null))
            

            if(por_sincronizar.length == 0 || por_sincronizar == null ){
                $q.dialog({
                    title: `No hay puntos para sincronizar`,
                    message:`Para continuar selecciona una fecha de captura para cada punto, deberá coincidir con la fecha de verificación del luxómetro`
                }).onOk(() => {
                    // console.log('OK')
                })
                return false
            }

            if(por_sincronizar.length>0){
                $q.dialog({
                title: '¿Deseas continuar?',
                message: `Se encontraron ${por_sincronizar.length} puntos para sincronizar`,
                ok: {
                    push: true,
                    label:'Aceptar',
                    color:'primary'
                },
                cancel: {
                    push: true,
                    color: 'dark',
                    label:'Cancelar'
                },
                persistent: true
                }).onOk(async data => {
                    console.log(por_sincronizar)
                    const saveData = await saveCaptures(por_sincronizar)
                    
                    if (saveData.status == 200) {
                        por_sincronizar.map(punto => {
                            puntos.value.map(item => item.id == punto.id ? item.sync = 1 : item.sync)
                        })
                        notify('Las capturas se guardaron exitosamente','positive')
                        localDot()
                    } else {
                        notify(saveData.response.data.msg, 'negative')
                    }
                    
                })    
            }

            
        }

    
        const notify = (msg, type) => {
            $q.notify({
                position:'top',
                type,
                message:msg
            })
        }

        const localDot = () => {
            if (puntos.value.length > 0) {

                const device = JSON.parse(localStorage.getItem(`luxometro`))
                
                if(device != null){
                    puntos.value.map(item => {
                        item.lux_start = device.start_value
                    })
                }

                const data = localStorage.getItem(`capturePoints_${puntos.value[0].user_id}`)
                if (data === null) {
                    localStorage.setItem(`capturePoints_${puntos.value[0].user_id}`, JSON.stringify(puntos.value))
                } else {
                    localStorage.removeItem(`capturePoints_${puntos.value[0].user_id}`)
                    localStorage.setItem(`capturePoints_${puntos.value[0].user_id}`, JSON.stringify(puntos.value))
                }
                    notify('La información capturada se ha guardado con éxito','positive')
            } 
        }

        watch(mostrarPuntos, (value) => {
            puntos.value = props.puntos
            puntos.value.map(punto => {
                punto.condicion_critica = punto.condicion_critica == 0 ? false : true
                punto.pared = punto.pared == 0 ? false : true
                punto.hora_1 = punto.hora_1 == null ? '00:00' : punto.hora_1
                punto.hora_2 = punto.hora_2 == null ? '00:00' : punto.hora_2
                punto.hora_3 = punto.hora_3 == null ? '00:00' : punto.hora_3
                punto.selected = false
            })
            area.value = props.area
        })

        const fecha_captura = ref('')
        const selection = ref([])
        const tipo_luz =ref(['Artificial', 'Natural', 'Artificial y Natural'])
        const plano_trabajo =ref(['Horizontal', 'Vertical', 'Oblicuo'])
        
        const setTime = async () => {
            fecha_captura.value = date.formatDate(new Date(), 'YYYY/MM/DD')
        }

        watch(selection, (val) => {
            // seleccionar todos los puntos
            if(val[0]=='all'){
                puntos.value.map(item => item.selected = true)
            } else{
                puntos.value.map(item => item.selected = false)
            }
        })

        const setDate = () => {
            const date = fecha_captura.value.split('/')
            
            puntos.value.map((punto) => {        
                if(punto.selected){
                    punto.capture_date = `${date[0]}-${date[1]}-${date[2]}`
                }
                punto.selected = false 
            })
            
            selection.value = []
            localDot()
        }

        const ajustarRedondeo = (tag, i) => {
        // const tag = Event.target.name
            switch (tag) {
                case 'plano_e1_1':
                puntos.value[i].plano_e1_1 = redondeo(puntos.value[i].plano_e1_1)
                break;
                case 'plano_e1_2':
                puntos.value[i].plano_e1_2 = redondeo(puntos.value[i].plano_e1_2)
                break;
                case 'plano_e1_3':
                puntos.value[i].plano_e1_3 = redondeo(puntos.value[i].plano_e1_3)
                break;
                case 'plano_e2_1':
                puntos.value[i].plano_e2_1 = redondeo(puntos.value[i].plano_e2_1)
                break;
                case 'plano_e2_2':
                puntos.value[i].plano_e2_2 = redondeo(puntos.value[i].plano_e2_2)
                break;
                case 'plano_e2_3':
                puntos.value[i].plano_e2_3 = redondeo(puntos.value[i].plano_e2_3)
                break;
                case 'pared_e1_1':
                puntos.value[i].pared_e1_1 = redondeo(puntos.value[i].pared_e1_1)
                break;
                case 'pared_e1_2':
                puntos.value[i].pared_e1_2 = redondeo(puntos.value[i].pared_e1_2)
                break;
                case 'pared_e1_3':
                puntos.value[i].pared_e1_3 = redondeo(puntos.value[i].pared_e1_3)
                break;
                case 'pared_e2_1':
                puntos.value[i].pared_e2_1 = redondeo(puntos.value[i].pared_e2_1)
                break;
                case 'pared_e2_2':
                puntos.value[i].pared_e2_2 = redondeo(puntos.value[i].pared_e2_2)
                break;
                case 'pared_e2_3':
                puntos.value[i].pared_e2_3 = redondeo(puntos.value[i].pared_e2_3)
                break;
            }
        }
        const redondeo = (valor) => {
            if(valor == '' || Number(valor) %1 ==0) return valor
            
            const value = valor
            if (Number(value) >= 0 && Number(value) < 100) {
                const result = value.split('.');
                result[1] = result[1].substring(0,2)
                return `${result[0]}.${result[1]}`
            } else if(Number(value) >= 100 && Number(value) <= 1000) {
                const result = value.split('.');
                result[1] = result[1].substring(0,1)
                return `${result[0]}.${result[1]}`

            } else if(Number(value) >= 1000){
                const result = value.split('.');
                return `${result[0]}`
            }
        }

        onMounted(() => {
            setTime()
        })
        
        return {
            fecha_captura,
            selection,
            fo_aml_01_4,
            tipo_luz,
            plano_trabajo,
            puntos,
            setDate,
            ajustarRedondeo,
            localDot,
            async
        }
    }
})

</script>