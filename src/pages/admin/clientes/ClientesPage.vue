<template>
    <q-page class="q-pa-sm">
        <div class="row q-pa-sm" >
            <div class="col-md-12">
                <q-btn v-if="agregar_cliente" @click="addClient = true" color="primary" glossy text-color="white" icon="domain_add">
                    <q-tooltip anchor="center right" self="center left" :offset="[10, 10]"> Agregar cliente </q-tooltip>
                </q-btn>

            </div>
        </div>
        
        <div class="row q-mt-lg">
            <div class="col-xs-12">
                <div class="q-pa-sm">
                    <q-card rounded>
                        <q-table
                            title="Clientes"
                            :rows="clients"
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
                                        {{props.row.active == null ?  'Principal' : 'Sucursal'}}
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
        <q-dialog v-model="addClient" ref="address" transition-show="flip-down" transition-hide="flip-up">
            <q-card class="q-dialog-plugin">
                <q-card-section>
                    <div class="q-mb-lg">
                        <div class="col-xs-11 col-sm-4 q-pa-sm">
                            <q-input 
                                v-model="newClient.legalname"
                                label="Razón social"
                            />
                        </div>
                        <div class="col-xs-11 col-sm-4 q-pa-sm">
                            <q-input
                                v-model="newClient.rfc"
                                maxlength="13"
                                :rules="[
                                    val => !!val || '* Campo obligatorio',
                                ]"
                                label="RFC"
                            />
                        </div>
                    </div>
                </q-card-section>
            <!-- buttons example -->
            <q-card-actions align="right">
                <q-btn color="primary" label="Cancelar" v-close-popup />
                <q-btn color="primary" label="Guardar" @click="saveClient" />
            </q-card-actions>
            </q-card>
        </q-dialog>
        
    </q-page>
</template>
  
<script setup>
  //seguir el mismo ejemplo para crear todo como componente
import {onMounted, watch, ref, watchEffect} from 'vue'
import { useClientes } from 'src/composables/useClientes.js'
import { useUsers } from 'src/composables/useUsers.js'
import { useQuasar } from "quasar";
import { useRouter } from 'vue-router';
const storeClientes = useClientes();
const storeUsers = useUsers()
const $q = useQuasar();
const router = useRouter()

const { AppActiveUser } = storeUsers
const {getClients, clients, createClient} = storeClientes
const agregar_cliente = ref(false)
const editar_cliente = ref(false)
const newClient = ref({})
const addClient = ref(false)

const filter = ref('')
const columns = ref([
    {name: 'id', label: 'Id',field: 'id', align:'center'},
    {name: 'legalname', label: 'Nombre', field: 'legalname', align:'center', sortable:true, sortOrder:'ad'},
    // {name: 'client_id', label: 'Principal', field: 'client_id', align:'center'},
    // {name: 'alias', label: 'Planta', field: 'alias', align:'center'},
    {name: 'rfc', label: 'RFC', field: 'rfc', align:'center'},
    // {name: 'statedsc', label: 'Estado', field: 'statedsc', align:'center'},
    {name: 'status', label: 'Estatus', field: 'status', align:'center'}
])

const permisos = ref([]);

watchEffect(async () => {
  permisos.value = await obtenerPermisos();
});

async function obtenerPermisos() {
  return AppActiveUser.value.permissions;
}

watch(permisos, async (newVal) => {
    const find = await newVal
    agregar_cliente.value = find.find((permiso) => permiso === 'agregar_empresa')
    editar_cliente.value = find.find((permiso) => permiso === 'editar_cliente')
})

const goTo = (e, element) => {
    if(editar_cliente.value){
        router.push({name:'cliente', params:{id:element.id}})
    }
}

const saveClient = async () => {
    const crearCliente = await createClient(newClient.value)
    if(crearCliente.response){
        if(crearCliente.response.data.errors)
        $q.notify({
            position:'top',
            type:'negative',
            message:'El RFC ingresado corresponde a otro cliente'
        })
    }
    
    if(crearCliente.status == 200){
        $q.notify({
            position:'top',
            type:'positive',
            message:'El cliente se creó correctamente'
        })
        getClients()
        addClient.value = false
        newClient.value = {}
    }
}

onMounted(async () => {
    if(AppActiveUser.value.permissions){
        agregar_cliente.value = AppActiveUser.value.permissions.find((permiso) => permiso === 'agregar_empresa')

        editar_cliente.value = AppActiveUser.value.permissions.find((permiso) => permiso === 'editar_cliente')
    }
    await getClients()
})
  
</script>
  