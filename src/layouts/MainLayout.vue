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
          <!-- <q-avatar>
            <img src="~/assets/icon_greenlab.png">
          </q-avatar> -->
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn> -->
          <!-- <q-btn round dense flat color="grey" :icon="icon" @click="setDarkMode" /> -->
          <q-btn round dense flat color="primary" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              {{notifications.length}}
            </q-badge>
            <q-menu
            >
              <q-list style="min-width: 100px">
                <q-item clickable 
                  v-ripple 
                  v-for="(notify, i) in notifications" 
                  :key="i"
                  @click="viewNotify(notify)"
                >
                  <q-item-section v-if="!notify.view">{{notify.notify}}</q-item-section>
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
              <img v-else src="avatar-s-11.png" >
            </q-avatar>
            <q-menu class="text-green text-center"
            >
              <!-- <q-list style="min-width: 180px" class="text-center">
                <items-profile />
              </q-list> -->
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
// import EssentialLink from 'components/EssentialLink.vue'

import { useQuasar } from 'quasar'

import { ref, onMounted, provide } from 'vue'
import { useUsers } from 'src/composables/useUsers.js'
import { getNotify, setNotifyView } from 'src/composables/firebase/notificaciones'

const leftDrawerOpen = ref(false)
const $q = useQuasar()
const $store = useUsers();
const {fetchUser, menus, AppActiveUser} = $store

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
const setDarkMode = () => {
  darkMode.value = !darkMode.value
  icon.value = darkMode.value ? 'sunny' : 'bedtime'
  localStorage.setItem('darkMode', darkMode.value)
  $q.dark.set(darkMode.value)
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const viewNotify = async (item) => {
  setNotifyView(item)
}

const offline = ref(false)

provide('statusOnLine', offline);

onMounted(async() => {
  notifications.value = await getNotify()
  
  window.addEventListener('offline',() => {
    offline.value = true
  })

  window.addEventListener('online', async () => {
    offline.value = false
  })
  
  if(!offline.value){  
    console.log('sin conexión?', offline.value)
    //data sin conexión, se obtiene del localStorage
    AppActiveUser.value = user
    menus.value = AppActiveUser.value.menus
    
  } else {
    console.log('hace fetch', offline.value)
    await fetchUser()
  }
  
})


</script>
