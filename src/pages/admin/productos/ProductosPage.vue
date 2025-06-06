<template>
    <q-page class="q-pa-sm">
        <div class="row q-pa-sm" >
            <div class="col-md-12">
                <q-btn v-if="agregar_producto" @click="addProduct = !addProduct" color="primary" glossy text-color="white" icon="add_task">
                    <q-tooltip anchor="center right" self="center left" :offset="[10, 10]"> Nuevo producto </q-tooltip>
                </q-btn>
            </div>
        </div>

        <div class="row q-mt-lg q-pa-sm" v-if="addProduct">
            <div class="col-xs-12">
                <q-card rounded>
                    <q-card-section>
                        <div class="row">
                            <span class="text-h5">
                                Generar nueva orden de servicio
                            </span>
                        </div>
                        <div class="row">
                            <div class="col-md-3 col-xs-12 q-pa-sm">
                                <q-select 
                                    :options="productos" 
                                    option-label="producto"
                                    v-model="service.producto" 
                                    label="Producto" 
                                    emit-value
                                    :rules="[
                                        val => !!val || '* Campo obligatorio',
                                    ]"
                                />

                                
                            </div>
                            <div class="col-md-3 col-xs-12 q-pa-sm">
                                <q-select
                                    v-model="service.client" 
                                    :model-value="service.client"
                                    hide-selected
                                    fill-input
                                    use-input
                                    input-debounce="0"
                                    :options="clientes"
                                    option-label="legalname"
                                    @filter="filterFn"
                                    
                                    emit-value
                                    label="Cliente"
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
                            <div class="col-md-3 col-xs-12 q-pa-sm">
                                <q-select
                                    v-model="service.planta" 
                                    :model-value="service.planta"
                                    hide-selected
                                    fill-input
                                    use-input
                                    input-debounce="0"
                                    :options="plantas"
                                    option-label="alias"
                                    @filter="filterPlanta"
                                    emit-value
                                    label="Sucursal"
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
                            <div class="col-md-3 col-xs-12 q-pa-sm">
                                <q-select
                                    v-model="service.owner" 
                                    :model-value="service.owner"
                                    hide-selected
                                    fill-input
                                    use-input
                                    input-debounce="0"
                                    :options="owners"
                                    option-label="label"
                                    @filter="filterStaff"
                                    
                                    label="Responsable"
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
                            <div class="col-md-3 q-pa-sm">
                                <q-toggle label="Acepta reconocimiento" v-model="service.recognition" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4 col-xs-12 q-pa-sm">
                                <q-input 
                                    filled 
                                    v-model="service.date_recognition" 
                                    mask="date" 
                                    label="Inicio de reconocimiento"
                                    :readonly="!service.recognition"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="service.date_recognition" :readonly="!service.recognition">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                            </q-date>
                                        </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-md-4 col-xs-12 q-pa-sm">
                                <q-input filled v-model="service.date_start" mask="date" :rules="['date']" label="Inicio de ejecución">
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="service.date_start">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                            </q-date>
                                        </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-md-4 col-xs-12 q-pa-sm">
                                <q-input filled v-model="service.date_end" mask="date" :rules="['date']" label="Fin de ejecución">
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="service.date_end">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                            </q-date>
                                        </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                        </div>
                        <div class="row justify-end q-mr-sm">
                            <q-btn label="guardar" color="primary" @click="saveService" />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        
        <div class="row q-mt-lg">
            <div class="col-xs-12">
                <div class="q-pa-sm">
                    <q-card rounded>
                        
                    </q-card>
                </div>
            </div>
        </div>
        
        
    </q-page>
</template>
  
<script setup>
  //seguir el mismo ejemplo para crear todo como componente
import {onMounted, watch, ref, watchEffect} from 'vue'

import { useUsers } from 'src/composables/useUsers.js'
import { useServicios } from 'src/composables/useServicios.js'

const storeUsers = useUsers();
const storeServicios = useServicios();
const { AppActiveUser } = storeUsers;

const { productos, getProductos } = storeServicios;
const agregar_producto = ref(false);

const addProduct = ref(false);
const permisos = ref([]);

watchEffect(async () => {
  permisos.value = await obtenerPermisos();
});

async function obtenerPermisos() {
  return AppActiveUser.value.permissions;
}

watch(permisos, async (newVal) => {
    const find = await newVal
    agregar_producto.value = find.find((permiso) => permiso === 'agregar_producto')
})

onMounted(async () => {
    if(AppActiveUser.value.permissions){
        agregar_producto.value = AppActiveUser.value.permissions.find((permiso) => permiso === 'agregar_producto')
    }
    
    await getProductos()
})
  
</script>
  