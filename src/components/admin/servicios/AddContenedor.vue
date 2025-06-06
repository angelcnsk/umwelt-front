<template>
<q-dialog v-model="showDialog" transition-show="flip-down" transition-hide="flip-up" persistent>
      <q-card style="min-width: 450px;">
        <q-card-section>
          <div class="col-xs-12 col-md-4">
              <q-input class="q-pa-sm" v-model="addContainer.name" label="Nombre Recipiente" />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="col-xs-12 col-md-4">
              <q-input class="q-pa-sm" v-model="addContainer.serial" label="TAG" />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="col-xs-12 col-md-3">
            <q-select 
              class="q-ma-sm" 
              :options="visitas"
              option-value="id"
              option-label="label"
              v-model="addContainer.visita_id"
              emit-value
              map-options
              label="Visita"
            />
          </div>
        </q-card-section>
        <q-card-section class="row q-pa-lg justify-around items-center ">
          <q-btn label="Cancelar" color="black" @click="props.hide()"/>
          <q-btn label="Guardar" color="primary" @click="saveContainer"/>
        </q-card-section>
      </q-card>
</q-dialog>  
</template>

<script setup>
import { ref, toRef, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { useServicios } from 'src/composables/useServicios.js';
const { addContainers } = useServicios();
const props = defineProps({
  service: Object,
  show: Boolean,
  hide: Function,
});
const $q = useQuasar();
const service = toRef(props, 'service');
const showDialog = toRef(props, 'show');
const addContainer = ref({});
const visitas = computed(() => {
  return service.value.fechas.map((item) => {
    return { id: item.id, label: `Visita ${item.visita}` };
  });
});

watch(showDialog, () => {
  addContainer.value = {};
});
const saveContainer = async () => {
    $q.dialog({
            title: '¿Deseas agregar un recipiente?',
            message: '',
            ok: {
                push: true,
                label:'Continuar'
            },
            cancel: {
                push: true,
                color: 'dark',
                label:'Cancelar'
            },
            persistent: true
    }).onOk(async () => {
      addContainer.value.service_id = service.value.id;
      addContainer.value.product_id = service.value.product_id;
      
      const newContainer = await addContainers(addContainer.value);   
            
      if(newContainer.status == 200){
        $q.notify({
          position:'top',
          type:'positive',
          message:'Se agregó un nuevo recipiente'
        })
        
        props.hide();
      } else {
        $q.notify({
          position:'top',
          type:'negative',
          message:'Ya existe un recipiente con ese identificador'
        })
      }
    })  
}
</script>