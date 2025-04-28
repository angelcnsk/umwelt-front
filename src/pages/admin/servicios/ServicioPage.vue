<template>
<q-page class="q-pa-sm">
    <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" :to="{name:'index-admin'}" />
            <q-breadcrumbs-el label="Servicios" icon="folder" :to="{name:'servicios'}" />
            <q-breadcrumbs-el label="Servicio" icon="file_open" />        
        </q-breadcrumbs>
    </div>
    <div class="q-pa-md" :class="$q.dark.isActive ? 'q-dark' : 'q-light'">
        <q-card rounded class="q-mb-md">
            <q-card-section>
                <div class="col">
                    <span class="text-h6 q-ml-sm block"> Cliente: {{servicio.cliente}}</span>
                    <span class="text-subtitle1 q-ml-sm block"> Planta: {{servicio.planta}}</span>
                    <span class="text-subtitle1 q-ml-sm block"> Producto: {{servicio.producto}}</span>
                </div>
                <div class="row q-mt-md q-mb-md q-ma-sm">
                    <div class="col-lg-4 col-md-4 col-sm-12">
                        <span class="label block q-mb-sm">Estatus:</span>
                        <q-badge 
                            outline 
                            :color="servicio.status === 'abierto' ? 'primary' : 'grey-9'"  
                            class="uppercase"
                            :label="servicio.status"
                        />
                    </div>
                    <div class="col-md-2 col-xs-12">
                        <q-input label="Registro STPS" v-model="servicio.reg_stps">
                            <template v-slot:after>
                                <q-btn round dense flat color="primary" icon="check" @click="update" />
                            </template>
                        </q-input>
                    </div>
                    <div class="col-md-3 col-xs-12">
                        <q-input class="q-ml-lg" label="Número de dictamen" v-model="servicio.folio">
                            <template v-slot:after>
                                <q-btn round dense flat color="primary" icon="check" @click="generarFolio" />
                            </template>
                        </q-input>
                    </div>
                    
                </div>
                <div class="row q-mt-md q-mb-lg q-ma-sm">
                    <div class="col-md-3 col-sm-12">
                        <span class="label">Solicitante</span><br>
                        <q-avatar class="q-mr-sm q-mt-sm" size="30px">
                            <img v-if="servicio.requester_avatar != null" :src="servicio.requester_avatar">
                            <img v-else :src="incognit">
                        </q-avatar>
                        <span class="user-name-label">{{servicio.requester}}</span>
                    </div>
                    <div class="col-md-3 col-sm-12">
                        <span class="label q-mt-sm">Responsable</span><br>
                        <q-avatar class="q-mr-sm q-mt-sm" size="30px">
                            <img v-if="servicio.owner_avatar != null" :src="servicio.owner_avatar">
                            <img v-else :src="incognit">
                        </q-avatar>
                        <span class="user-name-label">{{servicio.owner}}</span>
                    </div>
                    <div class="col-md-3 col-sm-12">
                        <span class="label q-mt-sm">Fecha creación</span><br>
                        <q-badge outline color="grey-7" :label="servicio.create_date" class="q-mt-md" />    
                    </div>
                    <!-- <div class="col-md-3 col-sm-12">
                        <span class="label q-mt-sm">Número dictamen</span><br>
                        <q-badge outline color="grey-7" :label="servicio.folio" class="q-mt-md" />
                    </div> -->
                </div>
            </q-card-section>
    </q-card>
</div>
<!-- <logistica :servicio="servicio" :id="$route.params.id" /> -->
<gestion :servicio_id="$route.params.id" />

</q-page>
</template>


<script setup>
import {computed, onMounted, watch, ref, inject, provide, watchEffect} from 'vue'
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";

import { useUsers } from 'src/composables/useUsers.js'
import { useServicios } from 'src/composables/useServicios.js'

import gestion from 'src/components/admin/servicios/GestionComponent.vue'

const storeUsers = useUsers();
const storeServicios = useServicios();
const $q = useQuasar();
const $router = useRoute()

const { AppActiveUser } = storeUsers
const { serviceItem, getService,closeServiceStatus, generarNumDictamen } = storeServicios

const generar_ot = ref(false)
const incognit = inject('incognit')

const notify = (msg, type) => {
    $q.notify({
        position:'top',
        type,
        message:msg
    })
}

const servicio = computed(() => {
    return serviceItem.value
})

provide('servicio', serviceItem)

// const setTime = async () => {
//     // fecha_reconocimiento.value = servicio.value.recognition_date.split('-')
//     fecha_inicio.value = servicio.value.start_date.split('-')
//     fecha_fin.value = servicio.value.end_date.split('-')

//     // fecha1.value = date.formatDate(new Date(fecha_reconocimiento.value[0], fecha_reconocimiento.value[1]-1, fecha_reconocimiento.value[2]), 'YYYY/MM/DD')
//     fecha2.value = date.formatDate(new Date(fecha_inicio.value[0], fecha_inicio.value[1]-1, fecha_inicio.value[2]), 'YYYY/MM/DD')
//     fecha3.value = date.formatDate(new Date(fecha_fin.value[0], fecha_fin.value[1]-1, fecha_fin.value[2]), 'YYYY/MM/DD')
// }

const permisos = ref([]);

watchEffect(async () => {
  permisos.value = await obtenerPermisos();
});

async function obtenerPermisos() {
  return AppActiveUser.value.permissions;
}

watch(permisos, (newVal) => {
    if(newVal != undefined){
        const permisos = newVal
        generar_ot.value = permisos.find((permiso) => permiso === 'generar_num_dictamen')
    }
    
})

const update = async () => {
    
    $q.dialog({
        title: '¿Estás seguro?',
        message: 'Se guardará el registro STPS ingresado',
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
    }).onOk(async () => {
        const registro = await closeServiceStatus({servicio_id: servicio.value.id, reg_stps:servicio.value.reg_stps})

        if(registro.status == 200) notify('Se guardo el registro correctamente','positive')
        else notify('Por favor contacta al administrador','negative')
    })   
}

const generarFolio = () => {
    $q.dialog({
            title: '¿Estás seguro?',
            message: 'Se asingará un número de dictamen al servicio',
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
            }).onOk(async () => {

            const getfolio = await generarNumDictamen({servicio_id:servicio.value.id, generar_folio:true, folio:servicio.value.folio})
            if(getfolio.status == 200){
                notify('Se asignó número de dictamen', 'positive')
            } else {
                notify('Por favor contácta al administrador', 'negative')
            }
                            
        }).onCancel(() => {
            // console.log('>>>> Cancel')
        }).onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
        })   
}

onMounted(async () => {
    permisos.value = AppActiveUser.value.permissions
    // await getStaff()
    await getService($router.params.id)
})


</script>

<style lang="scss">
.uppercase{
  text-transform:uppercase;
}

.label{
  font-weight: 500;
}

.user-name-label{
  vertical-align: bottom;
}

.cardWidth{
  width: 450px;
}
.blockMargin{
  border:solid 1px orangered;
}
.btn-lg > svg{
  width: 25px;
  height: 25px;
}
.mark-staff > span.b-avatar-img{
  border: 3px solid #07dca1;
  // height: 2px;
  // width: 55%;
  // margin:0 25% ;
}
.lastCard{
  margin-bottom: 40px;
  padding-bottom: 40px;
}
</style>