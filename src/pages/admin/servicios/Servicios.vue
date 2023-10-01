<template>
    <q-page class="q-pa-sm">
        <div class="row q-pa-sm" >
            <div class="col-md-12">
                <q-btn v-if="agregar_servicio" @click="addService = !addService" color="primary" glossy text-color="white" icon="add_task">
                    <q-tooltip anchor="center right" self="center left" :offset="[10, 10]"> Nuevo servicio </q-tooltip>
                </q-btn>
            </div>
        </div>

        <div class="row q-mt-lg q-pa-sm" v-if="addService">
            <div class="col-xs-12">
                <q-card rounded>
                    <q-card-section>
                        <div class="row">
                            <span class="text-h5">
                                Generar nueva orden de servicio
                            </span>
                        </div>
                        <div class="row">
                            <div class="col-md-3 col-xs-12 q-pa-sm">
                                <q-select 
                                    :options="productos" 
                                    option-label="producto"
                                    v-model="service.producto" 
                                    label="Producto" 
                                    emit-value
                                    :rules="[
                                        val => !!val || '* Campo obligatorio',
                                    ]"
                                />

                                
                            </div>
                            <div class="col-md-3 col-xs-12 q-pa-sm">
                                <q-select
                                    v-model="service.client" 
                                    :model-value="service.client"
                                    hide-selected
                                    fill-input
                                    use-input
                                    input-debounce="0"
                                    :options="clientes"
                                    option-label="legalname"
                                    @filter="filterFn"
                                    
                                    emit-value
                                    label="Cliente"
                                >
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        Sin resultados
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>
                            </div>
                            <div class="col-md-3 col-xs-12 q-pa-sm">
                                <q-select
                                    v-model="service.planta" 
                                    :model-value="service.planta"
                                    hide-selected
                                    fill-input
                                    use-input
                                    input-debounce="0"
                                    :options="plantas"
                                    option-label="alias"
                                    @filter="filterPlanta"
                                    emit-value
                                    label="Planta"
                                >
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        Sin resultados
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>
                            </div>
                            <div class="col-md-3 col-xs-12 q-pa-sm">
                                <q-select
                                    v-model="service.owner" 
                                    :model-value="service.owner"
                                    hide-selected
                                    fill-input
                                    use-input
                                    input-debounce="0"
                                    :options="owners"
                                    option-label="label"
                                    @filter="filterStaff"
                                    
                                    label="Responsable"
                                >
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        Sin resultados
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>
                            </div>
                            <!-- <div class="col-md-3 q-pa-sm">
                                <q-toggle label="Acepta reconocimiento" v-model="service.recognition" />
                            </div> -->
                        </div>
                        <div class="row">
                            <!-- <div class="col-md-4 col-xs-12 q-pa-sm">
                                <q-input 
                                    filled 
                                    v-model="service.date_recognition" 
                                    mask="date" 
                                    label="Inicio de reconocimiento"
                                    :readonly="!service.recognition"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="service.date_recognition" :readonly="!service.recognition">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                            </q-date>
                                        </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div> -->
                            <!-- <div class="col-md-4 col-xs-12 q-pa-sm">
                                <q-input filled v-model="service.date_start" mask="date" :rules="['date']" label="Inicio de ejecución">
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="service.date_start">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                            </q-date>
                                        </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-md-4 col-xs-12 q-pa-sm">
                                <q-input filled v-model="service.date_end" mask="date" :rules="['date']" label="Fin de ejecución">
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="service.date_end">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                            </q-date>
                                        </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div> -->
                        </div>
                        <div class="row justify-end q-mr-sm">
                            <q-btn label="guardar" color="primary" @click="saveService" />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        
        <div class="row q-mt-lg">
            <div class="col-xs-12">
                <div class="q-pa-sm">
                    <q-card rounded>
                        <q-table
                            title="Servicios"
                            :rows="servicesList"
                            :columns="columns"
                            :filter="filter"
                            row-key="id"
                            @row-click="goTo"
                            
                        >
                            <template v-slot:top-right>
                                <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                                </q-input>
                            </template>

                            <template v-slot:body-cell-client_id="props">
                                <q-td :props="props" class="text-center">
                                    <q-chip outline square color="primary" text-color="white" class="text-center">
                                        {{props.row.active == null ?  'Principal' : 'Planta'}}
                                    </q-chip>        
                                </q-td>
                            </template>

                            <template v-slot:body-cell-status="props">
                                <q-td :props="props" class="text-center">
                                    <q-chip outline square :color="props.row.status ? 'primary' : 'grey' " text-color="white" class="text-center">
                                        {{props.row.status ? 'Activo' : 'Inactivo'}}
                                    </q-chip>        
                                </q-td>
                            </template>

                        </q-table>
                    </q-card>
                </div>
            </div>
        </div>
        
        
    </q-page>
</template>
  
<script setup>
  //seguir el mismo ejemplo para crear todo como componente
  import {computed, onMounted, watch, ref} from 'vue'
  import { useClientes } from 'src/composables/useClientes.js'
  import { useUsers } from 'src/composables/useUsers.js'
  import { useServicios } from 'src/composables/useServicios.js'
  import { launchNotify, getNotify } from 'src/composables/firebase/notificaciones'
  import { useQuasar, date } from "quasar";
  import { useRouter } from 'vue-router';

const storeClientes = useClientes();
const storeUsers = useUsers();
const storeServicios = useServicios();

const $q = useQuasar();
const router = useRouter();

const { AppActiveUser } = storeUsers
const {getClients, clients, createClient} = storeClientes
const { staff, getStaff, getService, servicesList, productos, getProductos, getServices, newService } = storeServicios


const agregar_servicio = ref(false)

const addService = ref(false)
const clienteSelected = ref(null)
const clientes = ref([])
const plantasArr = ref([])
const plantas = ref([])
const owners = ref([])
const timeStamp = Date.now()
const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')

const service = ref({
    recognition:false,
    date_recognition:formattedString,
    date_start:formattedString,
    date_end:formattedString
})

const filter = ref('')
const columns =  [
{
    label: 'Id',
    field: 'id',
    sortable:false,
    align:'center'
},
// {
//   label: 'OT',
//   field: 'ot',
//   align:'center'
// },
{
    label: 'Estatus',
    field: 'status',
    html:   true,
    align:'center'
},
{
    label: 'Cliente',
    field: 'cliente',
    align:'center'
},
{
    label: 'Planta',
    field: 'alias',
    align:'center'
},
{
    label: 'Producto',
    field: 'producto',
    align:'center'
},
{
    label: 'Solicitante',
    field: 'requester',
    html:   true,
    align:'center'
},
{
    label: 'Responsable',
    field: 'owner',
    align:'center'
},
{
    label: 'Fecha creación',
    field: 'create_date',
    align:'center'
}
]

const notify = (msg, type) => {
    $q.notify({
        position:'top',
        type,
        message:msg
    })
}
const permisos = computed(async () => {
    return AppActiveUser.value.permissions
})

watch(permisos, async (newVal) => {
    const find = await newVal
    agregar_servicio.value = find.find((permiso) => permiso === 'agregar_servicio')
})

watch( () => service,(currValue, prevValue) => {
    // second param, watcher callback
    if(currValue.value.client){
        plantasArr.value = currValue.value.client.plantas
    }
    if(!currValue.value.recognition){
        service.value.date_recognition = null
    }
},
    { deep: true }                       // third param, for deep checking
);

const validate = () => {
    if(service.value.producto == undefined || service.value.producto == null){
        notify(`Para continuar selecciona un producto`, 'negative')
        return false
    }
    if(service.value.client == undefined || service.value.client == null){
        notify(`Para continuar selecciona un cliente`, 'negative')
        return false
    }
    if(service.value.planta == undefined || service.value.planta == null){
        notify(`Para continuar selecciona una planta`, 'negative')
        return false
    }
    if(service.value.owner == undefined || service.value.owner == null){
        notify(`Para continuar selecciona un responsable`, 'negative')
        return false
    }

    // if(service.value.recognition && service.value.date_recognition == undefined || service.value.recognition && service.value.date_recognition == null){
    //     notify(`Falta fecha de reconocimiento`, 'negative')
    //     return false
    // }

    // if(service.value.date_start == undefined || service.value.date_start == null){
    //     notify(`Falta fecha de inicio de servicio`, 'negative')
    //     return false
    // }

    // if(service.value.date_end == undefined || service.value.date_end == null){
    //     notify(`Falta fecha de fin de servicio`, 'negative')
    //     return false
    // }
    return true   
}

const saveService = async() => {
    if(validate()){
        $q.dialog({
            title: '¿Estás seguro?',
            message: 'Se iniciará un nuevo servicio',
            // prompt: {
            //   model: password,
            //   isValid: val => val.length > 5,
            //   type: 'password' // optional
            // },
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
        
            // service.value.recognition_date = date.formatDate(service.value.date_recognition, 'YYYY-MM-DD')
            // service.value.start_date = date.formatDate(service.value.date_start, 'YYYY-MM-DD')
            // service.value.end_date = date.formatDate(service.value.date_end, 'YYYY-MM-DD')

            service.value.producto_id = service.value.producto.id
            service.value.client_id = service.value.client.id
            service.value.planta_id = service.value.planta.client_id
            service.value.owner_id = service.value.owner.value
            const initService = await newService(service.value)
            if(initService.status == 200){
                await launchNotify(initService.data.info)
                notify('Se creó un nuevo servicio','positive')
                // service.value = { 
                //     date_start:formattedString,
                //     date_end:formattedString
                // }
                addService.value = false
            }
                
            else {
                notify('Error al crear un nuevo servicio','negative')
            }
            await getServices()                
        }).onCancel(() => {
            // console.log('>>>> Cancel')
        }).onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
        })         
    }
}

const filterFn = (val, update, abort) => {
    if (val === '') {
        update(() => {
            clientes.value = clients.value
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        clientes.value = clients.value.filter(v => v.legalname.toLowerCase().indexOf(needle) > -1)
    })
}

const filterStaff = (val, update, abort) => {
    if (val === '') {
        update(() => {
            owners.value = staff.value
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        owners.value = staff.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
    })
}

const filterPlanta = (val, update, abort) => {
    if (val === '') {
        update(() => {
            plantas.value = plantasArr.value
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        plantas.value = plantasArr.value.filter(v => v.alias.toLowerCase().indexOf(needle) > -1)
    })
}


const goTo = (e, value) => {
    router.push({name:'servicio', params:{id:value.id}})
}

onMounted(async () => {
    if(AppActiveUser.value.permissions){
        agregar_servicio.value = AppActiveUser.value.permissions.find((permiso) => permiso === 'agregar_servicio')
    }
    await getClients()
    await getProductos()
    await getServices()
    await getStaff({owner_service:true})
})
  </script>
  