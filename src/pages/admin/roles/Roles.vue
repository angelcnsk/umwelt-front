<template>
<q-page class="q-pa-sm">
    <div class="row q-mt-lg">
        <div class="col-xs-12">
            <div class="q-pa-sm">
                <q-card rounded>
                    <q-table
                        title="Roles"
                        :rows="roles"
                        :columns="columns"
                        :filter="filter"
                        row-key="id"
                    >
                        <template v-slot:top-right>
                            <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                            </q-input>
                        </template>

                        <template v-slot:body-cell-usuarios="props">
                            <q-td :props="props" class="text-center">
                                <q-chip 
                                    outline 
                                    :label="props.row.total_usuarios" 
                                    color="primary" 
                                    size="md" 
                                    class="cursor-pointer"
                                >
                                    <q-tooltip self="top start" :offset="[100, 10]">
                                        <p v-for="user in props.row.usuarios">{{user.name}}</p>
                                    </q-tooltip>
                                </q-chip> 
                            </q-td>
                        </template>

                        <template v-slot:body-cell-acciones="props">
                            <q-td :props="props" class="text-center">
                                <q-btn label="Asignar" color="primary" outline @click="goTo(props.row)" />
                            </q-td>
                        </template>

                    </q-table>
                </q-card>
            </div>
        </div>
    </div>
</q-page>
</template>

<script>
  //seguir el mismo ejemplo para crear todo como componente
  import {defineComponent,defineAsyncComponent, computed, onMounted, watch, ref} from 'vue'
  import { useUsers } from 'src/composables/useUsers.js'
  import { usePermisos } from 'src/composables/usePermisos.js'
  import { useQuasar } from "quasar";
  import { useRoute, useRouter } from 'vue-router';

  export default defineComponent({
    name: 'rolesPage',
    // components: {
    //   CardSocial: defineAsyncComponent(() => import('components/cards/CardSocial.vue')),
    // },
    setup() {
        const $store = useUsers();
        const $permisos = usePermisos();
        const $q = useQuasar();
        const router = useRouter()

        const {AppActiveUser, createUser, fetchUsers, users} = $store
        const {roles, getRoles} = $permisos
        
        const agregar_usuario = ref(false)    
        const showNewUser = ref(false)
        const newUser = ref({})
        const filter = ref('')
        const columns = ref([
            {name: 'role', label: 'Role',field: 'role', align:'center'},
            {name: 'description', label: 'Descripción', field: 'description', align:'center'},
            {name: 'usuarios', label: 'Usuarios', field: 'total_usuarios', align:'center'},
            {name: 'acciones', label: 'Acciones', align:'center'}
        ])

        const permisos = computed(async () => {
            return await AppActiveUser.value.permissions
        })
        
        watch(permisos, async (newVal) => {
            const find = await newVal
            agregar_usuario.value = find.find((permiso) => permiso === 'agregar_usuario')
        })

        const goTo = (value) => {
            router.push({name:'assign', params:{id:value.id}})
        }

        onMounted(async () => {
            // if(AppActiveUser.value.permissions){
            //     agregar_usuario.value = AppActiveUser.value.permissions.find((permiso) => permiso === 'agregar_usuario')
            // }
            await getRoles()
        })
        
        return {
            columns,
            filter,
            roles,
            goTo
        }
    },
  
  })
  </script>