<template>
  <q-layout view="hHr LpR lFr">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
          color="orange"
        />
        <q-toolbar-title class="text-primary">
          <span class="text-bold">Umwelt</span>
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-icon name="wifi_off" color="red" size="md" v-if="!online">
            <q-tooltip max-width="200px" self="top middle" class="bg-red" >
              Sin conexión a internet, funcionalidad limitada
            </q-tooltip>
          </q-icon>
          <q-btn round dense flat color="primary" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              {{notifications.unread}}
            </q-badge>
            <q-menu
            >
              <q-list style="min-width: 100px">
                <q-item clickable 
                  v-ripple 
                  v-for="(notify, i) in notifications.items" 
                  :key="i"
                  @click="viewNotify(notify)"
                >
                  <q-item-section>
                    <div>
                      <q-badge color="red-5" v-if="!notify.view">No leído</q-badge>
                      <q-badge color="green-3" v-else>Leído</q-badge>
                    </div>
                    <div class="q-pa-sm ">
                      {{notify.notify}}
                    </div>
                    
                  </q-item-section>
                </q-item>
                <q-card class="text-center no-shadow no-border">
                  <q-btn label="View All" style="max-width: 120px !important;" flat dense
                         class="text-indigo-8"></q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-btn>
          
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      elevated
      color="primary"
      class=" text-grey-8"
    >

      <div class="row justify-center q-mt-md">
        <q-btn round flat>
            <q-avatar size="56px" @click="$router.push('/admin/profile')">
              <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png"> -->
              <img :src="AppActiveUser.avatar" v-if="AppActiveUser.avatar != null">
              <img v-else :src="incognit" >
            </q-avatar>
            <q-menu class="text-green text-center"
            >
            </q-menu>
          </q-btn>
      </div>
      <div class="row justify-center q-mt-sm">
        <p>{{ AppActiveUser.email }}</p>
      </div>
      <div class="row justify-center">
        <p class="text-caption text-primary">{{ AppActiveUser.role }}</p>
      </div>
      <q-list >
        <q-expansion-item v-for="(menu,index) in menus" :key="index" :icon="menu.icon" :label="menu.title" class="q-pa-sm" >
          <q-list v-for="(item, i) in menu.children" :key="i"  class="q-pl-lg">
            <q-item :to="item.route" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="arrow_right"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
            </q-item-section>
          </q-item>
          </q-list>
        </q-expansion-item>
        <q-item to="/logout" active-class="q-item-no-link-highlighting" class="q-pa-sm">
            <q-item-section avatar class="q-pa-md">
              <q-icon name="logout" :class="{'text-primary': darkMode, 'text-dark':!darkMode}" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cerrar sesión</q-item-label>
            </q-item-section>
          </q-item>
      </q-list>
    </q-drawer>

    <q-page-container :class="{'bg-grey-5': darkMode, '':!darkMode}">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'

import { ref, onMounted, provide } from 'vue'
import { useUsers } from 'src/composables/useUsers.js'
import { getNotify, setNotifyView } from 'src/composables/firebase/notificaciones'

const leftDrawerOpen = ref(false)
const $q = useQuasar()
const $store = useUsers();
const {fetchUser, menus, AppActiveUser} = $store

const incognit = ref("https://firebasestorage.googleapis.com/v0/b/umwelt-4afa1.appspot.com/o/assets%2Favatar-s-11.png?alt=media&token=1d9c1292-75e8-4f8e-a8b4-64e80ce42087&_gl=1*52kp9q*_ga*NzAyNDQwMzI5LjE2OTQ4MjY4Mzg.*_ga_CW55HF8NVT*MTY5NjQ3NDY0OC41MC4xLjE2OTY0NzYyMDUuMTYuMC4w")

const notifications = ref([])
const icon = ref('')
const darkMode = ref(JSON.parse(localStorage.getItem('darkMode')))
const user = JSON.parse(localStorage.getItem('userInfo'))

$q.dark.set(false)

// console.log($q.dark)
if(darkMode.value != null){
  icon.value = darkMode.value ? 'sunny' : 'bedtime'
  $q.dark.set(darkMode.value)
}
// console.log($q.dark)
// calling here; equivalent to when component is created
// const setDarkMode = () => {
//   darkMode.value = !darkMode.value
//   icon.value = darkMode.value ? 'sunny' : 'bedtime'
//   localStorage.setItem('darkMode', darkMode.value)
//   $q.dark.set(darkMode.value)
// }

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const viewNotify = async (item) => {
  setNotifyView(item)
}

const online = ref(navigator.onLine) // con internet true sin internet false

provide('statusOnLine', online);
provide('currentUser', AppActiveUser)
provide('incognit', incognit)

onMounted(async() => {
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
  
})


</script>
