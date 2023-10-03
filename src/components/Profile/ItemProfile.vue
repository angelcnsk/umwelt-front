<template>
    <div>
      <q-item :to="{name:'profile'}" active-class="q-item-no-link-highlighting">
        <q-item-section avatar>
          <q-icon name="face_5" :class="{'text-primary': darkMode, 'text-dark':!darkMode}" />
        </q-item-section>
        
        <q-item-section>
            <q-item-label>Perfil</q-item-label>
        </q-item-section>
        
      </q-item>
      
      <q-item to="/logout" active-class="q-item-no-link-highlighting">
        <q-item-section avatar>
          <q-icon name="logout" :class="{'text-primary': darkMode, 'text-dark':!darkMode}" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cerrar sesión</q-item-label>
        </q-item-section>
      </q-item>
      
    </div>
  </template>
  
  <script>
  import {defineComponent, onUnmounted} from 'vue'
  
  export default defineComponent({
    name: "ItemsProfile",
    setup() {
      
      const darkMode = JSON.parse(localStorage.getItem('darkMode'))
      
      return {
       darkMode
      }
    }
  })
  </script>
  
  <style scoped>
  
  </style>
  