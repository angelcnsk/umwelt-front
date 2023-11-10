<template>
    <q-page class="q-pa-sm">
        <div class="row q-pa-sm" >
            <div class="col-md-12">
                <q-btn v-if="agregar_usuario" @click="showNewUser = !showNewUser" color="primary" glossy text-color="white" icon="person">
                    <q-tooltip anchor="center right" self="center left" :offset="[10, 10]"> Agregar usuario </q-tooltip>
                </q-btn>

            </div>
        </div>
        
        <div class="row" v-if="showNewUser">
            <div class="col-xs-12">
                <div class="q-mt-lg q-pa-sm">
                    <div class="q-gutter-md">
                        <q-card rounded>
                            <q-card-section style="max-width: 400px">
                                <q-input class="q-ma-sm" v-model="newUser.nombre" filled label="Nombre"></q-input>
                                <q-input class="q-ma-sm" v-model="newUser.email" filled label="Email"></q-input>

                                <q-btn @click="cancelNewuSER" class="q-ma-sm" color="dark" label="Cancelar"></q-btn>
                                <q-btn @click="addNewUser" color="primary" label="Guardar"></q-btn>
                            </q-card-section>
                            
                        </q-card>
                    </div>
                </div>
            </div>
        </div>

        <div class="row q-mt-lg">
            <div class="col-xs-12">
                <div class="q-pa-sm">
                    <q-card rounded>
                        <q-table
                            title="Usuarios"
                            :rows="users"
                            :columns="columns"
                            :filter="filter"
                            row-key="id"
                            @row-click="goToUser"
                            
                        >
                            <template v-slot:top-right>
                                <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                                </q-input>
                            </template>

                            <!-- <template v-slot:body-cell-name="props">
                                <router-link
                                    :to="{ hash: '#Handling-links' }"
                                    custom
                                    v-slot:default="props"
                                >
                                    {{props.row}}
                                </router-link>
                            </template> -->

                            <template v-slot:body-cell-active="props">
                                <q-td :props="props" class="text-center">
                                    <q-chip outline square color="primary" text-color="white" class="text-center">
                                        {{props.row.active == 1 ?  'Activo' : 'Inactivo'}}
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
  import {defineComponent, computed, onMounted, watch, ref} from 'vue'
  import { useUsers } from 'src/composables/useUsers.js'
  import { useQuasar } from "quasar";
  import { useRoute, useRouter } from 'vue-router';

const $store = useUsers();
const $q = useQuasar();
const router = useRouter()

const {AppActiveUser, createUser, fetchUsers, users} = $store
const agregar_usuario = ref(false)    
const showNewUser = ref(false)
const newUser = ref({})
const filter = ref('')
const columns = ref([
    {name: 'id', label: 'Id',field: 'id', align:'center'},
    {name: 'name', label: 'Nombre', field: 'name', align:'center'},
    {name: 'email', label: 'Email', field: 'email', align:'center'},
    {name: 'role', label: 'Role', field: 'role', align:'center'},
    {name: 'active', label: 'Status', field: 'active', align:'center'}
])

const permisos = computed(async () => {
    return await AppActiveUser.value.permissions
})

watch(permisos, async (newVal) => {
    const find = await newVal
    agregar_usuario.value = find.find((permiso) => permiso === 'agregar_usuario')
})

const cancelNewuSER = () => {
    showNewUser.value = !showNewUser.value
    newUser.value = {}
}

const addNewUser =  async() => {
    const responseUser = await createUser(newUser.value)
    console.log(responseUser)
    if (responseUser.msg === 'success') {
        await fetchUsers()
        $q.notify({
            position:'top',
            type: 'positive',
            message: 'Se creó el usuario con éxito'
        })
        
        newUser.value = {}
        
    } else {
        $q.notify({
            position:'top',
            type: 'negative',
            message: 'Hubo un problema contacta al administrador'
        })
    }
}

const goToUser = (e,value) => {
    router.push({name:'editar-usuario', params:{id:value.id}})
}

onMounted(async () => {
    if(AppActiveUser.value.permissions){
        agregar_usuario.value = AppActiveUser.value.permissions.find((permiso) => permiso === 'agregar_usuario')
    }
    await fetchUsers()
})
</script>
  