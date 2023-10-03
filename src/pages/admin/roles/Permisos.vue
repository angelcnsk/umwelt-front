<template>
<q-page class="q-pa-sm">
    <div class="row q-mt-lg">
        <div class="col-xs-12">
            <div class="q-pa-sm">
                <q-card rounded class="q-pa-sm">
                    <q-card-section>
                        <q-separator />
                            <span class="text-h5">Permisos</span>
                        <q-separator />
                    </q-card-section>
                    <q-card-section class="q-mt-md">
                        <div class="row">
                            <div class="col-md-3">
                                <q-select  v-model="permiso.module" option-label="name" :options="modulos" label="Modulo" style="width: 95%;"  />
                            </div>
                            <div class="col-md-3">
                                <q-input label="Permiso" v-model="permiso.name" style="width:95%" />
                            </div>
                            <div class="col-md-2">
                                <q-btn 
                                    label="guardar" 
                                    color="primary" 
                                    class="q-mt-md"
                                    @click="validatePermission"
                                />
                            </div>
                        </div>
                    </q-card-section>
                    <q-card-section>
                        <q-list bordered class="rounded-borders">
                            <q-expansion-item
                                expand-separator
                                header-class="text-primary"
                                :label="`${modulo.name}`" v-for="(modulo,i) in modulos" :key="i"
                                style="border: .2px solid gray"
                            >
                            <q-separator />
                                <div class="row q-pa-sm q-mt-md">
                                    <div class="q-gutter-sm q-ml-sm">
                                        <q-chip
                                            outline
                                            v-for="(permission,index) in listaPermisos(modulo)"
                                            :key="index" color="primary"
                                            text-color="white"
                                            :label="`${permission.text}`" 
                                            icon="bookmark"
                                            :val="permission.id" 
                                        />
                                      
                                    </div>
                                </div>
                            </q-expansion-item>
                        </q-list>
                    </q-card-section>
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
    name: 'permisosPage',
    // components: {
    //   CardSocial: defineAsyncComponent(() => import('components/cards/CardSocial.vue')),
    // },
    setup() {
        const $store = useUsers();
        const $permisos = usePermisos();
        const $q = useQuasar();
        const router = useRouter()
        const $route = useRoute();

        const {AppActiveUser, createUser, fetchUsers, users} = $store
        const {role, modulos, permisos, getRoles, getModules, getRole, getPermissions, addPermissionsToRole, savePermission} = $permisos
        
        const filter = ref('')
        const columns = ref([
            {name: 'role', label: 'Role',field: 'role', align:'center'},
            {name: 'description', label: 'Descripción', field: 'description', align:'center'},
            {name: 'usuarios', label: 'Usuarios', field: 'usuarios', align:'center'},
            {name: 'acciones', label: 'Acciones', align:'center'}
        ])

        const permissionsList = ref([])
        const permiso = ref({name:'', module:''})

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

        const setPermisos = async() => {
            await getPermissions()
            permissionsList.value=[]
            permisos.value.map((permiso) => {
                permissionsList.value.push({
                    text:permiso.name,
                    value:permiso.id,
                    module_id:permiso.module_id
                })
           })
        }

        const validatePermission = async () => {
            if (permiso.value.module == '') {
                notify('Selecciona un modulo para el nuevo permiso', 'negative')
                return false
            } else if (permiso.value.name == '') {
                notify('Ingresa un nombre para el nuevo permiso','negative')
                return false
            } 

            $q.dialog({
                title: '¿Seguro que quieres continuar?',
                message:'Se agregará un nuevo permiso',
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
                const guardar = await savePermission(permiso.value)
                await setPermisos()
                if(guardar.status == 200){
                    notify('Se agregó un nuevo permiso', 'positive')
                } else {
                    notify('Por favor contacta al administrador', 'negative')   
                }
            })
        }
        
        const listaPermisos = (parent) => {
            const collection = permissionsList.value.filter((permiso) => permiso.module_id === parent.id)
            return collection
        }

        onMounted(async () => {
            await getModules()
            await setPermisos()
        })
        
        return {
            columns,
            filter,
            role,
            modulos,
            permisos,
            permissionsList,
            permiso,
            goTo,
            validatePermission,
            listaPermisos
        }
    },
  
  })
  </script>