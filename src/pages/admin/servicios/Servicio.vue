<template>
<q-page class="q-pa-sm">
    <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" :to="{name:'index-admin'}" />
            <q-breadcrumbs-el label="Servicios" icon="folder" :to="{name:'servicios'}" />
            <q-breadcrumbs-el label="Servicio" icon="file_open" />        
        </q-breadcrumbs>
    </div>
    <div class="q-pa-md">
        <q-card rounded class="q-mb-md">
            <q-card-section>
                <div class="col">
                    <span class="text-h6 q-ml-sm block"> Cliente: {{servicio.cliente}}</span>
                    <span class="text-subtitle1 q-ml-sm block"> Planta: {{servicio.planta}}</span>
                    <span class="text-subtitle1 q-ml-sm block"> Producto: {{servicio.producto}}</span>
                </div>
                <div class="row q-mt-md q-mb-md q-ma-sm">
                    <div class="col-md-4 col-xs-12">
                        <span class="block label q-mb-sm">Orden de trabajo:</span>
                        <div class="row">
                        <q-badge transparent 
                            :color="servicio.ot === 'Sin OT asignada' ? 'negative' : 'primary' " 
                            outline
                            class="uppercase"
                            :label="servicio.ot"
                        />
                            
                        
                        <div class="" v-if="servicio.ot === 'Sin OT asignada'">
                            <q-btn flat 
                                round
                                size="sm"
                                color="green"
                                class="q-ml-sm"
                                outline
                                icon="check_circle"
                                v-if="generar_ot"
                                @click="promtOt"
                            >
                                <q-tooltip>Generar OT</q-tooltip>
                            </q-btn>
                        </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-12">
                        <span class="label block q-mb-sm">Estatus:</span>
                        <q-badge 
                            outline 
                            :color="servicio.status === 'abierto' ? 'primary' : 'grey-9'"  
                            class="uppercase"
                            :label="servicio.status"
                        />
                    </div>
                    <div class="col col-lg-4 col-md-4 col-sm-12">
                        <span class="label block q-mb-sm">Reconocimiento:</span>
                        <q-badge 
                            outline
                            :label="servicio.recognition ? 'aceptado' : 'no aceptado'"
                            :color="servicio.recognition ? 'primary' : 'negative'"
                            class="uppercase" 
                        />
                    </div>
                </div>
                <div class="row q-mt-md q-mb-lg q-ma-sm">
                    <div class="col-md-4 col-sm-12">
                        <span class="label">Solicitante</span><br>
                        <q-avatar class="q-mr-sm q-mt-sm" size="30px">
                            <img :src="servicio.requester_avatar" alt="">
                        </q-avatar>
                        <span class="user-name-label">{{servicio.requester}}</span>
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <span class="label q-mt-sm">Responsable</span><br>
                        <q-avatar class="q-mr-sm q-mt-sm" size="30px">
                            <img :src="servicio.owner_avatar" alt="">
                        </q-avatar>
                        <span class="user-name-label">{{servicio.owner}}</span>
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <span class="label q-mt-sm">Fecha creación</span><br>
                        <q-badge outline color="grey-7" :label="servicio.create_date" class="q-mt-md" />
                        
                        
                    </div>        
                </div>

                <div class="row q-mt-md q-mb-md ">
                    <div class="col-md-4 col-xs-12 q-mt-sm">
                        <span class="label q-ml-sm">Inicio reconocimiento:</span>
                        <q-input 
                            class="q-mt-sm q-ml-sm"
                            filled 
                            v-model="fecha1" 
                            mask="date" 
                            :readonly="!cambiar_fechas_servicio"
                            style="max-width: 180px;"
                        >
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="fecha1" :readonly="!cambiar_fechas_servicio">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                    </q-date>
                                </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                    <div class="col-md-4 col-xs-12 q-mt-sm">
                        <span class="label q-mr-sm">Inicio ejecución:</span>
                        <q-input class="q-mt-sm" filled v-model="fecha2" mask="date" :rules="['date']" style="max-width: 180px;">
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="fecha2" :readonly="!cambiar_fechas_servicio">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                    </q-date>
                                </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                    <div class="col-md-4 col-xs-12 q-mt-sm">
                        <span class="label q-mr-sm">Fin ejecución:</span>
                        <q-input class="q-mt-sm" filled v-model="fecha3" mask="date" :rules="['date']" style="max-width: 180px;">
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="fecha3" :readonly="!cambiar_fechas_servicio">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                    </q-date>
                                </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                </div>
                <div class="row q-mr-md justify-end q-mt-sm">
                    <q-btn v-if="cambiar_fechas_servicio" color="primary" @click="update" label="Guardar" />
                </div>
            </q-card-section>
    </q-card>
</div>
<logistica :servicio="servicio" :id="$route.params.id" />
<gestion :servicio_id="$route.params.id" :signatory="servicio.signatory" />

</q-page>
</template>


<script>
import {defineComponent,defineAsyncComponent, computed, onMounted, watch, ref, onBeforeMount} from 'vue'
import { useQuasar, date } from "quasar";
import { useRoute } from "vue-router";

import { useUsers } from 'src/composables/useUsers.js'
import { useServicios } from 'src/composables/useServicios.js'

import logistica from 'src/components/admin/servicios/Logistica.vue'
import gestion from 'src/components/admin/servicios/Gestion.vue'
import { route } from 'quasar/wrappers';

// import XLSX from 'xlsx'
// import modalStaff from '../custom-components/AsignarStaff.vue'
// import modalAreas from '../custom-components/ModalAreas.vue'
// import modalDptos from '../custom-components/ModalDptos.vue'

export default defineComponent({
    name: 'servicioPage',
    components:{
        logistica,
        gestion
    },
    setup () {
        const storeUsers = useUsers();
        const storeServicios = useServicios();
        const $q = useQuasar();
        const $router = useRoute()

        const { AppActiveUser } = storeUsers
        const { getService, serviceItem, generarOT, getStaff, getTableA1, saveCaratulaPayload } = storeServicios
        
        const generar_ot = ref(false)
        
        const cambiar_fechas_servicio = ref(false)
        const agregar_signatarios = ref(false)
        const logistica = ref(false)
        const llenar_rec = ref(false)

        const notify = (msg, type) => {
            $q.notify({
                position:'top',
                type,
                message:msg
            })
        }

        const fecha1 = ref(null)
        const fecha2 = ref(null)
        const fecha3 = ref(null)

        const fecha_reconocimiento = ref('')
        const fecha_inicio = ref('')
        const fecha_fin = ref('')

        const servicio = computed(() => {
            return serviceItem.value
        })

        const setTime = async () => {
            fecha_reconocimiento.value = servicio.value.recognition_date.split('-')
            fecha_inicio.value = servicio.value.start_date.split('-')
            fecha_fin.value = servicio.value.end_date.split('-')

            fecha1.value = date.formatDate(new Date(fecha_reconocimiento.value[0], fecha_reconocimiento.value[1]-1, fecha_reconocimiento.value[2]), 'YYYY/MM/DD')
            fecha2.value = date.formatDate(new Date(fecha_inicio.value[0], fecha_inicio.value[1]-1, fecha_inicio.value[2]), 'YYYY/MM/DD')
            fecha3.value = date.formatDate(new Date(fecha_fin.value[0], fecha_fin.value[1]-1, fecha_fin.value[2]), 'YYYY/MM/DD')
        }
        
        const permisos = ref([])

        watch(AppActiveUser, (valor) => {
            permisos.value = valor.permissions
        })

        watch(permisos, (newVal) => {
            if(newVal != undefined){
                const permisos = newVal
                cambiar_fechas_servicio.value = permisos.find((permiso) => permiso === 'cambiar_fechas_servicio')
                agregar_signatarios.value = permisos.find((permiso) => permiso === 'agregar_signatarios')
                logistica.value = permisos.find((permiso) => permiso === 'agregar_areas_reconocimiento')
                llenar_rec.value = permisos.find((permiso) => permiso === 'datos_reconocimiento')
                generar_ot.value = permisos.find((permiso) => permiso === 'generar_ot')
            }
            
        })
        
        // console.log(permisos)

        

        const update = async () => {
            
            $q.dialog({
                title: '¿Estás seguro?',
                message: 'Se guardarán las fechas seleccionadas',
                ok: {
                    push: true,
                    label:'Aceptar'
                },
                cancel: {
                    push: true,
                    color: 'dark',
                    label:'Cancelar'
                },
                persistent: true
            }).onOk(async data => {
                const dates = {
                    recognition_date: date.formatDate(fecha1.value, 'YYYY-MM-DD'),
                    start_date: date.formatDate(fecha2.value, 'YYYY-MM-DD'),
                    end_date: date.formatDate(fecha3.value, 'YYYY-MM-DD')
                }
      
                const payload = await saveCaratulaPayload({data:dates, servicio_id: $router.params.id, dates:true})
                if(payload.status === 200) notify('Se actualizó la información correctamente', 'positive') 
                else notify('Hubo un problema al guardar la información','negative')                       
            })
                  
            
        }

        const promtOt = () => {
            $q.dialog({
                    title: '¿Estás seguro?',
                    message: 'Se asingará una OT al servicio',
                    ok: {
                    push: true,
                    label:'Aceptar'
                    },
                    cancel: {
                    push: true,
                    color: 'dark',
                    label:'Cancelar'
                    },
                    persistent: true
                 }).onOk(async data => {
                    acceptOt()
                                  
                }).onCancel(() => {
                    // console.log('>>>> Cancel')
                }).onDismiss(() => {
                    // console.log('I am triggered on both OK and Cancel')
                })   
        }

        const acceptOt = async () => {
            const response = await generarOT({solicitud_ot:true, servicio_id:servicio.value.id})
            if(response.status != 200){
                notify('Error al generar OT', 'negative')
                return false
            }
            await getService($router.params.id)
        }


        

        onMounted(async () => {
            permisos.value = AppActiveUser.value.permissions
            // await setPermissions()
            await getStaff()
            // await getSignatoryList()
            // // await this.setSignatory
            // await getTableA1()
            await getService($router.params.id)
            await setTime()
            
        
            
        })
        
        return {
            cambiar_fechas_servicio,
            agregar_signatarios,
            generar_ot,
            logistica,
            llenar_rec,
            servicio,
            fecha1,
            fecha2,
            fecha3,
            update,
            promtOt
        }

    }
    
})

</script>

<style lang="scss">
.uppercase{
  text-transform:uppercase;
}

.label{
  font-weight: 500;
}

.user-name-label{
  vertical-align: bottom;
}

.cardWidth{
  width: 450px;
}
.blockMargin{
  border:solid 1px orangered;
}
.btn-lg > svg{
  width: 25px;
  height: 25px;
}
.mark-staff > span.b-avatar-img{
  border: 3px solid #07dca1;
  // height: 2px;
  // width: 55%;
  // margin:0 25% ;
}
.lastCard{
  margin-bottom: 40px;
  padding-bottom: 40px;
}
</style>