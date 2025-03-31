<template>
<q-page class="q-pa-sm">
    <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" :to="{name:'index-admin'}" />
            <q-breadcrumbs-el label="Roles" icon="bookmark" :to="{name:'roles'}" />
            <q-breadcrumbs-el label="Role" icon="check_circle" />    
        </q-breadcrumbs>
    </div>
    <div class="row q-mt-lg">
        <div class="col-xs-12">
            <div class="q-pa-sm">
                <q-card rounded class="q-pa-md">
                    <q-separator />
                        <span class="text-h5">Role:{{ role.name }}</span>
                    <q-separator />
                    <q-card-section class="q-mt-md">
                        <q-list bordered class="rounded-borders">
                            <q-expansion-item
                                expand-separator
                                icon="bookmark"
                                header-class="text-primary"
                                :label="`${modulo.name}`" v-for="(modulo,i) in modulos" :key="i"
                                style="border: .2px solid gray"
                            >
                            <q-separator />
                                <div class="row q-pa-sm q-mt-md">
                                    <div class=" q-gutter-sm">
                                        <q-toggle 
                                            v-for="(permission,index) in listaPermisos(modulo)"
                                            :key="index" color="primary" 
                                            :label="`${permission.name}`" 
                                            v-model="permisosAsignar" 
                                            :val="permission.id" 
                                        />
                                      
                                    </div>
                                </div>
                            </q-expansion-item>
                        </q-list>
                    </q-card-section>
                    <div class="row justify-end q-pa-md">
                        <q-btn label="guardar" color="primary" @click="assignar" />
                    </div>
                </q-card>
            </div>
        </div>
    </div>
</q-page>
</template>

<script>
  //seguir el mismo ejemplo para crear todo como componente
  import {defineComponent, onMounted, ref} from 'vue'
  import { usePermisos } from 'src/composables/usePermisos.js'
  import { useQuasar } from "quasar";
  import { useRoute, useRouter } from 'vue-router';

  export default defineComponent({
    name: 'asignarRolesPage',
    setup() {
        const $permisos = usePermisos();
        const $q = useQuasar();
        const router = useRouter()
        const $route = useRoute();

        const {role, modulos, permisos, getModules, getRole, getPermissions, addPermissionsToRole} = $permisos
        
        const filter = ref('')
        const columns = ref([
            {name: 'role', label: 'Role',field: 'role', align:'center'},
            {name: 'description', label: 'Descripción', field: 'description', align:'center'},
            {name: 'usuarios', label: 'Usuarios', field: 'usuarios', align:'center'},
            {name: 'acciones', label: 'Acciones', align:'center'}
        ])

        const permisosAsignar = ref([])
        const permissionsList = ref([])

        const notify = (msg, type) => {
            $q.notify({
                position:'top',
                type,
                message:msg
            })
        }

        const goTo = (value) => {
            router.push({name:'assign', params:{id:value.id}})
        }

        const listaPermisos = (parent) => {
            const collection = permisos.value.filter((permiso) => permiso.module_id === parent.id)
            return collection
        }

        const setPermisos = async() => {
            await getPermissions()
            permisos.value.map((permiso) => {
                permissionsList.value.push({
                    text:permiso.name,
                    value:permiso.id,
                    module_id:permiso.module_id
                })
           })
        }

        const assignar = () => {
            $q.dialog({
                title: '¿Seguro que quieres continuar?',
                message:'Se asignaran los permisos seleccionados',
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
            }).onOk(async () => {
                const guardar = await addPermissionsToRole({
                    role_id: $route.params.id, 
                    permissions_ids:permisosAsignar.value
                })

                if(guardar.status == 200){
                    notify('Se actualizó el rol exitosamente', 'positive')
                } else {
                    notify('Por favor contacta al administrador', 'negative')   
                }
            })
        }

        onMounted(async () => {
            await getRole($route.params.id)
            await getModules()
            await setPermisos()

            setTimeout(function () {
                Object.values(role.value.permissions).map(function (key) {
                    permisosAsignar.value.push(key.id)
                })
            }, 500)
        })
        
        return {
            columns,
            filter,
            role,
            modulos,
            permisos,
            permisosAsignar,
            permissionsList,
            assignar,
            goTo,
            listaPermisos,
            
        }
    },
  
  })
  </script>