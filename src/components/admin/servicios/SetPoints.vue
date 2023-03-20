<template>
    <div class="q-ma-md q-mb-lg">
        <q-dialog v-model="ver" persistent>
            <q-card style="min-width: 950px;">
                <q-card-section>
                    <div class="row justify-between">
                        <div><span class="text-h6">Asignar Staff</span></div>
                        <div><q-icon name="close" size="md" class="cursor-pointer" @click="ver = !ver" /></div>
                    </div>
                    <div class="row q-pa-sm ">
                        
                    </div>
                    <div class="row q-pa-sm">
                        <div class="col-xs-12 col-md-4">            
                            <q-select :options="staff" v-model="usuarioAsignar" label="Usuario captura" style="width:95%" />
                        </div>

                        <div class="col-xs-12 col-md-4">            
                            <q-select :options="staff" v-model="signatario" label="Usuario signatario" style="width:95%" />
                        </div>

                        <div class="col-xs-12 col-md-4">            
                            <q-select :options="dispositivos"
                            :readonly="deviceAssigned" v-model="dispositivo" label="Equipo" style="width:95%" />
                        </div>
                        
                    </div>
                    <div class="row q-pa-sm">
                        <div class="col-md-3">
                            <q-btn label="Asignar" color="primary" @click="asignarStaff" />
                        </div>
                    </div>
                    <div class="row q-pa-sm">
                        <div class="col-xs-12 col-md-3">
                            <q-input label="Nombre/ubicación punto" v-model="nuevoPunto" style="width:95%" />
                        </div>
                        <div class="col-xs-4">
                            <q-btn class="q-mt-md q-ml-sm" label="Crear punto" color="primary" @click="crearPunto" />
                        </div>
                    </div>
                    
                    <div class="row q-pa-sm q-mt-md">
                        <div class=" q-gutter-sm">
                            <p class="text-subtitle">Puntos de medición de área</p>
                            <q-toggle v-for="(punto,index) in sin_asignar" :key="index" color="primary" :label="`${index+1}-${punto.text}`" v-model="puntosSeleccion" :val="punto.value" />
                        </div>
                    </div>
                    <div class="row q-mt-md scroll bg-grey-4" style="height:350px" >
                        <q-card 
                            v-for="(punto, index) in asignadosArea"
                            class="q-ma-sm"
                            style="min-width:190px" 
                        >
                            <q-card-section class="row justify-between">
                                <q-btn icon="delete" size="xs" color="red-4" @click="quitarPunto(punto,index)" />
                                <q-badge label="Signatario" color="green" class="cursor-pointer" outline v-if="punto.signatario != undefined">
                                    <q-tooltip>
                                        {{ punto.signatario }}
                                    </q-tooltip>
                                </q-badge>
                            </q-card-section>
                            <q-card-section class="text-center">
                                <p class="text-subtitle1 block">{{`${index+1}-${punto.text}`}}</p>
                                <q-avatar class="text-center" size="sm">
                                    <img :src="punto.avatar" >
                                </q-avatar>
                                <p class="text-subtitle2 q-mt-sm">{{ punto.nombre }}</p>
                                <q-badge label="Equipo" color="green" class="cursor-pointer" outline>
                                    <q-tooltip>
                                        {{ punto.dispositivo.identificador }}
                                    </q-tooltip>
                                </q-badge>
                                <q-badge label="Certificado" color="red" class="q-ml-md cursor-pointer" outline v-if="punto.dispositivo.expira <=1">
                                    <q-tooltip>
                                        <p>Emisión:{{ punto.dispositivo.fecha_emision }}</p>
                                        <p>Expira:{{ punto.dispositivo.aniv }}</p>
                                    </q-tooltip>
                                </q-badge>
                            </q-card-section>
                        </q-card>
                    </div>
                    
                </q-card-section>
            </q-card>    
        </q-dialog>
    </div>
</template>


<script>
import {defineComponent, ref, computed, watch, onMounted, toRef} from 'vue';
import { useQuasar } from "quasar";
import { useServicios } from 'src/composables/useServicios.js'
import { useUsers } from 'src/composables/useUsers.js'

export default defineComponent({
  name: "AsignarPuntos",
  props:['show','area_id','service_id'],
  emits: ['closeModal', 'submit'],
  setup(props, ctx) {
    const $q = useQuasar();
    const storeUsers = useUsers();
    const storeServicios = useServicios();
    const { AppActiveUser } = storeUsers
    const { staff, sin_asignar, asignados, dispositivos,usuariosDevice,
        managePoints, getDepartments
     } = storeServicios

    //reactividad de props  
    const mostrar = toRef(props, 'show')
    const ver = ref(mostrar == true)
    const signatario = ref('')

    const usuarioAsignar = ref(null)
    const puntosSeleccion = ref([])
    const liberar = ref([])
    const nuevoPunto = ref('')
    const dispositivo = ref('')

    const deviceAssigned = ref(false)
    const asignadosArea = ref([])
    

    const notify = (msg, type) => {
        $q.notify({
            position:'top',
            type,
            message:msg
        })
    }
    
    watch(mostrar, async (valor) => {
        if(valor){
            await managePoints({area_id:props.area_id, action:'get'})
            asignadosArea.value = asignados.value.filter(punto => punto.area_id == props.area_id)
        }
        ver.value = valor

    },{deep:true})

    watch(ver,(valor) => {
        if(!valor){
            usuarioAsignar.value = null
            ctx.emit('closeModal',false)
        }
    })

    watch(usuarioAsignar, (valor) => {
        dispositivo.value = ''
        deviceAssigned.value = false
        signatario.value = ''
        let dispostivosAsignados = []
        
        if(usuarioAsignar.value != null){
            usuariosDevice.value.map(item => {
            dispostivosAsignados.push(item.device.value)
            if(item.usuario.value == valor.value){
                if(item.device != undefined){
                    deviceAssigned.value = true
                    dispositivo.value = item.device
                }
            }
        })
        
        dispositivos.value.map((luxo, index) => {
            if(dispostivosAsignados.indexOf(luxo.value) > -1){
                // if(luxo.value == 3) console.log('luxo 3', dispostivosAsignados.indexOf(luxo.value))
                dispositivos.value.splice(index,1)
            }
        })
        }
    })

    
    const quitarPunto = async(item, index) => {
        
        liberar.value.push(item.value)
        const guardar = await managePoints({
            area_id: props.area_id, 
            action:'set', 
            usuario_id:item.user_id,
            sin_asignar: liberar.value,
            servicio_id: props.service_id
        })

        if(guardar.status == 200){
            await managePoints({area_id:props.area_id, action:'get'})
            await getDepartments({servicio_id: props.service_id})
            asignadosArea.value = asignados.value.filter(punto => punto.area_id == props.area_id)
            notify('Se quitó el punto de medición','positive') 
        } else {
            notify('Por favor contacta al administrador','negative') 
        }

        // asignados.value.splice(index,1)
    }

    const asignarStaff = async () => {
        if(usuarioAsignar.value == null){
            notify('Para continuar selecciona un usuario', 'negative')
            return false
        }

        if(puntosSeleccion.value.length == 0){
            notify('No hay puntos para asignar', 'negative')
            return false
        }

        $q.dialog({
                title: '¿Deseas continuar?',
                message:'Se asignarán los puntos de medición',
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
            }).onOk(async result => {

                // setUserDevice()

                const guardar = await managePoints({
                    area_id: props.area_id, 
                    action:'set', 
                    usuario_id:usuarioAsignar.value.value, 
                    para_asignar:puntosSeleccion.value,
                    sin_asignar: liberar.value,
                    device_id: dispositivo.value.value,
                    signatario_id: signatario.value.value,
                    servicio_id: props.service_id
                })

                if(guardar.status == 200){
                    await managePoints({area_id:props.area_id, action:'get'})
                    await getDepartments({servicio_id: props.service_id})
                    asignadosArea.value = asignados.value.filter(punto => punto.area_id == props.area_id)
                    notify('Se asignaron los puntos de medición','positive') 
                } else {
                    notify('Por favor contacta al administrador','negative') 
                }

                
                
            })
    }

    const crearPunto = () => {
        if(nuevoPunto.value == ''){
            notify('Por favor indica un nombre o ubicación', 'negative')
            return false
        }

        $q.dialog({
            title: '¿Deseas continuar?',
            message:'Se creará un punto de medición',
            ok: {
                push: true,
                label:'Continuar'
            },
            cancel: {
                push: true,
                color: 'dark',
                label:'Cancelar'
            },
            persistent: true
        }).onOk(async result => {

            const guardar = await managePoints({
                area_id: props.area_id, 
                action:'add', 
                punto:nuevoPunto.value
            })

            if(guardar.status == 200){
                await managePoints({area_id:props.area_id, action:'get'})
                await getDepartments({servicio_id: props.service_id})
                notify('Se creó un punto de medición','positive')
                nuevoPunto.value = ''
            } else {
                notify('Por favor contacta al administrador','negative') 
            }

                
                
        })
    }

    onMounted(async () => {
        ver.value = mostrar.value == true
        ctx.emit('closeModal', false)
    })
    return {
        ver,
        staff,
        sin_asignar,
        asignados,
        usuarioAsignar,
        puntosSeleccion,
        nuevoPunto,
        dispositivos,
        dispositivo,
        deviceAssigned,
        signatario,
        asignadosArea,
        asignarStaff,
        quitarPunto,
        crearPunto
    }
  }
})

</script>