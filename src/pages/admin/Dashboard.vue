<template>
    <q-page class="q-pa-sm">
        <div class="row" >
            <div class="col-md-3">
                <card-basic />
            </div>
            <div class="col-md-3">
                <card-basic />
            </div>
            <div class="col-md-3">
                <card-basic />
            </div>
            <div class="col-md-3">
                <card-basic />
            </div>
        </div>
        
    </q-page>
  </template>
  
  <script>
  //seguir el mismo ejemplo para crear todo como componente
  import {defineComponent,defineAsyncComponent} from 'vue'
  
  export default defineComponent({
    name: 'dashBoardAdmin',
    components: {
      CardBasic: defineAsyncComponent(() => import('components/cards/CardBasic.vue')),
    },
    setup() {
      return {
        
      }
    },
  
  })
  </script>
  