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
                    <q-btn color="primary" class="q-mr-sm" outline @click="infoPlanta('nuevo')" label="Agregar planta" />
                </div>
                
                <div class="q-pa-sm q-mb-lg">
                    <q-card v-if="dataClient.plantas != undefined">
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
                    <q-card v-if="dataClient.contactos != undefined">
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
            <q-card class="q-dialog-plugin" style="max-width: 1600px; width:1600px;height:150px;min-height: 550px;">
            <q-card-section>
                <q-tabs
                    v-model="tab"
                    dense
                    no-caps
                    inline-label
                    class="bg-primary text-white shadow-2"
                >
                    <q-tab name="planta" icon="factory" label="Planta" />
                    <q-tab name="admin" icon="folder_open" label="Administración" />
                    <!-- <q-tab name="movies" icon="movie" label="Movies" /> -->
                </q-tabs>
            </q-card-section>
            <q-form @submit="addressAdd">
                <q-tab-panels v-model="tab" animated>
                    <q-tab-panel name="planta">
                    
                <q-card-section>
                    <div class="row q-pa-sm">
                        <div class="col-xs-11 col-sm-12 col-md-3">
                            <q-input v-model="address.alias" label="Planta" :rules="[
                                    val => !!val || '* Campo obligatorio',
                                ]"
                            />
                        </div>
                    </div>
                    <div class="row q-pa-sm">
                        <span class="text-title">Domicilio</span>
                    </div>
                    <div class="row">
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
                                label="Municipio"
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
                        <div class="col-xs-11 col-sm-4 q-pa-sm">
                            <q-input v-model="address.phone" label="Teléfono con lada y extensión" />
                        </div>
                    </div>
                </q-card-section>
            
                </q-tab-panel>
                <q-tab-panel name="admin">
                    <q-card-section>
                        
                        <div class="row">Coordenadas</div>
                        <div class="row">
                            <div class="col-xs-12 col-md-2">
                                <q-input bottom-slots class="q-mr-md" label="Latitud norte" v-model="address.latitude_n">
                                    <template v-slot:hint>
                                        (GRADOS, MINUTOS Y SEGUNDOS)
                                    </template>
                                </q-input> 
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input bottom-slots class="q-mr-sm q-mb-md" label="Longitud oeste" v-model="address.length_w">
                                    <template v-slot:hint>
                                        (GRADOS, MINUTOS Y SEGUNDOS)
                                    </template>
                                </q-input> 
                            </div>
                            
                            <div class="col-xs-12 col-md-6 offset-md-2">
                                <div class="row">
                                    <q-input class="q-mr-sm" label="Colindancia Norte" v-model="address.adj_n" />
                                    <q-input class="q-mr-sm" label="Colindancia Sur" v-model="address.adj_s" />
                                    <q-input class="q-mr-sm" label="Colindancia Oeste" v-model="address.adj_w" />
                                    <q-input class="q-mr-sm" label="Colindancia Este" v-model="address.adj_e" />
                                </div>
                            </div>
                        </div>
                        
                        <div class="row q-mt-md">
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.representante" label="Representante legal" />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.date_activity" type="date" label="Fecha inicio actividades" />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.area_m2" label="Superficie m2" />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.construccion_m2" label="Construcción m2" />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" type="text" v-model="areaPlanta" label="Áreas de empresa" @keydown.enter.prevent v-on:keyup.enter="addArea"  />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-select 
                                    class="q-mr-md" 
                                    style="width: 200px;" 
                                    :options="address.areas"
                                    v-model="deletedArea"
                                    label="Áreas"
                                >
                                    <template v-slot:append>
                                        <q-icon name="delete" color="orange" @click="deleteArea" />
                                    </template>
                                </q-select>
                            </div>

                        </div>
                        <div class="row q-mt-md">
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.total_empleados" label="Total empleados" />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.turnos" label="Turnos de trabajo" />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.horarios" label="Horarios" />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.empleados_turno" label="Empleados por turno" />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.desc_proc" label="Descripción del proceso" />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.diagrama" label="Diagrama de flujo" />
                            </div>
                        </div>
                        <div class="row q-mt-md">
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" v-model="address.medidas" label="Medidas de seguridad equipo auditor" />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-input class="q-mr-md" type="text" v-model="equipoSeguridad" label="Equipo seguridad" @keydown.enter.prevent v-on:keyup.enter="addEquipo"  />
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <q-select 
                                    class="q-mr-md" 
                                    style="width: 200px;" 
                                    :options="address.equipoSeguridad"
                                    v-model="deletedEquipo"
                                    label="Lista equipo"
                                >
                                    <template v-slot:append>
                                        <q-icon name="delete" color="orange" @click="deleteEquipo" />
                                    </template>
                                </q-select>
                            </div>
                        </div>
                        <div class="row q-mt-lg">
                            <q-toggle class="q-mr-sm" color="primary" v-model="address.acta" label="Acta constitutiva" />
                            <q-toggle class="q-mr-sm" color="primary" v-model="address.notarial" label="Poder notarial" />
                        </div>
                        <div class="row q-mt-md">Copias INE:</div>
                        <div class="row">
                            
                            <q-toggle class="q-mr-sm" color="primary" v-model="address.copias.representate" label="Representante legal" />
                            <q-toggle class="q-mr-sm" color="primary" v-model="address.copias.persona" label="Personal atiende visita" />
                            <q-toggle class="q-mr-sm" color="primary" v-model="address.copias.testigo1" label="Testigo 1" />
                            <q-toggle class="q-mr-sm" color="primary" v-model="address.copias.testigo2" label="Testigo 2" />
                        </div>
                    </q-card-section>
                </q-tab-panel>
            </q-tab-panels>
            

            <q-card-actions align="right" class="q-pa-md">
                <q-btn color="primary" label="Cancelar" v-close-popup />
                <q-btn color="primary" label="Guardar" type="submit" />
            </q-card-actions>
            </q-form>
            </q-card>
        </q-dialog>

        <q-dialog v-model="addContact" ref="contacto" transition-show="flip-down" transition-hide="flip-up" persistent>
            <q-card class="q-dialog-plugin" style="max-width: 1500px;width:1000px;height:150px;min-height: 370px;">
            <q-form @submit.prevent="saveContact">
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
                </q-card-section>
            
                <q-card-actions class="q-pa-lg justify-end">
                    <q-btn color="primary" label="Cancelar" v-close-popup />
                    <q-btn color="primary" label="Guardar" type="submit" />
                </q-card-actions>
            </q-form>
            </q-card>    
        </q-dialog>

        
    </q-page>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";
import { useClientes } from "src/composables/useClientes"; 
import { useQuasar } from "quasar";

const $q = useQuasar()
const $router = useRoute()
const {getCities, getStates, fetchClient, newAddress,
    updateClient, editClient, clientesPrincipales, cities, states, createContact, getClients
} = useClientes()

const cliente = computed(() => {
    return editClient
})

const estados = ref([])
const ciudades = ref([])
const clientes = ref([])

const isMain = ref(true)

const stateSelected = ref(null);
const citySelected = ref(null);
const addPlanta = ref(false);

const address = ref({areas:[], equipoSeguridad:[], acta:false, notarial:false, copias:{representate:false, persona:false, testigo1:false, testigo2:false} })

const addContact = ref(false)
const disableFactory = ref(false)
const dataClient = ref({plantas:[]})
const contact = ref({})
const statusClient = ref(false)
const tab = ref('planta')
const areaPlanta = ref('')
const deletedArea = ref('')
const equipoSeguridad = ref('')
const deletedEquipo = ref('')

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
// TODO revisar flujo
// const setModel = async (val) => {
//     await getMainClient({cliente:val})
//     clienteSelected.value = val
//     console.log(clienteSelected)
// }

watch(stateSelected, async (val) =>{
    if(!disableFactory.value){
        citySelected.value = null
    }
    if(val != null) await getCities(val.id)
    
    console.log('ciudades_a', ciudades.value)
    console.log('city selected', citySelected.value)
})


// const filterFn = (val, update, abort) => {
//     update(() => {
//         const needle = val.toLocaleLowerCase()
//         clientes.value = clientesPrincipales.value
//         console.log(clientesPrincipales)
//     })
// }

const filterState = (val, update) => {
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

const filterCity = (val, update) => {
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

const getData = async () => {
    dataClient.value = editClient.value

    if(editClient.value.payload != null){
        address.value = JSON.parse(editClient.value.payload)
    }

    isMain.value = editClient.value.client_id == null
    
    statusClient.value = dataClient.value.status == 1? true :false
}

const addressAdd = () => {

    $q.dialog({
        title: disableFactory.value ? '¿Deseas modificar esta información?' : 'Agregar planta',
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
    }).onOk(async () => {
        // address.value.client_id = factory.value.id
        address.value.city_id = citySelected.value.id
        address.value.client_id = $router.params.id
        
        const guardar = await newAddress(address.value)

        if (guardar.status == 200){
            disableFactory.value = false
            
            await getData()
            $q.notify({
                position:'top',
                type: 'positive',
                message: 'Se guardó la información correctamente'
            })
        
        } else {
            $q.notify({
                position:'top',
                type: 'negative',
                message:`Hubo un error al guardar la información`
            })
        }
        // address.value = {}
        // citySelected.value = {}
        // stateSelected.value = {}
        // factory.value = null
    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
    })
}

const infoPlanta = (type) => {
    if(type == 'nuevo'){
        address.value = {areas:[], equipoSeguridad:[], acta:false, notarial:false, copias:{representate:false, persona:false, testigo1:false, testigo2:false} }
        citySelected.value = null
        stateSelected.value = null
    } else {
        console.log('info_edita', address.value)
    }

    addPlanta.value = true
}



const editAddress = (row) => {
    //asigno información del row al objeto para editar
    address.value = row
    infoPlanta('editar')
    addPlanta.value = true
    disableFactory.value = true
    

    if(address.value.payload == null){
        address.value.areas=[] 
        address.value.equipoSeguridad=[]
        address.value.acta=false, 
        address.value.notarial=false, 
        address.value.copias={representate:false, persona:false, testigo1:false, testigo2:false}
    } else {
        let data = JSON.parse(address.value.payload)
        let ids = {client_id: address.value.client_id, id:address.value.id, address_id: address.value.address_id}
        address.value = data
        address.value.client_id = ids.client_id
        address.value.id = ids.id
        address.value.address_id = ids.address_id
    }
    

    citySelected.value = {id:row.cityid, ciudad:row.citydsc, city_id:row.cityid}
    stateSelected.value = {id:row.stateid, estado: row.statedsc}
}

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
    }).onOk(async () => {
        
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
        }

    })
}

const editContact = (row) => {
    contact.value = row
    addContact.value = true
}

watch(addContact, () => {
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
    }).onOk(async () => {
        
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

const addArea = () => {
    address.value.areas.push(areaPlanta.value)
    areaPlanta.value = ''
}

const deleteArea = () => {
    address.value.areas = address.value.areas.filter(item => item !== deletedArea.value)
}

const addEquipo = () => {
    console.log(address.value, equipoSeguridad.value)
    address.value.equipoSeguridad.push(equipoSeguridad.value)
    equipoSeguridad.value = ''
}

const deleteEquipo = () => {
    address.value.equipoSeguridad = address.value.equipoSeguridad.filter(item => item !== deletedEquipo.value)
}

onMounted(async () => {
    await getCities()
    await getStates()
    estados.value = states.value
    if($router.params.id){
        await fetchClient($router.params.id)
        await getData()
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