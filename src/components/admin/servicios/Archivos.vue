<template>
<div class="q-ma-md">
    <div class="row" v-if="cargar_archivos">
        <div class="col-xs-12 col-md-4" id="fileInput">
            <q-file
                for="fileInput"
                class="q-mt-sm"
                ref="inputFile"
                v-model="uploader"
                filled
                type="file"
                label="Selecciona un archivo"
            />
            <q-spinner-dots v-if="loading" class="q-ml-lg" color="primary" size="lg" />
        </div>
        <div class="col-xs-12 col-md-3">
            <q-select v-model="seccion" :options="secciones" label="Sección" class="q-pa-sm" />
            <div class="row justify-end">
                <q-btn icon="cloud_upload" class="q-ml-sm q-mt-sm" color="primary" @click="upLoadFile"> 
                    <q-tooltip max-width="200px" self="top middle" >Cargar archivo</q-tooltip>
                </q-btn>
            </div>
            
        </div>
        
        
        
    </div>
    <div class="row q-mt-lg">
        <div class="col-xs-12">
            <q-table
                style="height: 300px"
                virtual-scroll
                title="Archivos"
                :rows="archivos"
                :columns="columns"
                row-key="id"
            >
            
            <template v-slot:body-cell-usuario="props">
                <q-td key="usuario" :props="props">
                    <q-avatar>
                        <img :src="props.row.usuario.avatar">
                        <q-tooltip>{{ props.row.usuario.name }}</q-tooltip>
                    </q-avatar>
                </q-td>
            </template>
            <template v-slot:body-cell-acciones="props">
                <q-td key="acciones" :props="props">
                    <q-btn icon="description" color="green-3" class="q-mr-sm" :href="props.row.url" target="_blank">
                        <q-tooltip>Ver archivo</q-tooltip>
                    </q-btn>
                    <q-btn icon="delete" color="red-3" class="q-mr-sm" @click="deleteArea(props.row)" :disabled="!borrar_archivos">
                        <q-tooltip>Borrar archivo</q-tooltip>
                    </q-btn>
                </q-td>
            </template>
            </q-table>
        </div>    
    </div>
</div>
</template>
  
  <script>
import {defineComponent, ref, computed, watch, onMounted, defineProps} from 'vue';
import { useQuasar } from "quasar";

import { useUsers } from 'src/composables/useUsers.js'
import { useServicios } from 'src/composables/useServicios.js'

export default defineComponent({
    name: "Archivos",
    props:['servicio_id'],
    setup(props) {
        const $q = useQuasar();
        const storeUsers = useUsers()
        const storeServicios = useServicios()
        const { AppActiveUser } = storeUsers
        const { 
            getSectionFile, saveSectionFile,removeFile, archivos, secciones
        } = storeServicios

        const cargar_archivos = ref(false)
        const borrar_archivos = ref(false)
        const seccion = ref(null)
        const uploader = ref()
        const loading = ref(false)
        const inputFile = ref()

        const notify = (msg, type) => {
            $q.notify({
                position:'top',
                type,
                message:msg
            })
        }

        watch(AppActiveUser, (valor) => {
            permisos.value = valor.permissions
            console.log('set permisos')
        })

        const permisos = ref([])

        watch(permisos, (newVal) => {
            if(newVal != undefined){
                const find = newVal
                console.log('permisos_usuario', newVal)
                cargar_archivos.value = find.find((permiso) => permiso === 'cargar_archivo')
                borrar_archivos.value = find.find((permiso) => permiso === 'borrar_archivo')
            }
        })

        const columns = ref([
            {
            label: 'Id',
            field: 'id',
            sortable:false,
            align:'center'
            },
            {
            label: 'Archivo',
            field: 'name',
            sortable:false,
            align:'center'
            },
            {
            label: 'Usuario',
            name: 'usuario',
            sortable:true,
            align:'center'
            },
            {
            label: 'Fecha',
            name: 'fecha',
            field: 'creation_date',
            sortable:true,
            align:'center'
            },
            {
            label: 'Acciones',
            sortable:false,
            align:'center',
            name: 'acciones'
            },    
        ])

        const upLoadFile = async () => {
            
            // let input = document.getElementById("fileInput")
            uploader.value = null
            console.log(inputFile.value)
            
            if(seccion.value == null){
                notify('Para continuar selecciona una sección','negative')
                return false
            }
            // loading.value = true    
            const guardar = await saveSectionFile({
                files:uploader.value,
                service_id: props.servicio_id,
                seccion_id: seccion.value.id
            })
            inputFile.value = ref()
            if(guardar.status == 200){
                notify('Archivo cargado con éxito','positive')
                uploader.value.value = null
                inputFile.value.value = null
                loading.value = false
                await getSectionFile({service_id:props.servicio_id, type:'get'})
            } else {
                notify('Error al cargar archivo','negative')   
            }
        }

        
        
        onMounted(async() => {
            await getSectionFile({service_id:props.servicio_id, type:'get'})
            if(AppActiveUser.value != undefined || AppActiveUser.value != null){
                permisos.value = AppActiveUser.value.permissions
            }
        })

        return {
            archivos,
            secciones,
            columns,
            seccion,
            uploader,
            loading,
            inputFile,
            upLoadFile,
            cargar_archivos,
            borrar_archivos,
            
        }
    }
})
  </script>
  
  