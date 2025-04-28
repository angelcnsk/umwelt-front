<template>
  <q-layout view="lHh lpR lFf" class="bg-grey-2 q-pa-sm">
    <!-- Header -->
    <q-header  class="bg-grey-2 text-black q-px-lg  q-mt-md q-mb-md">
      
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
        <q-btn flat round dense icon="notifications" color="primary">
          <q-badge color="red" floating>2</q-badge>
        </q-btn>

        <!-- Avatar usuario -->
        <q-avatar size="32px">
          <img src="https://randomuser.me/api/portraits/women/1.jpg" />
          <!-- Online green dot -->
          <q-badge color="green" rounded floating />
        </q-avatar>

      </div>

    </q-toolbar>
  </q-header>

    <!-- Sidebar -->
    <my-sidebar v-model="drawerOpen" :menus="menus" />

    <!-- Contenido principal -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar, Dark } from 'quasar'

import { ref, onMounted, provide } from 'vue'
import { useUsers } from 'src/composables/useUsers.js'
import { getNotify } from 'src/composables/firebase/notificaciones';
import MySidebar from 'components/MySidebar.vue';

const drawerOpen = ref(false)
const $q = useQuasar()
const $store = useUsers();
const {fetchUser, menus, AppActiveUser} = $store

const incognit = ref("https://firebasestorage.googleapis.com/v0/b/umwelt-4afa1.appspot.com/o/assets%2Favatar-s-11.png?alt=media&token=1d9c1292-75e8-4f8e-a8b4-64e80ce42087&_gl=1*52kp9q*_ga*NzAyNDQwMzI5LjE2OTQ4MjY4Mzg.*_ga_CW55HF8NVT*MTY5NjQ3NDY0OC41MC4xLjE2OTY0NzYyMDUuMTYuMC4w")

const notifications = ref([])
const icon = ref('')
const darkMode = ref(JSON.parse(localStorage.getItem('darkMode')))
const user = JSON.parse(localStorage.getItem('userInfo'))
// const search = ref('')
$q.dark.set(false)


if(darkMode.value != null){
  icon.value = darkMode.value ? 'sunny' : 'bedtime'
  $q.dark.set(darkMode.value)
}
function toggleDarkMode() {
  Dark.toggle();
  localStorage.setItem('darkMode', Dark.isActive ? 'true' : 'false')
}

// const viewNotify = async (item) => {
//   setNotifyView(item)
// }

const online = ref(navigator.onLine) // con internet true sin internet false

provide('statusOnLine', online);
provide('currentUser', AppActiveUser)
provide('incognit', incognit)

onMounted(async() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    Dark.set(savedDarkMode === 'true')
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
    notifications.value = await getNotify(user)
    await fetchUser()    
  } else {
    //data sin conexión, se obtiene del localStorage
    AppActiveUser.value = user
    menus.value = AppActiveUser.value.menus
  }
  console.log('AppActiveUser', menus.value)
})


</script>

<style scoped>
.rounded-borders {
  border-radius: 10px;
}
</style>