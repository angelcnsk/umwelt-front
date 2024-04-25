<template>
    <q-page class="q-pa-sm">
        <div class="row" >
            <div class="col-md-3">
                <q-card>
                  <q-card-section>
                    Notificaciones
                  </q-card-section>
                  <q-separator  inset />
                  <q-card-section ripple>
                    <q-list>
                      <q-item v-for="notify,i in notifications.items" :key="i">
                        <q-item-section>{{notify.notify}} - {{ notify.planta }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
            </div>
        </div>
        
    </q-page>
  </template>
  
  <script setup>
  //seguir el mismo ejemplo para crear todo como componente
  import {onMounted, ref} from 'vue'
  import { mensajes } from 'src/composables/firebase/notificaciones'

  const notifications = ref(mensajes)
  // const CardBasic = defineAsyncComponent(() => import('components/cards/CardBasic.vue'))
  
  </script>
  