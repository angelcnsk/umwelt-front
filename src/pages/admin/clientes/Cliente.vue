<template>
    <q-page class="q-pa-sm">
        <div class="q-pa-md q-gutter-sm">
            <q-breadcrumbs>
                <q-breadcrumbs-el icon="home" :to="{name:'index-admin'}" />
                <q-breadcrumbs-el label="Clientes" icon="domain" :to="{name:'clientes'}" />
                <q-breadcrumbs-el label="Cliente" icon="domain" />
                
            </q-breadcrumbs>
        </div>
        <q-card>
            <q-card-section>
                <q-separator class="q-ml-sm q-mr-sm separador" />
                    <span class="text-h6 q-ml-sm">
                        Cliente
                    </span>
                <q-separator class="q-mb-lg q-ml-sm q-mr-sm separador" />
                <div class="row q-mb-lg">
                    
                    <!-- <div class="col-md-4 col-md-xs-4 q-pa-sm">
                        <q-toggle v-model="isMain" val="calories" label="Cliente principal" />
                    </div>
                    <div class="col-xs-11 col-sm-4 q-pa-sm" v-if="!isMain">
                        <q-select
                            :model-value="clienteSelected"
                            hide-selected
                            fill-input
                            use-input
                            input-debounce="500"
                            :options="clientes"
                            @filter="filterFn"
                            @input-value="setModel"
                            emit-value
                            label="Cliente principal"
                        >
                            <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                Sin resultados
                                </q-item-section>
                            </q-item>
                            </template>
                    </q-select>
                    </div> -->
                    
                    <div class="col-xs-11 col-sm-4 q-pa-sm">
                        <q-input 
                            v-model="dataClient.legalname"
                            label="Razón social"
                        />
                    </div>
                    <div class="col-xs-11 col-sm-4 q-pa-sm">
                        <q-input
                            v-model="dataClient.rfc"
                            maxlength="13"
                            :rules="[
                                val => !!val || '* Campo obligatorio',
                            ]"
                            label="RFC"
                        />
                    </div>
                    <!-- <div class="col-xs-11 col-sm-4 q-pa-sm">
                        <q-input 
                            v-model="dataClient.business_description"
                            label="Descripción giro comercial"
                        />
                    </div> -->
                    <div class="col-xs-11 col-sm-4 q-pa-sm">
                        <q-toggle color="primary" v-model="statusClient" :val="statusClient" label="Estatus cliente" />
                    </div>
                </div>
                <div class="row q-pl-sm">
                    <q-btn label="Guardar" color="primary" @click="updateRFC" />
                </div>
                <q-separator class="q-ml-sm q-mr-sm q-mt-md separador" />
                <span class="text-h6 q-ml-sm">
                    Plantas
                </span>
                <q-separator class="q-mb-lg q-mr-sm q-ml-sm separador" />
                <div class="row q-mb-lg q-pa-sm">
                    <q-btn color="primary" class="q-mr-sm" outline @click="addPlanta = true" label="Agregar planta" />
                    <q-btn color="primary" class="q-ml-sm" outline @click="addAddress = true" label="Agregar dirección" />
                </div>
                
                <div class="q-pa-sm q-mb-lg">
                    <q-card>
                        <q-table :rows="dataClient.plantas" :columns="addressColumn">
                            <template v-slot:body-cell-acciones="props">
                                <q-td :props="props" class="text-center">
                                    <q-btn color="warning" v-if="props.row.address_id != null" outline label="editar" @click="editAddress(props.row)" >
                                        <q-tooltip anchor="center left" self="center left" :offset="[10, 10]"> Editar dirección </q-tooltip>
                                    </q-btn>
                                </q-td>
                            </template>
                        </q-table> 
                    </q-card>                    
                </div>
                <q-separator class="q-ml-sm q-mr-sm separador" />
                <span class="text-h6 q-ml-sm">
                    Contactos
                </span>
                <q-separator class="q-mb-lg q-mr-sm q-ml-sm separador" />

                <div class="row q-mb-lg q-pa-sm">
                    <q-btn color="primary" class="q-mr-sm" outline @click="addContact = true" label="Agregar contacto" />
                </div>
                <div class="q-pa-sm q-mb-lg">
                    <q-card>
                        <q-table :rows="dataClient.contactos" :columns="contactColumns">
                            <template v-slot:body-cell-acciones="props">
                                <q-td :props="props" class="text-center">
                                    <q-btn color="warning" v-if="props.row.contact_id != null" outline label="editar" @click="editContact(props.row)" >
                                        <q-tooltip anchor="center left" self="center left" :offset="[10, 10]"> Editar contacto </q-tooltip>
                                    </q-btn>
                                </q-td>
                            </template>
                        </q-table> 
                    </q-card>                    
                </div>
            </q-card-section>
        </q-card>
        <q-dialog v-model="addPlanta" ref="planta" transition-show="flip-down" transition-hide="flip-up" persistent>
            <q-card class="q-dialog-plugin">
                <q-card-section>
                    <q-input v-model="plantaName" label="Planta" />
                </q-card-section>
            <!-- buttons example -->
            <q-card-actions align="right">
                <q-btn color="primary" label="Cancelar" v-close-popup />
                <q-btn color="primary" label="Guardar" @click="plantaAdd" />
            </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="addContact" ref="contacto" transition-show="flip-down" transition-hide="flip-up" persistent>
            <q-card class="q-dialog-plugin" style="max-width: 1500px;width:1000px;height:150px;min-height: 370px;">
            <q-form @submit="saveContact">
                <q-card-section>
                    <q-separator class="q-ml-sm q-mr-sm separador" />
                    <span class="text-h6 q-ml-sm">
                        Contacto
                    </span>
                <q-separator class="q-mb-sm q-ml-sm q-mr-sm separador" />
                    <div class="row q-mb-lg">
                        <div class="col-xs-12 col-sm-4 q-pa-sm">
                            <q-select 
                                :options="dataClient.plantas" 
                                option-label="alias"
                                v-model="contact.planta" 
                                label="Planta" 
                                emit-value
                                :rules="[
                                    val => !!val || '* Campo obligatorio',
                                ]"
                            />
                        </div>
                        <div class="col-xs-12 col-md-4 q-pa-sm">
                            <q-input 
                                v-model="contact.contact_name" 
                                label="Nombre contacto"
                                :rules="[
                                    val => !!val || '* Campo obligatorio',
                                ]"
                            />
                        </div>
                        <div class="col-xs-12 col-md-4 q-pa-sm">
                            <q-input 
                                v-model="contact.contact_position" 
                                label="Cargo contacto" 
                                :rules="[
                                    val => !!val || '* Campo obligatorio',
                                ]"
                            />
                        </div>
                        <div class="col-xs-12 col-md-4 q-pa-sm">
                            <q-input 
                                v-model="contact.contact_phone" 
                                label="Teléfono contacto"
                                mask="##-##-##-##-##"
                                :rules="[
                                    val => !!val || '* Campo obligatorio',
                                ]"
                            />
                        </div>
                        <div class="col-xs-12 col-md-4 q-pa-sm">
                            <q-input v-model="contact.contact_ext" label="Extensión" />
                        </div>
                        <div class="col-xs-12 col-md-4 q-pa-sm">
                            <q-input v-model="contact.contact_movil" mask="##-##-##-##-##" label="Movil" />
                        </div>
                        <div class="col-xs-12 col-md-4 q-pa-sm">
                            <q-input 
                                v-model="contact.contact_mail" 
                                label="E-mail" 
                                type="email"
                            />
                        </div>
                    </div>
                    <div class="row q-mb-lg">
                        
                    </div>
                        
                    
                </q-card-section>
            
                <q-card-actions class="q-pa-lg justify-end">
                    <q-btn color="primary" label="Cancelar" v-close-popup />
                    <q-btn color="primary" label="Guardar" type="submit" />
                </q-card-actions>
            </q-form>
            </q-card>
            
        </q-dialog>

        <q-dialog v-model="addAddress" ref="domicilio" persistent>
            <q-card class="q-dialog-plugin">
                <q-form @submit="addressAdd">
                <q-card-section>
                    <div class="q-mb-lg">
                        <div class="col-xs-11 col-sm-4 q-pa-sm">
                            <q-select 
                                :options="dataClient.plantas" 
                                option-label="alias"
                                v-model="factory" 
                                label="Planta" 
                                emit-value
                                :disable="disableFactory"
                                :rules="[
                                    val => !!val || '* Campo obligatorio',
                                ]"
                            />
                        </div>
                        <div class="col-xs-11 col-sm-4 q-pa-sm">
                            <q-input 
                                v-model="address.street"
                                label="Calle"
                                :rules="[
                                    val => !!val || '* Campo obligatorio',
                                ]"
                            />
                        </div>
                        <div class="col-xs-11 col-sm-4 q-pa-sm">
                            <q-input
                                v-model="address.number"
                                label="Número"
                            />
                        </div>
                        <div class="col-xs-11 col-sm-4 q-pa-sm">
                            <q-input 
                                v-model="address.apartment_number"
                                label="Número interior"
                            />
                        </div>
                        <div class="col-xs-11 col-sm-4 q-pa-sm">
                            <q-input 
                                maxlength="5"
                                v-model="address.zipcode"
                                label="Código postal"
                                :rules="[
                                    val => !!val || '* Campo obligatorio',
                                ]"
                            />
                        </div>
                        <div class="col-xs-11 col-sm-4 q-pa-sm">
                            <q-input 
                                v-model="address.neighborhood"
                                label="Colonia"
                                :rules="[
                                    val => !!val || '* Campo obligatorio',
                                ]"
                            />
                        </div>
                        <div class="col-xs-11 col-sm-4 q-pa-sm">
                        <q-select
                            :model-value="stateSelected"
                            v-model="stateSelected"
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="0"
                            label="Estado"
                            :options="estados"
                            option-label="estado"
                            option-value="id"
                            @filter="filterState"
                            :rules="[
                                val => !!val || '* Campo obligatorio',
                            ]"
                        >
                            <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                No results
                                </q-item-section>
                            </q-item>
                            </template>
                        </q-select>
                    </div>
                    <div class="col-xs-11 col-sm-4 q-pa-sm">
                        <q-select
                            :model-value="citySelected"
                            v-model="citySelected"
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="0"
                            label="Ciudad"
                            :options="ciudades"
                            option-label="ciudad"
                            option-value="id"
                            @filter="filterCity"
                            :rules="[
                                val => !!val || '* Campo obligatorio',
                            ]"
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
                    <div class="col-xs-11 col-sm-4 q-pa-sm">
                        <q-input 
                            v-model="address.business_description"
                            label="Descripción giro comercial"
                        />
                    </div>
                    </div>
                </q-card-section>
            <!-- buttons example -->
            <q-card-actions align="right">
                <q-btn color="primary" label="Cancelar" v-close-popup />
                <q-btn color="primary" label="Guardar" type="submit" />
            </q-card-actions>
            </q-form>    
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { ref, onMounted, defineComponent, computed, watch } from "vue";
import { useClientes } from "src/composables/useClientes"; 
import { useDialogPluginComponent, useQuasar } from "quasar";

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
].reduce((acc, opt) => {
  for (let i = 1; i <= 5; i++) {
    acc.push(opt + ' ' + i)
  }
  return acc
}, [])

export default defineComponent({
    name: 'clientePage',
    // components: {
    //   CardSocial: defineAsyncComponent(() => import('components/cards/CardSocial.vue')),
    // },
    setup() {
        const $q = useQuasar()
        const $router = useRoute()
        const {getCities, getStates, fetchClient, getMainClient, addFactory,newAddress,
            updateClient, editClient, clientesPrincipales, cities, states, createContact
        } = useClientes()

        const {  dialogRef, onDialogHide, onDialogOK, onDialogCancel  } = useDialogPluginComponent()

        const cliente = computed(() => {
            return editClient
        })

        const estados = ref([])
        const ciudades = ref([])
        const clientes = ref([])

        const isMain = ref(true)

        const clienteSelected = ref(null)
        const stateSelected = ref(null)
        const citySelected = ref(null)
        const addPlanta = ref(false)
        const addAddress = ref(false)
        const plantaName = ref('')
        const address = ref({})
        const factory = ref(null)
        const addContact = ref(false)
        const disableFactory = ref(false)
        const dataClient = ref({plantas:[]})
        const contact = ref({})
        const statusClient = ref(false)

        const addressColumn = [
            {name: 'id', label: 'Id',field: 'id', align:'center'},
            {name: 'alias', label: 'Planta', field: 'alias', align:'center', sortable:true, sortOrder:'ad'},
            {name: 'domicilio', label: 'Domicilio', field: 'domicilio', align:'center'},
            {name:'acciones' ,label:'Acciones',  align:'left'}
        ]

        const contactColumns = [
            {name: 'id', label: 'Id',field: 'contact_id', align:'center'},
            {name: 'name', label: 'Nombre', field: 'contact_name', align:'center', sortable:true, sortOrder:'ad'},
            {name: 'location', label: 'Planta', field: 'planta', align:'center'},
            {name: 'position', label: 'Cargo', field: 'contact_position', align:'center'},
            {name: 'phone', label: 'Teléfono', field: 'contact_phone', align:'center'},
            {name: 'extension', label: 'Extensión', field: 'contact_ext', align:'center'},
            {name: 'movil', label: 'Movil', field: 'contact_movil', align:'center'},
            {name: 'mail', label: 'E-mail', field: 'contact_mail', align:'center'},
            {name:'acciones' ,label:'Acciones',  align:'left'}
        ]

        watch(clientesPrincipales, (newVal) => {
            clientes.value = newVal
        })

        watch(cliente, (newVal) => {
            dataClient.value = newVal
        })

        const setModel = async (val) => {
            await getMainClient({cliente:val})
            clienteSelected.value = val
            console.log(clienteSelected)
        }

        watch(stateSelected, async (val) =>{
            if(!disableFactory.value){
                citySelected.value = null
            }
            if(val != null) await getCities(val.id)
            
            console.log('ciudades_a', ciudades.value)
            console.log('city selected', citySelected.value)
        })

        
        const filterFn = (val, update, abort) => {
            update(() => {
                const needle = val.toLocaleLowerCase()
                clientes.value = clientesPrincipales.value
                console.log(clientesPrincipales)
            })
        }

        const filterState = (val, update, abort) => {
            console.log(val)
            update(
            () => {
              if (val === '') {
                estados.value = states.value
              }
              else {
                const needle = val.toLowerCase()
                estados.value = states.value.filter(v => v.estado.toLowerCase().indexOf(needle) > -1)
              }
            },
          )
        }

        const filterCity = (val, update, abort) => {
            update(() => {
                if (val === '') {
                    ciudades.value = cities.value
                }
                else {
                    const needle = val.toLowerCase()
                    ciudades.value = cities.value.filter(v => v.ciudad.toLowerCase().indexOf(needle) > -1)
                }
                // const needle = val.toLocaleLowerCase()
                // ciudades.value = cities.value
            })
        }

        const searchClient = async (val, update, abort) => {
            await getMainClient({cliente:clienteSelected.value})
        }

        
        
        const plantaAdd = async () => {
            if(plantaName.value != ''){
                const agregaPlanta = await addFactory({alias:plantaName.value, client_id: dataClient.value.id})
                if(agregaPlanta.status == 200){
                    plantaName.value = ''

                    $q.notify({
                        position:'top',
                        type: 'positive',
                        message: `Se agregó una nueva planta`
                    })
                    await getData()
                }
                
            }
        }

        const getData = async () => {
            await fetchClient($router.params.id)
            dataClient.value = editClient.value
            isMain.value = editClient.value.client_id == null
            
            statusClient.value = dataClient.value.status == 1? true :false
        }

        const addressAdd = () => {

            $q.dialog({
                title: disableFactory.value ? '¿Deseas modificar esta dirección?' : 'Agregar dirección',
                message: 'Se guardarán los datos ingresados',
                // prompt: {
                //   model: password,
                //   isValid: val => val.length > 5,
                //   type: 'password' // optional
                // },
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
                
                address.value.client_id = factory.value.id
                address.value.city_id = citySelected.value.id
                
                const guardar = await newAddress(address.value)

                if (guardar.status == 200){
                await getData()
                $q.notify({
                    position:'top',
                    type: 'positive',
                    message: disableFactory.value? `Se modificó la dirección` :  `Se agregó una nueva dirección`
                })
                
                } else {
                    $q.notify({
                        position:'top',
                        type: 'negative',
                        message:`Hubo un error al guardar la dirección`
                    })
                }

                disableFactory.value = false
                address.value = {}
                citySelected.value = {}
                stateSelected.value = {}
                factory.value = null
                addAddress.value = false

            }).onCancel(() => {
                // console.log('>>>> Cancel')
            }).onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
            })
        }
        
        

        const editAddress = (row) => {
            factory.value = row.alias
            addAddress.value = true
            disableFactory.value = true
            address.value = row
            citySelected.value = {id:row.cityid, ciudad:row.citydsc, city_id:row.cityid}
            stateSelected.value = {id:row.stateid, estado: row.statedsc}
        }

        watch(addAddress, (newVal) => {
            if(!addAddress.value){
                disableFactory.value = false
                address.value = {}
                citySelected.value = null
                stateSelected.value = null
                factory.value = null
                addAddress.value = false
            }
        })

        const updateRFC = async () => {
            $q.dialog({
                title: '¿Deseas modificar la información del cliente?',
                message: 'Se guardarán los datos ingresados',
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
                
                const crearCliente = await updateClient({
                    id:dataClient.value.id,
                    legalname:dataClient.value.legalname,
                    business_description: dataClient.value.business_description,
                    rfc: dataClient.value.rfc,
                    status:statusClient.value
                })
            
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
                        message:'El cliente se actualizó correctamente'
                    })
                    getClients()
                    newClient.value = {}
                }

            })
        }

        const editContact = (row) => {
            contact.value = row
            addContact.value = true
        }

        watch(addContact, (newVal) => {
            if(!addContact.value){
                contact.value = {}
            }
            console.log(contact.value)
        })

        const saveContact = async () => {
            $q.dialog({
                title: '¿Deseas continuar?',
                message: 'Se guardarán los datos ingresados',
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
                
                contact.value.client_id = dataClient.value.id
                const crearContacto = await createContact(contact.value)

                if(crearContacto.status == 200){
                    $q.notify({
                        position:'top',
                        type:'positive',
                        message:'El cliente se actualizó correctamente'
                    })
                        
                } else {
                    $q.notify({
                        position:'top',
                        type:'negative',
                        message:'Error al crear contacto'
                    })
                    return false;
                }
                addContact.value = false
                contact.value = {}
                await getData()

            })
            
        }

        onMounted(async () => {
            await getCities()
            await getStates()
            estados.value = states.value
            if($router.params.id){
                await getData()
            }
        })

        return {
            dataClient,
            clienteSelected,
            clientes,
            citySelected,
            stateSelected,
            isMain,
            ciudades,
            estados,
            addPlanta,
            plantaName,
            addAddress,
            address,
            factory,
            addressColumn,
            disableFactory,
            addContact,
            contact,
            contactColumns,
            statusClient,
            setModel,
            searchClient,
            filterFn,
            filterState,
            filterCity,
            plantaAdd,
            addressAdd,
            editAddress,
            updateRFC,
            saveContact,
            editContact
        }
    }
})
</script>

<style>
/* @media screen and (min-width: 600px) {
  .separador{
    width:95% ;
  }
}

@media screen and (min-width: 1020px) {
  .separador{
    width:98% ;
  }
} */
</style>