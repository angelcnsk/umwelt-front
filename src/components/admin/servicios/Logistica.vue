<template>
    <div class="q-ma-md q-mb-lg">
        <q-card>
            <q-card-section>
                <div class="text-h6 text-grey-8">
                Logística
                </div>
            </q-card-section>
            <q-card-section>
                <div class="row items-center">
                    <div class="col-md-3 col-xs-12 q-pa-sm">
                        <!-- <q-select
                            v-model="departmentSelected" 
                            :model-value="departmentSelected"
                            hide-selected
                            fill-input
                            use-input
                            input-debounce="0"
                            :options="lista"
                            option-label="label"
                            label="Departamentos"
                        >
                            <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                Sin resultados
                                </q-item-section>
                            </q-item>
                            </template>
                        </q-select> -->
                        <q-select v-model="departmentSelected" :options="departamentosList" option-label="department" label="Departamentos" />
                    </div>
                    <div class="col-md-6">
                        <q-btn class="q-mt-md q-ml-sm" label="Departamento" color="primary" outline @click="showModalDpto = !showModalDpto">
                            <q-tooltip anchor="center left" self="center left" :offset="[10, 10]"> Agregar departamento </q-tooltip>
                        </q-btn>
                        <q-btn class="q-mt-md q-ml-sm" label="Áreas" color="primary" outline @click="openModalArea">
                            <q-tooltip anchor="center left" self="center left" :offset="[10, 10]"> Agregar áreas </q-tooltip>
                        </q-btn>
                    </div>
                </div>
                <div class="row q-mt-lg">
                    <div class="col-xs-12">
                        <q-table
                            style="height: 300px"
                            virtual-scroll
                            title="Áreas"
                            :rows="areas"
                            :columns="columns"
                            row-key="id"
                        >
                        
                        <template v-slot:body-cell-usuario="props">
                            <q-td key="usuario" :props="props">
                                <q-avatar>
                                    <img :src="props.row.avatar">
                                    <q-tooltip>{{ props.row.name }}</q-tooltip>
                                </q-avatar>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-acciones="props">
                            <q-td key="acciones" :props="props">
                                <q-btn icon="edit" color="green-3" class="q-mr-sm" @click="editArea(props.row)">
                                    <q-tooltip>Editar área</q-tooltip>
                                </q-btn>
                                <q-btn icon="delete" color="red-3" class="q-mr-sm" @click="deleteArea(props.row)">
                                    <q-tooltip>Eliminar área</q-tooltip>
                                </q-btn>
                                
                                <q-btn icon="group" color="blue-3" @click="openAsignar(props.row)">
                                    <q-tooltip>Asignar staff</q-tooltip>
                                </q-btn>
                            </q-td>
                        </template>
                        </q-table>
                    </div>    
                </div>
            </q-card-section>
        </q-card>
    </div>

    <q-dialog v-model="showModalDpto" transition-show="flip-down" transition-hide="flip-up" persistent>
        <q-card class="q-dialog-plugin">
            <q-card-section>
                <q-input v-model="newDpto.dpto" label="Departamento" />
            </q-card-section>
            <!-- buttons example -->
            <q-card-actions align="right">
                <q-btn color="dark" label="Cancelar" v-close-popup />
                <q-btn color="primary" label="Guardar" @click="saveDpto" />
            </q-card-actions>
        </q-card>
    </q-dialog>
    
    <areas :show="addArea" :servicio_id="props.id" :departamento_id="departmentSelected.id" :idArea="idArea" :infoEdit="editAreaData" @closeModal="closeModalEditArea"/>
    <asignar :show="asignarStaff" :area_id="idArea" :service_id="props.id" @closeModal="closeModalAsignar" />
  </template>
  
<script>
import {defineComponent, ref, computed, watch, onMounted, defineProps} from 'vue';
import { useQuasar } from "quasar";
import areas from 'components/admin/servicios/Areas.vue'
import asignar from 'components/admin/servicios/SetPoints.vue'

import { useUsers } from 'src/composables/useUsers.js'
import { useServicios } from 'src/composables/useServicios.js'

export default defineComponent({
    name: "Logística",
    components:{
        areas,
        asignar
    },
    props: ['servicio','id'],
    setup(props) {
        const $q = useQuasar();
        const departmentSelected = ref({id:0,department:''})
        const addArea = ref(false)
        const storeUsers = useUsers()
        const storeServicios = useServicios()
        const { AppActiveUser } = storeUsers
        const { departmentsList, areas, saveDptoDB, getDepartments, serviceItem, 
            getService, getTableA1, getSignatoryList, saveAreaPayload, getDevices
        } = storeServicios

        const permisos = ref([])
        const departamentos = ref([])
        
        const servicio = computed(() =>{
            return props.servicio
        })
        const idArea = ref(null)

        const newDpto = ref({dpto:'', servicio_id: props.id})

        const showModalDpto = ref(false)
        const asignarStaff = ref(false)

        const notify = (msg, type) => {
            $q.notify({
                position:'top',
                type,
                message:msg
            })
        }

        const columns = ref([
            {
            label: 'Id',
            field: 'id',
            sortable:false,
            align:'center'
            },
            {
            label: 'Área',
            field: 'area',
            sortable:false,
            align:'center'
            },
            {
            label: 'Departamento',
            field: 'department',
            sortable:true,
            align:'center'
            },
            {
            label: 'Usuario',
            field: 'usuario',
            name: 'usuario',
            sortable:false,
            align:'center'
            },
            {
            label: 'Fecha',
            name: 'fecha',
            field: 'fecha',
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
        
    
        const saveDpto = async () => {
            if(newDpto.value.dpto !== ''){
                const save = await saveDptoDB(newDpto.value)
                
                if(save.status === 200){
                    notify('Se agregó un nuevo departamento','positive')
                    await getService(props.id)
                    await getDepartments({servicio_id: props.id})
                    newDpto.value = {dpto:'', servicio_id: props.id}
                } else {
                    notify('Error al agregar departamento','negative')
                }
            }
        }
        

        const departamentosList = computed(() => {
            return departmentsList.value
        })

        
        watch(departmentsList,(newVal) => {
            if(newVal != undefined){
                departamentos.value = newVal
            }
        })

        watch(areas,(newVal) => {
            if(newVal != undefined){
                areas.value = newVal
            }
        })

        const openModalArea = () => {
            console.log('entra?')
            if (departmentSelected.value.department === '') {
                notify('Para continuar selecciona un departamento', 'negative')
                return false
            }
            if(!servicio.value.recognition){
                //area sin reconocimiento
                console.log('sin reconocimiento')
                areaSinReconocimiento('crear')
            } else {
                console.log('abre modal completa')
                addArea.value = true
            }   
        }

        const puntosArea = ref([])
        const openAsignar = (row) => {
            idArea.value = row.id
            puntosArea.value = row.puntos
            asignarStaff.value = true
        }

        const areaSinReconocimiento = (action, area) => {
            
            const newVal = ref('')
            const department = ref('')
            if(area != undefined){
                newVal.value = area.area
                department.value = area.department_id
            } else {
                department.value = departmentSelected.value.id
            }
            

            $q.dialog({
                title: action == 'crear'? 'Agregar área':'Editar área',
                message: 'Nombre de área',
                prompt: {
                    model: newVal,
                    type: 'text' // optional
                },
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
                const dataArea = {
                    area:newVal.value, 
                    service_id: props.id,
                    department_id: department.value
                }
                console.log(dataArea, area)
                const guardarData = await saveAreaPayload({
                    data:dataArea, 
                    area_id: area != undefined ? area.id : null, 
                    editName:true
                })
                if (guardarData.status == 200) {
                    notify('Se guardó el área de forma correcta', 'positive')
                    await getDepartments({servicio_id: props.id})

                } else {
                    notify('Por favor contacta con el administrador','negative')
                }
            })
        }

        const editAreaData = ref(null)

        const closeModalEditArea = (e) => {
            // console.log('parent', e)
            addArea.value = e
            editAreaData.value = null
        }

        const closeModalAsignar = (e) => {
            asignarStaff.value = e
        }

        const editArea = (row) => {
            idArea.value = row.id
            if(row.payload != null){
                editAreaData.value = row.payload
                addArea.value = true
            } else {
                areaSinReconocimiento('editar',row)
            // this.nombreArea = row.area
            // this.$bvModal.show('modal-area-no-reconocimiento')
            }
        }

        const deleteArea = (row) => {
            $q.dialog({
                title: '¿Seguro que quieres eliminar esta área?',
                message:`No podrá recuperarse`,
                html: true,
                ok: {
                    push: true,
                    label:'Si, eliminar',
                    color:'red-4'
                },
                cancel: {
                    push: true,
                    color: 'dark',
                    label:'Cancelar'
                },
                persistent: true
                }).onOk(async data => {
                
                const guardarData = await saveAreaPayload({area_id:row.id, delete:true})
                if (guardarData.status === 200) {
                    notify('Se borró el área con éxito','positive')
                    await getDepartments({servicio_id: props.id})
                } else {
                    notify('No se pudo borrar el área', 'negative')
                }      
            })        
        }
        
        
        onMounted(async() => {
            permisos.value = AppActiveUser.value.permissions
            await getDevices()
            await getDepartments({servicio_id: props.id})
            await getSignatoryList()
            // await setSignatory
            await getTableA1()
            
            // console.log('componente logística', permisos)
        })

        return {
            departamentos,
            departmentSelected,
            columns,
            areas,
            departamentosList,
            showModalDpto,
            newDpto,
            addArea,
            props,
            idArea,
            editAreaData,
            asignarStaff,
            puntosArea,
            saveDpto,
            openModalArea,
            openAsignar,
            closeModalEditArea,
            deleteArea,
            editArea,
            closeModalAsignar
        }
    }
})
  </script>
  
  <style scoped>
  
  </style>
  