<template>
<q-dialog v-model="ver" persistent full-width>
    <q-card class="q-dialog-plugin q-pa-md" style="height: 90vh;">
        <q-card-section>
            <div class="row q-pa-sm">
                <span class="text-h6">Agregar Área</span>
            </div>
            <q-separator spaced />
            <div class="row ">
                <div class="col-xs-12 col-sm-3">
                    <q-input 
                        label="Nombre de área" 
                        v-model="areaData.area" 
                        class="q-ml-sm" 
                        style="max-width: 280px;"
                    />
                </div>
                <div class="col-xs-12 col-sm-2 q-mr-lg">
                    <q-select 
                        v-model="horario.tipo" 
                        :options="turnos" 
                        label="Horario de trabajo" 
                        style="max-width: 240px;"
                    />
                </div>
                <div class="col-xs-12 col-sm-2 q-ml-md " >
                    <q-input ref="inicio" filled v-model="horario.inicio" mask="time" :rules="['time']" label="Hora inicio" class="q-ml-sm" style="max-width: 180px;">
                        <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="horario.inicio">
                                <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-time>
                            </q-popup-proxy>
                        </q-icon>
                        </template>
                    </q-input>
                </div>
                <div class="col-xs-12 col-sm-2 q-ml-sm">
                    <q-input ref="fin" filled v-model="horario.final" mask="time" :rules="['time']" label="Hora final" class="q-ml-sm" style="max-width: 180px;">
                        <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="horario.final">
                                <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-time>
                            </q-popup-proxy>
                        </q-icon>
                        </template>
                    </q-input>
                </div>
                <div class="row  items-center">
                    <div class="col-xs-12 col-sm-4">
                        <q-btn 
                            color="primary"
                            outline
                            square
                            size="md"
                            icon="more_time"
                            @click="addHorario"
                        >
                            <q-tooltip anchor="center left" self="center left" > Guardar horario </q-tooltip>
                        </q-btn>
                    </div>
                </div>
          </div>
          <div v-if="horarios.show" class="row q-mt-lg">
            <div class="col-md-5 col-xs-12">
                <p class="text-subtitle2 ">Turno donde se localizan los niveles críticos de iluminación:</p>  
                <q-radio 
                        v-if="areaData.horarios.length>0"
                        v-for="horario in areaData.horarios"
                        v-model="areaData.horario_estudio" 
                        :val="horario.tipo" 
                        :label="horario.tipo"
                        class=""
                        v-on:dblclick="deleteHorario(horario.tipo)"
                    >
                        <q-tooltip>
                            {{ `${horario.inicio} - ${horario.final}` }}
                        </q-tooltip>
                    </q-radio>
            </div>
            <div class="col-md-5 col-xs-12">
                <p class="text-subtitle2 ">Se elige hacer por:</p>
                <q-option-group
                    v-model="areaData.estudio_por"
                    :options="estudio_por_options"
                    color="primary"
                    inline
                />
                
            </div>
        </div>
        <div class="row q-pa-sm q-mt-md" v-if="areaData.estudio_por !== 'puesto_trabajo' && areaData.estudio_por != '' ">
            
                <q-select class="d-inline q-pa-sm" filled label="Zonas" v-model="areaData.zonas" :options="zonas" style="min-width:180px;" />
                <q-input type="number"  class="d-inline q-pa-sm" filled label="X" v-model="areaData.x"/>
                <q-input type="number"  class="d-inline q-pa-sm" filled label="Y" v-model="areaData.y"/>
                <q-input type="number"  class="d-inline q-pa-sm" filled label="H" v-model="areaData.h"/>
                <q-input type="number"  class="d-inline q-pa-sm" filled label="IC" v-model="areaData.ic"/>
            
                <q-input class="q-ml-lg q-pa-sm" v-model="areaData.recurrencia" label="Días que se labora" style="min-width:200px" />
        </div>

        <div class="row q-pa-md q-mt-lg">
            <div class="col-md-3">
                <q-toggle v-model="areaData.question1" color="primary" label="¿Se consideró los reportes de los trabajadores para el presente reconocimiento?"/>
            </div>
            <div class="col-md-3">
                <q-toggle v-model="areaData.question2" color="primary" label="¿Influye luz natural?"/>
            </div>
        </div>
        </q-card-section>
        <q-card-section>
            <div class="row bg-green-11 rounded-borders	justify-center q-pa-md">
                <span class="text-h4 text-teal">Luminarias</span>
            </div>
            <q-space />
            <div class="row q-pa-md q-mt-lg">
                <div class="col-sm-2 col-xs-12">
                    <q-input type="number" min="0" label="Total luminarias" v-model="areaData.total_luminarias" />
                </div>
                <div class="col-sm-3 col-xs-12">
                    <q-toggle v-model="areaData.question3" class="q-ml-lg" color="primary" label="¿Las luminarias son nuevas?"/>
                </div>
                <div class="col-sm-2 col-xs-12">
                    <q-select v-model="luminaria_select.tipo" :options="luminarias_tipo" label="Tipo luminaria" style="max-width:200px"/>
                </div>
                <div class="col-sm-1" v-if="luminaria_select.tipo === 'Otro'">
                    <q-input  label="Tipo luminaria" v-model="luminaria_select.tipo_otro"/>
                </div>
            </div>
            <div class="row q-pa-sm q-mt-sm">
                <div class="col-sm-3 col-xs-12">
                    <q-input type="number" min="0" label="Cantidad" class="q-pa-sm" v-model="luminaria_select.cantidad" />
                </div>
                <div class="col-sm-3 col-xs-12">
                    <q-input type="number" min="0" label="Lámparas" class="q-pa-sm" v-model="luminaria_select.lamparas" />
                </div>
                <div class="col-sm-3 col-xs-12">
                    <q-input type="number" min="0" label="Potencia" class="q-pa-sm" v-model="luminaria_select.potencia" />
                </div>
                <div class="row q-ml-md q-mt-md">
                    <q-btn icon="lightbulb" color="primary" outline @click="addLuminaria" >
                        <q-tooltip>
                            Guardar luminaria
                        </q-tooltip>
                    </q-btn>
                </div>
            </div>
            <div id="detalleLuminarias" class="q-mt-md q-pa-md">
                <q-badge outline color="orange" v-for="(item,index) in areaData.luminarias" :key="index">
                <span v-on:dblclick="deleteLuminaria(index)" class="text-body2">
                    Tipo: {{item.tipo}}  Cantidad: {{item.cantidad}} Lámparas: {{item.lamparas}} Potencia: {{item.potencia}}
                </span>
          
                </q-badge>
            </div>
        </q-card-section>

        <q-card-section class="q-mb-lg">
            <div class="row bg-green-11 rounded-borders	justify-center q-pa-md">
                <span class="text-h4 text-teal ">Descripción del área iluminada</span>
            </div>
            <div class="row q-pa-sm q-mt-md">
                <div class="col-xs-12 col-md-2">
                    <q-input v-model="areaIluminada.puesto_trabajo" label="Puesto de trabajo" style="max-width:200px" />
                </div>
                <div class="col-md-3 q-mt-sm">
                    <span class="text-caption">Relación color-material:</span>
                    <q-option-group
                        v-model="areaIluminada.colorMaterial"
                        :options="options_color_material"
                        label="textos"
                        color="primary"
                        inline
                    />
                </div>
                <div class="col-md-3 col-xs-12">        
                    <q-select v-model="color" :options="colores" label="Color" style="max-width:250px"/>
                    <q-input v-if="color.valor == 17" label="Color" v-model="color.otro_valor" class="q-mt-sm q-ml-sm" style="max-width:250px"/>
                </div>
                <div class="col-md-3 col-xs-12">
                    <q-select v-model="material" :options="materiales" label="Material" style="max-width:250px"/>
                    <q-input v-if="material.valor === 'P'" label="Material" v-model="material.otro_valor" class="q-mt-sm" style="max-width:250px" />
                </div>
                <div class="col-md-1">
                    <q-btn icon="tune" color="primary" class="q-mt-md" outline @click="addOptions('color-material')" >
                        <q-tooltip>
                            Agregar color-material
                        </q-tooltip>
                    </q-btn>
                </div>
            </div>

            <div id="detalleColorMaterial" class="row container">
                <q-badge color="orange" v-for="(item,index) in areaIluminada.color_material" :key="index">
                    <span v-on:dblclick="deleteColorMaterial(index, 'plano')" class="text-body2">
                        Tipo: {{item.tipo}} {{item.label}}
                    </span>  
                </q-badge>
            </div>

            <div class="row q-pa-sm q-mt-md">
                <div class="col-md-3">
                <label>Plano de trabajo:</label>
                    <q-option-group
                        v-model="areaIluminada.superficie_plano"
                        :options="superficies"
                        color="primary"
                        inline
                        v-on:dblclick="areaIluminada.superficie_plano = ''"
                    />
                </div>
                <div class="col-md-3">
                    <label>Pared:</label>
                    <q-option-group
                        v-model="areaIluminada.superficie_pared"
                        :options="superficies"
                        color="primary"
                        inline
                        v-on:dblclick="areaIluminada.superficie_pared = ''"
                    />
                </div>
                <div class="col-md-2">
                    <q-btn label="guardar" class="q-mt-md" color="primary" outline @click="addOptions('guardar')" >
                        <q-tooltip>
                            Guardar puesto de trabajo
                        </q-tooltip>
                    </q-btn>
                </div>
            </div>
        </q-card-section>
        <q-card-section>
            <div class="row bg-green-11 rounded-borders	justify-center q-pa-md">
                <span class="text-h4 text-teal ">Descripción de las tareas visuales</span>
            </div>
            <div v-for="(puesto, index) in areaData.areas_iluminadas" :key="index">
        
            <div class="q-mb-sm q-mt-md">
                <div class="row">
                    <div class="col-md-4 align-self-center">
                        <div class="row inline q-pa-md">
                            <q-badge outline color="grey-9" :id="`label_${index}`" @click="editNamePosition(index, 'editar') " 
                                class="capitalize q-mr-md" :label="puesto.puesto_trabajo">
                                <q-tooltip>Click para editar nombre</q-tooltip>
                            </q-badge>
                    
                            <q-btn
                                class="q-mr-md"
                                icon="delete"
                                color="red-4"
                                @click="deleteAreaIluminada(index)"
                            >
                                <q-tooltip>Eliminar puesto de trabajo</q-tooltip>
                            </q-btn>
                            <q-btn
                                class="btn-icon ml-1"
                                icon="visibility"
                                color="orange-4"
                                @click="showColors(puesto)"
                            >
                                <q-tooltip>Mostrar descripción color-material</q-tooltip>
                            </q-btn>
                        </div>
                    </div>  
                </div>
                
                <div class="row q-pa-sm">
                    <div class="col-md-2 col-xs-12">
                        <q-select label="Tarea visual" v-model="puesto.tarea_visual" :options="tableA1" option-label="fo_aml_01_3" :key="tableA1['id']" class="q-pa-sm" />
                    </div>
                    <div class="col-md-2 col-xs-12">
                        <q-select v-model="puesto.condicion" :options="condiciones" class="q-pa-sm">
                            <template v-slot:prepend>    
                                <q-icon name="help" color="orange" >
                                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                                        Percepción de las condiciones de iluminación por parte del trabajador al patrón
                                    </q-tooltip>
                                </q-icon>
                            </template>
                        </q-select>
                    </div>
                    <div class="col-md-4 col-xs-12">                        
                        <q-select label="Descripción puesto de trabajo" v-model="puesto.descripcion" :options="descripciones" class="q-pa-sm" />
                    </div>
                    
                </div>
                <div class="row q-pa-sm">
                    
                    <div class="col-md-2 col-xs-12">
                        <q-input type="number" label="No. Trabajadores"  v-model="puesto.trabajadores" min="0" class="q-pa-sm"/>
                    </div>
                    <div class="col-md-2 col-xs-12">
                        <q-input type="number" label="Total tareas visuales"  v-model="puesto.tareas" :disabled="areaData.estudio_por == 'area'" min="0" class="q-pa-sm"/>
                    </div>
                </div>
            </div>
            </div>
        </q-card-section>
        <q-card-section class="q-mt-md">
            <div class="row bg-green-11 rounded-borders	justify-center q-pa-md">
                <span class="text-h4 text-teal ">Observaciones y responsables</span>
            </div>
            <div class="row q-pa-sm q-mt-md">
                <div class="col-md-3 col-xs-12">
                    <q-input class="" label="Observaciones" v-model="areaData.observaciones" style="max-width:250px"/>
                </div>
                <div class="col-md-3 col-xs-12">
                    <q-select class="" v-model="areaData.elabora" :options="responsables_list" label="Elaboró" style="max-width:250px" />
                </div>
                <div class="col-md-3 col-xs-12">
                    <q-select class="" v-model="areaData.revisa" :options="responsables_list" label="Revisó" style="max-width:250px" />
                </div>
            </div>
        </q-card-section>
        <q-card-section>
            <div class="row justify-end q-pa-sm q-mt-md">
                <q-btn label="cancelar" color="dark" @click="resetModal" class="q-mr-md" />
                <q-btn label="guardar" color="primary" @click="saveArea" />
            </div>
        </q-card-section>
    </q-card>
</q-dialog>

<q-dialog v-model="mostrarColores">
    <q-card style="width: 350px;">
        <div class="row">
            <div class="col-md-12">            
                    <q-card-section>
                        <p v-for="item in puesto_mostrar.color_material"> 
                            <span v-if="(item.color_otro == 'undefined' || item.color_otro == null) && (item.material_otro == 'undefined' || item.material_otro == null) "> {{item.tipo}} | {{item.label}} </span>
                            <span v-else>{{item.tipo}} | {{item.color_otro}}, {{item.material_otro}}</span> 
                        </p>
                    </q-card-section>
            </div>
        </div>
    </q-card>
    
</q-dialog>

</template>
  
  <script>
  import {defineComponent, ref, computed, watch, onMounted, toRef, defineEmits} from 'vue';
  import { useQuasar } from "quasar";
  import { useServicios } from 'src/composables/useServicios.js'
  import { useUsers } from 'src/composables/useUsers.js'

  export default defineComponent({
    name: "Areas",
    props:['show', 'servicio_id', 'departamento_id','idArea','infoEdit'],
    emits: ['closeModal', 'submit'],
    setup(props, ctx) {
        const $q = useQuasar();
        const storeUsers = useUsers();
        const storeServicios = useServicios();

        const { AppActiveUser } = storeUsers
        const { saveAreaPayload, tableA1, getDepartments } = storeServicios

        //reactividad de props  
        const mostrar = toRef(props, 'show')
        const ver = ref(mostrar == true)
        const inicio = ref()
        const fin = ref()
        const zonas = ref([])
        const mostrarColores = ref(false)

        const notify = (msg, type) => {
            $q.notify({
                position:'top',
                type,
                message:msg
            })
        }        

        const capitalize = computed((value) => {
         if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        })

        const areaData = ref({
            closeWindow:false,
            area:'',
            recurrencia:'',
            total_luminarias:0,
            horarios:[],
            luminarias:[],
            horario_estudio:'',
            areas_iluminadas:[],
            estudio_por:'',
            zonas:'',
            x:'',
            y:'',
            h:'',
            ic:'',
            revisa:'',
            elabora:'',
            question1:false,
            question2:false,
            question3:false,
            service_id: 0,
            department_id: 0,
            puntos_medicion:0,
            observaciones:'Ninguna'
        })
        const turnos = ref(['Primero', 'Segundo', 'Tercero', 'Mixto'])
        const horario = ref({tipo:'', inicio:'00:00', final:'00:00'})
        
        const horarios = ref({show:false, primero:false, segundo:false, tercero:false, mixto:false})
        const horarios_estudio = ref([])

        const luminarias_tipo = ref(['Fluorecente', 'LED', 'Descarga', 'Antichispa', 'Aditivo metálico', 'Otro'])
        const descripciones = ref(['No se requiere','Si se requiere', 'Ya utiliza luminarias localizadas'])
        const luminaria_select = ref({tipo:'', cantidad:0, lamparas:0, potencia:0})
        const sumLumi = ref(0)

        const addHorario =  () => {
            if (areaData.value.horarios.length >= 4) {
                notify('Todos los horarios están completos','negative')
                return false
            }
            if (horario.value.tipo === '') {
                notify('Por favor selecciona el tipo de hoario','negative')
                return false
            }
            if (inicio.hasError || fin.hasError) {
                notify('Por favor ingresa un horario válido','negative')
                return false
            }
            if((horarios.value.primero && horario.value.tipo == 'Primero') || (horarios.value.segundo && horario.value.tipo == 'Segundo') 
            || (horarios.value.tercero && horario.value.tipo == 'Tercero') || (horarios.value.mixto && horario.value.tipo == 'Mixto')){
                notify('El horario seleccionado ya existe','negative')
                return false
            }
            
            horarios.value.show = true
            if (horario.value.tipo === 'Primero') {
                horarios.value.primero = true
            } else if (horario.value.tipo === 'Segundo') {
                horarios.value.segundo = true
            } else if (horario.value.tipo === 'Tercero') {
                horarios.value.tercero = true
            } else {
                horarios.value.mixto = true
            }

            horarios_estudio.value.push({label:horario.value.tipo, value:horario.value.tipo})    

            areaData.value.horarios.push(horario.value)
            console.log(areaData.value.horarios)
            notify('Se agregó horario','positive')
            horario.value = {tipo:'', inicio:'00:00', final:'00:00'}
        }

        const deleteHorario = (option) => {
            areaData.value.horarios.map((item, index) => {
                if(item.tipo == option) {
                    areaData.value.horarios.splice(index,1)
                    if(option == 'Primero') horarios.value.primero = false
                    else if(option == 'Segundo') horarios.value.segundo = false
                    else if(option == 'Tercero') horarios.value.tercero = false
                    else horarios.value.mixto = false
                }
                console.log(horarios.value)
            })
        }

        const estudio_por_options = ref([
            {value:'puesto_trabajo', label:'Puesto de trabajo'},
            {value:'area', label:'Área de trabajo'},
            {value:'ambos', label:'Ambos'},
        ])

        const options_color_material = ref([
            {value:'plano', label:'Plano de trabajo'},
            {value:'pared', label:'Pared'},
            {value:'ambos', label:'Ambos'}
        ])

        const superficies = ref([
            {value:'lisa', label:'Lisa'},
            {value:'rugosa', label:'Rugosa'},
            {value:'ambas', label:'Ambas'}
        ])

        const colores = ref([
            {label:'Amarillo', valor:1},
            {label:'Azul Claro', valor:2},
            {label:'Azul oscuro', valor:3},
            {label:'Blanco', valor:4},
            {label:'Crema', valor:5},
            {label:'Gris claro', valor:6},
            {label:'Gris oscuro', valor:7},
            {label:'Marrón claro', valor:8},
            {label:'Marrón oscuro', valor:9},
            {label:'Negro', valor:10},
            {label:'Plateado', valor:11},
            {label:'Rosa Claro', valor:12},
            {label:'Rosa oscuro', valor:13},
            {label:'Verde claro', valor:14},
            {label:'Verde oscuro', valor:15},
            {label:'Vino', valor:16},
            {label:'Otro', valor:17}
        ])
        const materiales = ref([
            {label:'Acabado epóxico', valor:'A'},
            {label:'Azulejo', valor:'B'},
            {label:'Block', valor:'C'},
            {label:'Concreto', valor:'D'},
            {label:'Cartulina sulfatada', valor:'E'},
            {label:'Estuco', valor:'F'},
            {label:'Formaica', valor:'G'},
            {label:'Granito', valor:'H'},
            {label:'Plástico', valor:'I'},
            {label:'Ladrillo', valor:'J'},
            {label:'Loseta', valor:'K'},
            {label:'Madera', valor:'L'},
            {label:'Mármol', valor:'M'},
            {label:'Metal', valor:'N'},
            {label:'Tablaroca', valor:'Ñ'},
            {label:'Tela', valor:'O'},
            {label:'Otro', valor:'P'}
        ])
        const condiciones = ['Buena', 'Regular', 'Mala']

        const responsables_list = ref(
            ['Otto Finck Sánchez', 'Juan José Sandoval Galindo', 
            'Miguel Joaquin Jacinto', 'Edgar Sandoval Balderas', 
            'Itzel Sandoval Galindo', 'Alejandra Lazcano Ramos', 'Navil Becerril López', 
            'Nayeli de León Hernández'])


        const areaIluminada = ref({
            puesto_trabajo:'',
            color_material:[],
            colorMaterial:'',
            superficie_plano:'',
            superficie_pared:'',
            condicion_iluminacion:'',
            tarea_visual:'',
            trabajadores:0,
            tareas:0,
            descripcion:'No requiere',
            cambiarNombre:false
        })
        const color = ref('')
        const material = ref('')
        const total_areas = ref(0)
        const puesto_mostrar = ref([])

        
        watch(mostrar,(valor) => {
            ver.value = valor

            //preparar objeto de área a editar si existe
            if(props.infoEdit != null){
                areaData.value = props.infoEdit
                
                if(areaData.value.horarios && areaData.value.horarios.length>0){
                    horarios.value.show = true
                    areaData.value.horarios.map((item) => {
                        // primero:false, segundo:false, tercero:false, mixto:false
                        if(item.tipo == 'Primero') horarios.value.primero = true
                        if(item.tipo == 'Segundo') horarios.value.segundo = true
                        if(item.tipo == 'Tercero') horarios.value.tercero = true
                        if(item.tipo == 'Mixto') horarios.value.mixto = true
                    })
                } 
            }

        },{deep:true})

        watch(ver,(valor) => {
            if(!valor){
                ctx.emit('closeModal',false)
            }
        })

        watch(color, (valor) => {
            console.log(valor)
        })

        watch(() => areaData.value.x, (first, second) => {
            calculateZones()
        });
        watch(() => areaData.value.y, (first, second) => {
            calculateZones()
        });
        watch(() => areaData.value.h, (first, second) => {
            calculateZones()
        });

        const calculateZones = () => {
            if(areaData.value.x != '' && areaData.value.y != '' && areaData.value.h != ''){
                const val1 = areaData.value.x * areaData.value.y
                const val2 = Number(areaData.value.h) * (Number(areaData.value.x) + Number(areaData.value.y))
                
                areaData.value.ic =  val1 / val2
                areaData.value.ic = areaData.value.ic.toFixed(2)
                zonas.value = []

                if(areaData.value.ic < 1) zonas.value = [4,6]
                else if(areaData.value.ic >= 1 && areaData.value.ic < 2) zonas.value = [9,12]
                else if(areaData.value.ic >= 2 && areaData.value.ic <= 3) zonas.value = [16,20]
                else if(3 < areaData.value.ic) zonas.value = [25, 30]


            } else {
                areaData.value.ic  = 0
                zonas.value = []
            }
        }

        const addLuminaria =  () => {
            sumLumi.value  = 0
            
            if (areaData.value.total_luminarias === 0) {
                notify('Por favor indica un número de luminarias mayor a cero', 'negative')
                return false
            }

            if (luminaria_select.value.tipo === '') {
                notify('Por favor selecciona el tipo de luminaria','negative')
                return false
            }
            
            areaData.value.luminarias.forEach((item) => {
                sumLumi.value = sumLumi.value + item.cantidad
            })  
            
            sumLumi.value = sumLumi.value + luminaria_select.value.cantidad
            
            if (sumLumi.value > areaData.value.total_luminarias) {
                notify('Se alcanzó el total de luminarias indicadas', 'negative')
                return false
            }
            

            if (luminaria_select.value.cantidad > 0) {
                luminaria_select.value.cantidad = parseInt(luminaria_select.value.cantidad, 10)
                luminaria_select.value.lamparas = parseInt(luminaria_select.value.lamparas, 10)
                luminaria_select.value.potencia = parseInt(luminaria_select.value.potencia, 10)

                areaData.value.luminarias.push(luminaria_select.value)
                luminaria_select.value = {tipo:'', cantidad:0, lamparas:0, potencia:0}
            } else {
                notify('Por favor indica una cantidad mayor a cero', 'negative')
                return false
            }
        }
        const deleteLuminaria = (index) => {
            areaData.value.luminarias.forEach(element => {
                sumLumi.value = sumLumi.value - element.cantidad
            });

            areaData.value.luminarias = areaData.value.luminarias.filter((item, index2)=> index !== index2 )
        }

        const addOptions = (tipo) => {
            if (tipo === 'color-material' && color.value.valor != null && color.value.valor != '' && material.value.valor != null 
                && material.value.valor != '' || material.value.otro_valor != null && material.value.otro_valor != '' 
                || color.value.otro_valor != null && color.value.otro_valor != '' ) {
            
                if (areaIluminada.value.colorMaterial === '') {
                    notify('Por favor indica pared o plano','negative')
                    return false
                }
        
                areaIluminada.value.color_material.push(
                { tipo: areaIluminada.value.colorMaterial, 
                    label: `${color.value.label}, ${material.value.label}`, 
                    value: `${color.value.valor}, ${material.value.valor}`, 
                    color_otro:`${color.value.otro_valor}`,
                    material_otro:`${material.value.otro_valor}`
                })
        
                notify('Se agregó color y material','positive')
                color.value = material.value = areaIluminada.value.colorMaterial = ''
                return false
            }

            if (tipo === 'guardar') {
                if (areaIluminada.value.puesto_trabajo === '') {
                    notify('Por favor indica el puesto de trabajo', 'negative')
                    return false
                }

                areaData.value.areas_iluminadas.push(areaIluminada.value)
                areaIluminada.value = {
                    puesto_trabajo:'',
                    color_material:[],
                    colorMaterial:'',
                    superficie_plano:'',
                    superficie_pared:'',
                    condicion_iluminacion:'',
                    tarea_visual:'',
                    trabajadores:0,
                    tareas:0,
                    descripcion:'No requiere'
                }
                notify('Se agregó puesto de trabajo','positive')
                return false
            }

            notify('Sin valores especificados','negative')
        }
        
        const deleteColorMaterial = (index, tipo) => {
            areaIluminada.value.color_material = areaIluminada.value.color_material.filter((item, index2) => index !== index2)
        }

        const deleteAreaIluminada = (index) => {
            areaData.value.areas_iluminadas = areaData.value.areas_iluminadas.filter((item, index2) => index !== index2)
        }
        
        const saveArea = async () => {
            console.log(props.servicio_id)
            areaData.value.service_id = areaData.value.service_id > 0 ? areaData.value.service_id : props.servicio_id
            areaData.value.department_id =  areaData.value.department_id > 0 ? areaData.value.department_id : props.departamento_id
            
            if (validateForm()) {
                $q.dialog({
                    title: '¿Deseas guardar los cambios?',
                    message: 'Se guardarán los datos ingresados',
                    ok: {
                        push: true,
                        label:'Guardar'
                    },
                    cancel: {
                        push: true,
                        color: 'dark',
                        label:'Cancelar'
                    },
                    persistent: true
                }).onOk(async data => {
                    console.log('entra a enviar', areaData.value)
                    total_areas.value = total_areas.value + 1
                    const guardarData = await saveAreaPayload({area_id:props.idArea, data:areaData.value})
                    if (guardarData.status == 200) {
                        notify('Se guardó el área de forma correcta', 'positive')
                    
                        sumLumi.value = 0
                        await getDepartments({servicio_id: props.servicio_id})
                    
                        if(props.idArea != 0){
                            cleanObjArea('save')
                        }
                        ver.value = false

                    } else {
                        notify('Por favor contacta con el administrador','negative')
                    }

                })
            }
        }
        
        const validateForm = () => {
            if (areaData.value.area === '') {
                notify('Ingresa un nombre de área', 'negative')
                return false
            }
            if (areaData.value.horarios.length === 0) {
                notify('Ingresa al menos un horario', 'negative')
                return false
            }
            
            if (areaData.value.areas_iluminadas.length === 0) {
                notify('Ingresa al menos un puesto de trabajo', 'negative')
                return false
            }
            areaData.value.puntos_medicion = 0
            let tareas_visual = true
            
            areaData.value.areas_iluminadas.forEach((item) => {
                areaData.value.puntos_medicion = areaData.value.puntos_medicion + parseInt(item.tareas)
                if (areaData.value.estudio_por === 'puesto_trabajo' && (item.tarea_visual === '' || item.tareas === 0)) {
                    notify('Por favor indica las tareas visuales', 'negative')
                    tareas_visual = false
                }
                if (areaData.value.estudio_por === 'puesto_trabajo' && item.tareas > 0 && item.trabajadores == 0) {
                    notify('Por favor indica el número de trabajadores', 'negative')
                    tareas_visual = false
                }
            })

            if (!tareas_visual) {
                return false
            }

            if (areaData.value.revisa === '' || areaData.value.elabora === '') {
                notify('Por favor selecciona a los responsables', 'negative')
                return false
            }
            return true
        }

        const resetModal = () => {
            $q.dialog({
                title: '¿Seguro que quieres cerrar la ventana?',
                message: 'Se perderán todos los cambios y no será posible recuperarlos',
                ok: {
                    push: true,
                    label:'Si, salir y borrar',
                    color:"red-4"
                },
                cancel: {
                    push: true,
                    color: 'dark',
                    label:'Cancelar'
                },
                persistent: true
            }).onOk(async data => {
                cleanObjArea()
                ver.value = false
            })
        }

        const showColors = (item) => {
            puesto_mostrar.value = item
            mostrarColores.value = true
        }
        const cleanObjArea = (action) => {
            
            horarios.value = {show:false, primero:false, segundo:false, tercero:false, mixto:false}
            
            areaData.value = {
                area:'',
                recurrencia: areaData.value.recurrencia,
                total_luminarias:0,
                horarios: areaData.value.horarios,
                luminarias:[],
                horario_estudio: areaData.value.horario_estudio ,
                areas_iluminadas:[],
                estudio_por:'',
                zonas:'',
                x:'',
                y:'',
                h:'',
                ic:'',
                revisa: action == 'save' ? areaData.value.revisa : '',
                elabora: action == 'save' ? areaData.value.elabora : '',
                question1:false,
                question2:false,
                question3:false,
                service_id: 0,
                department_id: 0,
                puntos_medicion:0,
                observaciones: 'Ninguna'
            }
        }
        const editNamePosition = (index, action) => {
            const newVal = ref('')
            $q.dialog({
                title: 'Editar nombre puesto',
                message: 'Puesto de trabajo',
                prompt: {
                    model: newVal,
                    type: 'text' // optional
                },
                ok: {
                        push: true,
                        label:'Guardar',
                        color:"primary"
                    },
                cancel: {
                        push: true,
                        color: 'dark',
                        label:'Cancelar'
                    },
                persistent: true
            }).onOk(data => {
                if(newVal.value != ''){
                    areaData.value.areas_iluminadas[index].puesto_trabajo = newVal
                }
            })
        }
        
        
        // watch(luminarias_total, (valor) => {
        //     if (valor < 0) {
        //         luminarias_total.value = 0
        //     }
        // })
        
        // watch(editLuminarias, (valor) => {
        //     console.log(valor)
        //     areaData.value = Object.assign(infoEdit)

        //     if(infoEdit.horarios && infoEdit.horarios.length>0){
        //         horarios.value.show = true
        //         infoEdit.horarios.map((item) => {
        //             // primero:false, segundo:false, tercero:false, mixto:false
        //             if(item.tipo == 'Primero') horarios.value.primero = true
        //             if(item.tipo == 'Segundo') horarios.value.segundo = true
        //             if(item.tipo == 'Tercero') horarios.value.tercero = true
        //             if(item.tipo == 'Mixto') horarios.value.mixto = true
        //         })
        //     } 
        // })

        onMounted(() => {
            ver.value = mostrar.value == true
            ctx.emit('closeModal', false)
        })

        return {
            mostrar,
            areaData,
            horario,
            ver,
            turnos,
            inicio,
            horarios,
            horarios_estudio,
            estudio_por_options,
            zonas,
            luminarias_tipo,
            luminaria_select,
            options_color_material,
            superficies,
            colores,
            materiales,
            areaIluminada,
            condiciones,
            color,
            material,
            total_areas,
            puesto_mostrar,
            tableA1,
            capitalize,
            responsables_list,
            descripciones,
            mostrarColores,
            addHorario,
            deleteHorario,
            addLuminaria,
            deleteLuminaria,
            addOptions,
            editNamePosition,
            showColors,
            saveArea,
            deleteAreaIluminada,
            deleteColorMaterial,
            resetModal
            

        }
    }
  })
  </script>
  
  <style scoped>
  .capitalize{
    text-transform: uppercase;
  }
  </style>
  