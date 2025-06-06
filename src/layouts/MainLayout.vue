<template>
  <q-layout view="lHh Lpr lff" class="q-pa-sm"
    :class="{'bg-white': !$q.dark.isActive, 'bg-grey-10': $q.dark.isActive}"
  >
    <!-- Header -->
    <q-header  class="text-black q-px-lg  q-mt-md q-mb-md bg-transparent">
      <q-card>
        <q-toolbar elevated class="q-px-md q-pa-sm rounded-borders" 
          :class="{'bg-white': !$q.dark.isActive, 'bg-grey-9': $q.dark.isActive}"
        >

      <!-- Botón menú -->
      <q-btn flat dense round color="grey-5" icon="menu" @click="drawerOpen = !drawerOpen" class="q-mr-md" />

      <!-- Search bar -->
      <!-- <div class="row items-center bg-grey-2 q-px-md q-py-xs rounded-borders" style="flex: 1; max-width: 500px;">
        <q-icon name="search" class="q-mr-sm" />
        <q-input 
          dense 
          borderless 
          placeholder="Buscar..."
          v-model="search"
          style="flex: 1;"
        />
      </div> -->

      <q-space />

      <!-- Botones lado derecho -->
      <div class="row items-center q-gutter-md">

        <!-- Modo Claro/Oscuro -->
        <q-btn flat round dense :icon="Dark.isActive ? 'light_mode' : 'dark_mode'" :color="Dark.isActive ? 'white' : 'indigo-7' " @click="toggleDarkMode" />

        <!-- Cambiar idioma -->
        <!-- <q-btn flat round dense>
          <q-icon name="translate" color="indigo-7" />
        </q-btn> -->

        <!-- Grid de apps -->
        <!-- <q-btn flat round dense icon="grid_view" /> -->

        <!-- Notificaciones con badge -->
        <notifications-component />

        <!-- Avatar usuario -->
        <q-avatar size="32px">
          <img src="https://randomuser.me/api/portraits/women/1.jpg" />
          <!-- Online green dot -->
          <q-badge color="green" rounded floating />
        </q-avatar>

      </div>

    </q-toolbar>  
      </q-card>  
    
    </q-header>

    <!-- Sidebar -->
    <my-sidebar v-model="drawerOpen" :menus="menus" />

    <!-- Contenido principal -->
    <q-page-container class="q-mt-lg q-mb-md">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar, Dark } from 'quasar'

import { ref, onMounted, provide } from 'vue'
import { useUsers } from 'src/composables/useUsers.js'

import MySidebar from 'components/MySidebar.vue';
import NotificationsComponent from 'components/NotificationsComponent.vue';

const drawerOpen = ref(false)
const $q = useQuasar()
const $store = useUsers();
const {fetchUser, menus, AppActiveUser} = $store

const incognit = ref("https://firebasestorage.googleapis.com/v0/b/umwelt-4afa1.appspot.com/o/assets%2Favatar-s-11.png?alt=media&token=1d9c1292-75e8-4f8e-a8b4-64e80ce42087&_gl=1*52kp9q*_ga*NzAyNDQwMzI5LjE2OTQ4MjY4Mzg.*_ga_CW55HF8NVT*MTY5NjQ3NDY0OC41MC4xLjE2OTY0NzYyMDUuMTYuMC4w")


const icon = ref('')
const darkMode = ref(JSON.parse(localStorage.getItem('darkMode')))
const user = JSON.parse(localStorage.getItem('userInfo'))
const gsToken = import.meta.env.VITE_GS_TOKEN;

$q.dark.set(false)


if(darkMode.value != null){
  icon.value = darkMode.value ? 'sunny' : 'bedtime'
  $q.dark.set(darkMode.value)
}
function toggleDarkMode() {
  Dark.toggle();
  localStorage.setItem('darkMode', Dark.isActive ? 'true' : 'false')
}

const online = ref(navigator.onLine) // con internet true sin internet false

provide('statusOnLine', online);
provide('currentUser', AppActiveUser)
provide('incognit', incognit)

onMounted(async() => {

  if (!gsToken) {
    console.warn("GS token is not defined")
    return
  }

  if (!document.getElementById('gosquared-script')) {
    const script = document.createElement('script')
    script.id = 'gosquared-script'
    script.src = 'https://d1l6p2sc9645hc.cloudfront.net/gosquared.js'
    script.async = true
    script.onload = () => {
      if (typeof _gs === 'function') {
        window._gs && window._gs(gsToken)
        window._gs && window._gs('set', 'anonymizeIP', true)
        window._gs && window._gs('set', 'trackLocal', true)
      }
    }
    document.head.appendChild(script)
  } else if (typeof _gs === 'function') {
    window._gs && window._gs(gsToken)
    window._gs && window._gs('set', 'anonymizeIP', true)
    window._gs && window._gs('set', 'trackLocal', true)
  }

  window.addEventListener('offline',() => {
    online.value = navigator.onLine;
    console.log('desconectado')
  })

  window.addEventListener('online', async () => {
    online.value = navigator.onLine
    console.log('conectado')
  })
  
  
  if(online.value){  
    await fetchUser()    
  } else {
    //data sin conexión, se obtiene del localStorage
    AppActiveUser.value = user
    menus.value = AppActiveUser.value.menus
  }

})


</script>

<style scoped>
.rounded-borders {
  border-radius: 10px;
}
</style>