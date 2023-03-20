<template>
    <q-page class="q-pa-sm">
        <div class="row" >
            <div class="col-md-12">
                <q-card bordered class="q-pa-sm bg-primary"> 
                    <q-card-section>
                        <h4>Tu trabajo es importante para el medio ambiente</h4>
                        <p class="text-subtitle2">Bienvenido, no olvides estar atento a las notificaciones del sistema.</p>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        
    </q-page>
  </template>
  
  <script>
  //seguir el mismo ejemplo para crear todo como componente
  import {defineComponent,defineAsyncComponent} from 'vue'
  
  export default defineComponent({
    name: 'dashBoardAdmin',
    // components: {
    //   CardSocial: defineAsyncComponent(() => import('components/cards/CardSocial.vue')),
    // },
    setup() {
      return {
        
      }
    },
  
  })
  </script>
  