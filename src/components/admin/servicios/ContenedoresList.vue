<template>
  <div class="q-ma-sm" style="margin-top: 50px;" v-if="service.id != undefined">
    <div class="col-xs-12 col-md-2">
      <q-btn class="q-mr-md " label="Recipiente" icon-right="add" color="primary" @click="showDialog = !showDialog" />
    </div>

    <div class="row q-mt-lg">
        <div class="col-xs-12">
            <q-table
                style="height: 300px"
                virtual-scroll
                title="Recipientes sujetos a presión"
                :rows="containers"
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
                    
                    <q-btn icon="delete" color="red-3" class="q-mr-sm" @click="remove(props.row)">
                        <q-tooltip>Borrar archivo</q-tooltip>
                    </q-btn>
                </q-td>
            </template>
            </q-table>
        </div>    
    </div>
    <add-container
      v-model="showDialog"
      :service="service"
      :visitas="visitas"
      :hide="() => showDialog = false"
    />
  </div>
</template>

<script setup>
  import { ref, toRef, computed, onMounted, watch } from "vue";
  import { useQuasar } from "quasar";
  import { useServicios } from 'src/composables/useServicios.js';
  import addContainer from 'src/components/admin/servicios/AddContenedor.vue'

  const {getContainers, removeContainer, containers} = useServicios();
  const props = defineProps({
    service: Object,
  })
  const $q = useQuasar();
  const service = toRef(props,'service')
  const showDialog = ref(false)
  
  watch(showDialog, async () => {
    if (service.value != undefined) {
      await getContainers({service_id:service.value.id})
    }
  })

  const visitas = computed(() => {
    return service.value.fechas.map((item) => {
    return {id:item.id, label:`Visita ${item.visita}`}
    })
  })

  const columns = ref([
    {
      label: 'Id',
      field: 'id',
      sortable:false,
      align:'center'
    },
    {
      label: 'Recipiente',
      field: 'name',
      sortable:false,
      align:'center'
    },
    {
      label: 'ID/NS',
      field: 'serial',
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
    
  const remove = async (row) => {
    $q.dialog({
            title: '¿Deseas borrar este recipiente?',
            message: 'Se perderán todos los valores capturados',
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
      const removeRsp = await removeContainer(
        {service_id:service.value.id, id:row.id}
      )
            
      if(removeRsp.status == 200){
        $q.notify({
          position:'top',
          type:'positive',
          message:'Se borró el recipiente'
        })
        await getContainers({service_id:service.value.id});
        
      } else {
        $q.notify({
          position:'top',
          type:'negative',
          message:'Error al borrar recipiente'
        })
      }
    })  
  }

  onMounted(async () => {
    await getContainers({service_id:service.value.id})
  })
</script>
